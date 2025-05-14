from flask import Flask, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow cross-origin requests (important for React <-> Flask)

UPLOAD_FOLDER = 'frames'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    if not request.data:
        return 'No frame data received', 400

    # Create a timestamped filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S%f')
    filename = os.path.join(UPLOAD_FOLDER, f'frame_{timestamp}.jpg')

    # Save the image data
    with open(filename, 'wb') as f:
        f.write(request.data)

    print(f"[INFO] Saved: {filename}")
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
