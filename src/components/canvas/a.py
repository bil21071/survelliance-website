from flask import Flask, request, Response
from flask_cors import CORS
import cv2
import numpy as np
import threading
import traceback
import os
from datetime import datetime
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})
frame = None
is_streaming = True
lock = threading.Lock()



# Create a directory to store images
SAVE_DIR = "C:/Users/Hp/Desktop/NeuraVision.Ai-master/survelliance website/images"
@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    global frame
    if not is_streaming:
        return "Streaming stopped", 403
    
    try:
        file = request.data
        np_arr = np.frombuffer(file, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            print("Failed to decode frame.")
            return "Failed to decode frame", 500

        # Ensure save directory exists
        if not os.path.exists(SAVE_DIR):
            os.makedirs(SAVE_DIR)

        # Save the frame
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")
        filepath = os.path.join(SAVE_DIR, f"frame_{timestamp}.jpg")
        success = cv2.imwrite(filepath, frame)

        if not success:
            print(f"Failed to save frame to {filepath}")
            return "Failed to save frame", 500

        print(f"Saved frame at {filepath}")
        return "Frame received and saved", 200

    except Exception as e:
        print(f"Error saving frame: {e}")
        return "Internal Server Error", 500

def generate_frames():
    global frame, is_streaming
    while is_streaming:
        if frame is not None:
            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

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
    app.run(host="0.0.0.0", port=5000)
