from flask import Flask, request, send_file
import io
from datetime import datetime

app = Flask(__name__)

# Store the latest frame in memory (as bytes)
latest_frame = None

@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    global latest_frame

    if not request.data:
        return 'No frame data received', 400

    # Store the frame in memory
    latest_frame = io.BytesIO(request.data)

    print(f"[INFO] Frame received and stored in memory.")
    return 'OK', 200

@app.route('/latest_frame', methods=['GET'])
def get_latest_frame():
    if latest_frame:
        # Return the latest frame stored in memory
        latest_frame.seek(0)  # Reset the pointer to the beginning of the BytesIO object
        return send_file(latest_frame, mimetype='image/jpeg')
    else:
        return 'No frame available', 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
