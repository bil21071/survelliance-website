from flask import Flask, Response,send_from_directory
import os
import tensorflow as tf
from flask_cors import CORS
import cv2
import threading
import time
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from utils import motion, yolo_world_v8
from utils.combined_fall_jump import fall_jump_v8
from utils.tracking_functions import weapon_tracking, fire_tracking,fall_jump_combined_tracking
from logs.Logger import Logs
from threading import Lock
from logs.logging_config import stream_logger
from utils.detection_state import DetectionState  # <-- imported your class
from flask import Flask, Response, send_from_directory, request, jsonify, send_file
from werkzeug.utils import secure_filename
from collections import deque
from datetime import datetime
from firebase_config import db_ref
import uuid
debounce_lock = Lock()
# Logging
logger = Logs()
logger.enable_logs()

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Globals
frame = None
is_streaming = True
lock = threading.Lock()

# RTSP stream
rtsp_url = "rtsp://admin:YQAQYJ@192.168.1.18:554/h264/main"
MAX_RETRIES = 5
RETRY_DELAY = 5

# Executors
executorcombined = ThreadPoolExecutor(max_workers=3)
executor = ThreadPoolExecutor(max_workers=5)
FIGHT_UPLOAD_FOLDER = "fight_uploads"
FIGHT_OUTPUT_FOLDER = "fight_outputs"
os.makedirs(FIGHT_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FIGHT_OUTPUT_FOLDER, exist_ok=True)

# Load fight detection model
model = tf.keras.models.load_model("D:/fightw.h5")
fight_classes = ['Normal', 'Violence']
# Detection state using class
conn = DetectionState()
def process_fight_video(input_path, output_path, location="Surveillance Area 1"):
    cap = cv2.VideoCapture(input_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_buffer = deque(maxlen=30)
    frame_count = 0
    violence_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        resized = cv2.resize(frame, (160, 160))
        normalized = resized.astype("float32") / 255.0
        frame_buffer.append(normalized)

        if len(frame_buffer) == 30:
            input_seq = np.expand_dims(np.array(frame_buffer), axis=0)
            preds = model.predict(input_seq, verbose=0)[0]
            class_idx = np.argmax(preds)
            label = f"{fight_classes[class_idx]} ({preds[class_idx]*100:.1f}%)"
            color = (0, 255, 0) if class_idx == 0 else (0, 0, 255)

            (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)
            x = (width - text_width) // 2
            y = (height + text_height) // 2
            cv2.putText(frame, label, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            cv2.rectangle(frame, (10, 10), (width - 10, height - 10), color, 2)

            if fight_classes[class_idx] == "Violence":
                violence_count += 1
                save_detection_to_firebase("Violence", location, frame)

            frame_buffer.clear()

        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()

def save_detection_to_firebase(event_type, location, frame):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = f"{event_type}_{uuid.uuid4().hex}.jpg"
    local_path = os.path.join("saved_framesforfight", filename)

    os.makedirs("saved_framesforfight", exist_ok=True)
    cv2.imwrite(local_path, frame)

    # Serve image via Flask
    image_url = f"http://localhost:5000/frames/{filename.replace(' ', '%20')}"

    data = {
        "event": event_type,
        "timestamp": timestamp,
        "location": location,
        "local_path": local_path
    }

    db_ref.child("fightdetections").push().set(data)

    
@app.route("/upload_fight", methods=["POST"])
def upload_fight_video():
    file = request.files.get("video")
    if not file:
        return jsonify({"error": "No video uploaded"}), 400

    filename = secure_filename(file.filename)
    input_path = os.path.join(FIGHT_UPLOAD_FOLDER, filename)
    output_path = os.path.join(FIGHT_OUTPUT_FOLDER, f"processed_{filename}")

    file.save(input_path)
    process_fight_video(input_path, output_path)

    return jsonify({
        "message": "Fight detection completed",
        "download_url": f"/download_fight/{os.path.basename(output_path)}"
    })
@app.route("/download_fight/<filename>")
def download_fight_video(filename):
    return send_file(os.path.join(FIGHT_OUTPUT_FOLDER, filename), as_attachment=True)

# Stream initializer
def initialize_stream():
    for attempt in range(1, MAX_RETRIES + 1):
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print(f"✅ Successfully opened RTSP stream on attempt {attempt}")
            return cap
        print(f"⚠️ Attempt {attempt}/{MAX_RETRIES} - Could not open RTSP stream. Retrying in {RETRY_DELAY} seconds...")
        cap.release()
        time.sleep(RETRY_DELAY)
    print("❌ Max retries reached. Unable to open RTSP stream.")
    return None

# Initial stream open
cap = initialize_stream()

# Detection thread functions
def run_fall_jump_thread(frame, conn):
    fall_jump_combined_tracking(frame,conn)

def run_yolo_detection_thread(frame, conn):
    new_detections, _ = yolo_world_v8.score_frame_new(frame, threshold=0.2, conn_dict=conn)
    detected_classes = set(d[0] for d in new_detections)

    if detected_classes:
        tasks = []
        if any(weapon in detected_classes for weapon in ['Mobile', 'Pistol', 'Pistol_hand', 'Rifle', 'Rifle_hand', 'Keyboard', 'toy','not_weapon']):
            tasks.append(executor.submit(weapon_tracking, frame,conn_dict=conn))

        if any(fire in detected_classes for fire in ['Fire', 'Smoke', 'Stove', 'Not_fire','Fire', 'Smoke', 'Stove', 'Not_fire']):
            tasks.append(executor.submit(fire_tracking, frame,conn_dict=conn))

        [task.result() for task in tasks]

# Frame generator
def generate_frames():
    global frame, is_streaming, cap, conn

    frame_count = 0
    start_time = time.time()

    while is_streaming:
        if cap is None or not cap.isOpened():
            cap = initialize_stream()
            if cap is None:
                print("❌ Exiting stream due to repeated failures.")
                break
            start_time = time.time()
            frame_count = 0

        ret, frame = cap.read()
        if not ret:
            print("⚠️ Error: Failed to capture frame from RTSP stream.")
            continue

        if not conn.check:
            try:
                gray_init = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                conn.previous_frame = cv2.GaussianBlur(gray_init, (5, 5), 0)
                conn.check = True
                logger.info("Initialized previous_frame for motion detection.")
            except Exception as e:
                stream_logger.error(f"Exception in initializing previous_frame: {e}")
                continue

        text, prev_frame = motion.motion_detect(frame, conn.previous_frame)
        conn.previous_frame = prev_frame

        if text == "DANGER":
            print("🚨 Motion detected!")
            executorcombined.submit(run_yolo_detection_thread, frame, conn)
            executor.submit(run_fall_jump_thread, frame, conn)

        # FPS monitoring
        frame_count += 1
        elapsed_time = time.time() - start_time
        if elapsed_time >= 1.0:
            print(f"🎥 FPS: {frame_count}")
            frame_count = 0
            start_time = time.time()

        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    cap.release()

# Routes
@app.route('/video_feed')
def video_feed():
    global is_streaming
    is_streaming = True
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/frames/<path:filename>")
def get_frame(filename):
    return send_from_directory("saved_frames", filename)

@app.route('/stop_feed', methods=['POST'])
def stop_feed():
    global is_streaming
    with lock:
        is_streaming = False
    return "Streaming stopped", 200

# Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
