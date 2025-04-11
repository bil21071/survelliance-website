from utils.yolo_base import BaseYOLOModel
import numpy as np
import torch

class FallJumpModel(BaseYOLOModel):
    """YOLO model for detecting fall and jump events."""

    def __init__(self):
        super().__init__(
            model_paths={
                "cuda": "weights/fall_jump_combined_1_1_25_yolo11n_best.pt",
                "cpu": "weights/fall_jump_combined_1_1_25_yolo11n_best.pt",
            },
            confidence_threshold=0.7,
            nms_threshold=0.3,
            unwanted_classes=["sitting", "standing", "s_wall", "walking", "not_fall"]
        )

    def score_frame(self, frame):
        """Processes frame through the model and returns detected class names, indices and keypoints."""
        detected_classes, bbox_indices = super().score_frame(frame)
        
        # Get keypoints if available
        results = self.model([frame], conf=self.confidence_threshold, iou=self.nms_threshold,
                           save=False, device=self.device, verbose=False)
        
        keypoints = []
        for result in results:
            if result.keypoints is not None:
                keypoints.extend(result.keypoints.xy.tolist())

        return detected_classes, bbox_indices, keypoints

# Instantiate the model
fall_jump_v8 = FallJumpModel()