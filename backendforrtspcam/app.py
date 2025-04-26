from flask import Flask, Response
from flask_cors import CORS
import cv2
import threading
import time
print("hello")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

frame = None
is_streaming = True
lock = threading.Lock()

# RTSP stream URL
rtsp_url = "rtsp://192.168.1.5/live/ch00_1"

# Maximum retry attempts
MAX_RETRIES = 5
RETRY_DELAY = 5  # seconds

# Function to initialize the RTSP stream with retry logic
def initialize_stream():
    for attempt in range(1, MAX_RETRIES + 1):
        cap = cv2.VideoCapture(rtsp_url)
        if cap.isOpened():
            print(f"✅ Successfully opened RTSP stream on attempt {attempt}")
            return cap
        print(f"⚠️ Attempt {attempt}/{MAX_RETRIES} - Could not open RTSP stream. Retrying in {RETRY_DELAY} seconds...")
        cap.release()
        time.sleep(RETRY_DELAY)

    print("❌ Max retries reached. Unable to open RTSP stream.")
    return None  # Return None if all attempts fail

# Open the RTSP stream initially
cap = initialize_stream()

def generate_frames():
    global frame, is_streaming, cap

    # FPS counter variables
    frame_count = 0
    start_time = time.time()

    while is_streaming:
        if cap is None or not cap.isOpened():
            cap = initialize_stream()  # Retry if the stream is unavailable

            if cap is None:  # If the retry limit is reached, stop the stream
                print("❌ Exiting stream due to repeated failures.")
                break  

            # Reset FPS counter after reinitialization
            start_time = time.time()
            frame_count = 0

        if cap is not None and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("⚠️ Error: Failed to capture frame from RTSP stream.")
                continue  # Skip this loop iteration if no frame is captured

            # Increase frame counter
            frame_count += 1
            elapsed_time = time.time() - start_time
            if elapsed_time >= 1.0:  # Every 1 second, print FPS and reset counter
                print(f"🎥 FPS: {frame_count}")
                frame_count = 0
                start_time = time.time()

            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        else:
            time.sleep(1)  # If no frame is available, wait before retrying

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
