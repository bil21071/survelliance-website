import cv2
from ultralytics import YOLO

# Load YOLO model
def load_model(model_path='C:/Users/Hp/Desktop/NeuraVision.Ai-master/survelliance website/backendforrtspcam/weights/fall_jump_combined_1_1_25_yolo11n_best.pt'):
    model = YOLO(model_path)
    return model

# Run inference on a frame
def model_inference(model, frame):
    results = model(frame, verbose=False)[0]
    detections = []

    for box in results.boxes:
        cls_id = int(box.cls)
        label = model.names[cls_id]
        if label.lower() == 'fall':
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            detections.append({
                'bbox': [x1, y1, x2, y2],
                'label': label,
                'confidence': conf
            })
    return detections

# Draw boxes on frame
def draw_boxes(frame, detections):
    for det in detections:
        x1, y1, x2, y2 = det['bbox']
        label = det['label']
        conf = det['confidence']
        color = (0, 0, 255)  # Red for fall

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    return frame

# Process a video file and display the output
def process_video_live_display(video_path):
    model = load_model()
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return

    print("Press 'q' to quit video.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        detections = model_inference(model, frame)
        frame = draw_boxes(frame, detections)

        cv2.imshow('Fall Detection Video', frame)

        # Break on 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Example usage
if __name__ == '__main__':
    process_video_live_display("D:/queda.mp4")
