from flask import Flask, Response
import cv2
import threading
import time
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
cap = None
is_streaming = False
lock = threading.Lock()

def open_camera(retries=5, delay=2):
    """Try to open the camera with retries."""
    global cap
    for attempt in range(retries):
        cap = cv2.VideoCapture(1)
        if cap.isOpened():
            print("Camera opened successfully.")
            return True
        print(f"Failed to open camera. Retrying {attempt + 1}/{retries}...")
        time.sleep(delay)
    print("Max retries reached. Could not open camera.")
    return False

def generate_frames():
    global cap, is_streaming
    while is_streaming:
        with lock:
            if cap is None or not cap.isOpened():
                print("Camera lost connection. Attempting to reconnect...")
                if not open_camera():
                    break
            success, frame = cap.read()
            if not success:
                print("Failed to read frame. Retrying...")
                time.sleep(0.1)
                continue
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    print("Stream stopped.")

@app.route('/video_feed')
def video_feed():
    global is_streaming
    with lock:
        if not (cap and cap.isOpened()):
            if not open_camera():
                return "Failed to open camera", 500
        is_streaming = True
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame', headers={
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    })

@app.route('/stop_feed', methods=['POST'])
def stop_feed():
    global is_streaming, cap
    with lock:
        is_streaming = False
        if cap:
            cap.release()
            cap = None
            print("Camera stopped.")
    return "Camera stopped", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
