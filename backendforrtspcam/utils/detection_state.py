# utils/detection_state.py
class DetectionState:
    def __init__(self):
        self.check: bool = False
        self.previous_frame = None

        self.res_weap: str = ""
        self.weap_prev: int = 1

        self.res_parcel: str = ""
        self.parcel_prev: int = 1

        self.res_ges: str = ""
        self.ges_prev: int = 1

        self.res_fire: str = ""
        self.fire_prev: int = 1

        self.res_baby: str = ""
        self.baby_prev: int = 1
        self.counter_b: int = 0
        self.person_count: int = 0

        self.res_fall: str = ""
        self.fall_prev: int = 1

        self.res_jump: str = ""
        self.jump_prev: int = 1
