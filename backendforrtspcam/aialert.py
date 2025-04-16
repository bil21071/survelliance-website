from flask import Flask, Response,send_from_directory

from flask_cors import CORS
import cv2
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from utils import motion, yolo_world_v8
from utils.combined_fall_jump import fall_jump_v8
from utils.tracking_functions import weapon_tracking, fire_tracking
from logs.Logger import Logs
from threading import Lock
from logs.logging_config import stream_logger
from utils.detection_state import DetectionState  # <-- imported your class
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
rtsp_url = "rtsp://192.168.1.5/live/ch00_1"
MAX_RETRIES = 5
RETRY_DELAY = 5

# Executors
executorcombined = ThreadPoolExecutor(max_workers=3)
executor = ThreadPoolExecutor(max_workers=5)

# Detection state using class
conn = DetectionState()

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
    fall_jump_v8(frame)

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
            executorcombined.submit(run_fall_jump_thread, frame, conn)

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
