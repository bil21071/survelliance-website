from flask import Flask, Response
from flask_cors import CORS
import cv2
import threading
import time

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

frame = None
is_streaming = True
lock = threading.Lock()

# RTSP stream URL
rtsp_url = "rtsp://192.168.1.5/live/ch00_1"

# Function to initialize the RTSP stream
def initialize_stream():
    cap = cv2.VideoCapture(rtsp_url)
    if not cap.isOpened():
        print("Error: Could not open RTSP stream.")
        return None
    print("Successfully opened RTSP stream.")
    return cap

# Open the RTSP stream initially
cap = initialize_stream()

def generate_frames():
    global frame, is_streaming, cap

    # FPS counter variables
    frame_count = 0
    start_time = time.time()

    while is_streaming:
        if cap is None or not cap.isOpened():
            cap = initialize_stream()  # Re-initialize if the stream is unavailable
            # Reset FPS counter when reinitializing
            start_time = time.time()
            frame_count = 0

        if cap is not None and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to capture frame from RTSP stream.")
                continue  # Skip to the next loop iteration if no frame is captured

            # Increase frame counter
            frame_count += 1
            elapsed_time = time.time() - start_time
            if elapsed_time >= 1.0:  # Every 1 second, print FPS and reset counter
                print(f"FPS: {frame_count}")
                frame_count = 0
                start_time = time.time()

            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        else:
            time.sleep(1)  # If no frame is available, wait before trying again

@app.route('/video_feed')
def video_feed():
    global is_streaming
    is_streaming = True
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop_feed', methods=['POST'])
def stop_feed():
    global is_streaming
    with lock:
        is_streaming = False
    return "Streaming stopped", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
