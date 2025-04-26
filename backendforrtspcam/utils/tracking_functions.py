import os, os.path
import requests
import json
import threading
from logs.Logger import Logs
from dotenv import load_dotenv
load_dotenv()
logger = Logs()
from threading import Lock
# from utils.gps_location import get_gps_coordinates, get_location_from_osm
debounce_lock=Lock()
logger.enable_logs()
from datetime import datetime
from utils.detection_state import DetectionState
from logs.logging_config import stream_logger
from utils.weapon_v8 import weapon_v8
from utils.detection_state import DetectionState
from utils.fire_v8 import fire_v8
from utils.combined_fall_jump import fall_jump_v8
import cv2
import uuid
from firebase_config import db_ref  
#save the detection for the firebase 
def save_detection_to_firebase(event_type, location, frame):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = f"{event_type}_{uuid.uuid4().hex}.jpg"
    local_path = os.path.join("saved_frames", filename)

    os.makedirs("saved_frames", exist_ok=True)
    cv2.imwrite(local_path, frame)

    # Serve image via Flask
    image_url = f"http://localhost:5000/frames/{filename.replace(' ', '%20')}"

    data = {
        "event": event_type,
        "timestamp": timestamp,
        "location": location,
        "local_path": local_path,
        "image_url": image_url
    }

    db_ref.child("detections").push().set(data)



def fire_tracking(frame, conn_dict):
    '''Provide frames to the model and get detections from it. '''

    # conn_dict
    
    detected_classes, _ = fire_v8.score_frame(frame)
    
    if (detected_classes != ''):
        conn_dict.res_fire = {'Fire': 'None'}
        stream_logger.info('Fire Detected')         
        # try:
        #     lat, lon = get_gps_coordinates()
        #     location = get_location_from_osm(lat, lon)
        # except Exception as e:
        #     stream_logger.warning(f"GPS error: {e}")
        location = "Unknown Location"
        save_detection_to_firebase("Fire Detected", location, frame)            

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
        # try:
        #     lat, lon = get_gps_coordinates()
        #     location = get_location_from_osm(lat, lon)
        # except Exception as e:
        #     stream_logger.warning(f"GPS error: {e}")
        location = "Unknown Location"
        save_detection_to_firebase("Weapon Detected", location, frame)
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
                           
                # try:
                #     lat, lon = get_gps_coordinates()
                #     location = get_location_from_osm(lat, lon)
                # except Exception as e:
                #     stream_logger.warning(f"GPS error: {e}")
                location = "Unknown Location"
                save_detection_to_firebase("Fall is detected", location, frame)
               

                
                break 

            # Jump Detection
            elif detected_class == "jump":
                conn_dict.res_jump = {'Jump': 'None'}
                stream_logger.info(f'Jump detection...{conn_dict.res_jump}')
                location = "Karachi Pakistan"
                save_detection_to_firebase("Jump is detected", location, frame)
                


                break  # Process only one detection per frame
    else:
        conn_dict.res_fall = False
        conn_dict.res_jump = False
        
