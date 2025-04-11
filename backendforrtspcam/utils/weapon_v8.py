from utils.yolo_base import BaseYOLOModel

class WeaponModel(BaseYOLOModel):
    def __init__(self):
        super().__init__(
            model_paths={
                "cuda": "weights/weapon_24_2_25_yolo11n_best.pt", 
                "cpu": "weights/weapon_24_2_25_yolo11n_best.pt"   
            },
            confidence_threshold=0.6,
            nms_threshold=0.3,
            unwanted_classes=["not_weapon", "toy", "Mobile", "Keyboard"]
        )

weapon_v8 = WeaponModel()
