import torch
import numpy as np
import cv2
from ultralytics import YOLO
from logs.Logger import Logs
from logs.logging_config import stream_logger

logger = Logs()


class BaseYOLOModel:
    """Base class for YOLO-based models to avoid redundancy."""

    def __init__(self, model_paths, confidence_threshold=0.5, nms_threshold=0.3, unwanted_classes=None):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_path = model_paths.get(self.device, model_paths["cpu"])
        self.model = YOLO(self.model_path).to(self.device)
        self.classes = self.model.names
        self.confidence_threshold = confidence_threshold
        self.nms_threshold = nms_threshold
        self.unwanted_classes = unwanted_classes if unwanted_classes is not None else []
        

        stream_logger.info(f"Loaded model: {self.model_path} on {self.device}")


    
    def score_frame(self, frame):
        """Processes frame through the model and returns detected class names and their indices."""
        results = self.model([frame], conf=self.confidence_threshold, iou=self.nms_threshold,
                             save=False, device=self.device, verbose=False)

        x_shape, y_shape = frame.shape[1], frame.shape[0]  # Image dimensions
        detected_classes = []
        bbox_indices = []

        for result in results:
            confs = result.boxes.conf.tolist()
            cords = result.boxes.xyxyn.tolist()
            labels = result.boxes.cls.tolist()

            for i, conf in enumerate(confs):
                class_idx = int(labels[i])
                class_name = self.classes[class_idx]

                if conf >= self.confidence_threshold and class_name not in self.unwanted_classes:
                    # Convert normalized bbox coordinates to pixel values
                    x_min, y_min, x_max, y_max = (np.array(cords[i][:4]) * np.array([x_shape, y_shape, x_shape, y_shape])).astype("int")

                    # Calculate bbox area and check if it exceeds 75% of the image
                    bbox_area = (x_max - x_min) * (y_max - y_min)
                    total_area = x_shape * y_shape
                    percent = (bbox_area / total_area) * 100
                    if percent > 75:
                        continue  # Ignore large detections

                    detected_classes.append(class_name)
                    bbox_indices.append(i)

                    stream_logger.info(f'Detected {class_name} with confidence {conf:.2f}')

        return detected_classes, bbox_indices


