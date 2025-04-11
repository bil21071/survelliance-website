from utils.yolo_base import BaseYOLOModel

class FireModel(BaseYOLOModel):
    def __init__(self):
        super().__init__(
            model_paths={
                "cuda": "weights/fire_22_8_24_best.pt", 
                "cpu": "weights/fire_22_8_24_best.pt"   
            },
            nms_threshold=0.3,
            confidence_threshold=0.6,
            unwanted_classes=["Smoke", "Stove", "Not_fire"]
        )

fire_v8 = FireModel()
