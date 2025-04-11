import os, os.path
import requests
import json
import threading
from logs.Logger import Logs
from dotenv import load_dotenv
load_dotenv()
logger = Logs()
from threading import Lock
debounce_lock=Lock()
logger.enable_logs()
from datetime import datetime
from utils.detection_state import DetectionState
from logs.logging_config import stream_logger
from utils.weapon_v8 import weapon_v8
from utils.detection_state import DetectionState
from utils.fire_v8 import fire_v8
from utils.combined_fall_jump import fall_jump_v8



def fire_tracking(frame, conn_dict):
    '''Provide frames to the model and get detections from it. '''

    # conn_dict
    
    detected_classes, _ = fire_v8.score_frame(frame)
    
    if (detected_classes != ''):
        conn_dict.res_fire = {'Fire': 'None'}
        stream_logger.info('Fire Detected')            

        conn_dict.res_fire = False


    else:
        conn_dict.res_fire = False


# This function is used for tracking a weapon in a frame
def weapon_tracking( frame, conn_dict):   
    

    # conn_dict = 
    
    detected_classes, _ = weapon_v8.score_frame(frame)
    
    if (detected_classes != ''):
        conn_dict.res_weap = {'Weapon': 'None'}
        
        stream_logger.info('Weapon Detected')            
        # Store image parameters in `conn_dict`
        conn_dict.res_weap = False
 
        

    else:
        conn_dict.res_weap = False




def fall_jump_combined_tracking( frame, conn_dict):

    # conn_dict =

    detected_classes, _, _ = fall_jump_v8.score_frame(frame)
    
    if detected_classes:
        for detected_class in detected_classes:
            # Fall Detection
            if detected_class == "fall":
                conn_dict.res_fall = {'fall': 'None'}
                stream_logger.info(f'Fall detection...{conn_dict.res_fall}')
               

                
                break 

            # Jump Detection
            elif detected_class == "jump":
                conn_dict.res_jump = {'Jump': 'None'}
                stream_logger.info(f'Jump detection...{conn_dict.res_jump}')
                


                break  # Process only one detection per frame
    else:
        conn_dict.res_fall = False
        conn_dict.res_jump = False
        
