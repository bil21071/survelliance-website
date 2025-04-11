import torch
import numpy as np
import cv2
from ultralytics import YOLO
from tracker.centroidtracker import CentroidTracker
from logs.Logger import Logs
from logs.logging_config import stream_logger

# Initialize logger and centroid tracker
logger = Logs()
tracker = CentroidTracker(maxdisappeared=20, maxdistance=20)
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Set model path based on device availability
if device == 'cuda':
    MODEL_PATH = "weights/combinedModel_27_class_9_12_24_best.pt"
    logger.info("CUDA is available. Loading model for CUDA.")
else:
    MODEL_PATH = "weights/combinedModel_27_class_9_12_24_best.pt"
    logger.info("CUDA is not available. Loading model for CPU.")

# Load YOLO model and send to device
combined_model = YOLO(MODEL_PATH)
combined_model.to(device)
classes = combined_model.names
print(f"Classes: {classes}")


weapon = ["Pistol", "Pistol_hand", "Rifle", "Rifle_hand", "toy"]
fire = ["Fire", "Smoke", "Stove"]


def score_frame_new(frame, threshold, conn_dict):
    """
    Runs the combined YOLO model on the input frame, converts normalized detections
    to pixel coordinates, and uses a centroid tracker to assign a track ID for each detection.
    
    Then, for each detection the assigned track ID is compared against the previous
    track ID stored in conn_dict for the target class. If the detection is new,
    the previous value is updated and the detection is appended.
    
    Args:
        frame (np.array): Input frame (image) for inference.
        threshold (float): Confidence threshold for filtering detections.
        conn_dict (dict): Dictionary with keys (e.g. "weap_prev", "parcel_prev", etc.)
                                that store the previous track IDs for each target class.
    
    Returns:
        new_detections (list): List of tuples for new detections:
                               (class_name, normalized_bbox, bbox_pixel, track_id)
        results: Raw results returned by the YOLO model.
    """
    # Run model inference
    combined_model.to(device)
    results = combined_model(frame, save=False, device=device, verbose=False)

    all_labels, all_cords = [], []
    for result in results:
        if result.boxes is not None:
            conf = result.boxes.conf.tolist()
            coords = result.boxes.xyxyn.tolist()  # Normalized coordinates: [x1, y1, x2, y2]
            labels = result.boxes.cls.tolist()

            # Debug: Log raw YOLO outputs
            

            # Filter detections based on confidence threshold
            filtered_indices = [i for i, c in enumerate(conf) if c >= threshold]
            filtered_conf = [conf[i] for i in filtered_indices]
            filtered_coords = [coords[i] for i in filtered_indices]
            filtered_labels = [labels[i] for i in filtered_indices]

            # Debug: Log filtered detections
            

            # Append the confidence value to each coordinate list
            for i, c in enumerate(filtered_conf):
                filtered_coords[i].append(c)

            all_labels.extend(filtered_labels)
            all_cords.extend(filtered_coords)

    # Convert lists to tensors (if there are any detections)
    all_labels = torch.tensor(all_labels, dtype=torch.int).to(device) if all_labels else torch.tensor([]).to(device)
    all_cords = torch.tensor(all_cords).to(device) if all_cords else torch.tensor([]).to(device)

    # Log detected classes (by name)
    detected_classes = set(classes[int(lbl)] for lbl in all_labels if int(lbl) < len(classes))
    stream_logger.info(f"Combined model detections (Threshold={threshold}): {detected_classes}")

    # Convert normalized bounding boxes to pixel coordinates using frame dimensions
    (H, W) = frame.shape[:2]
    rects = []
    for bbox in all_cords.tolist():
        x1 = int(bbox[0] * W)
        y1 = int(bbox[1] * H)
        x2 = int(bbox[2] * W)
        y2 = int(bbox[3] * H)
        rects.append((x1, y1, x2, y2))
    
    # Update the tracker with the current bounding boxes; this returns a dict mapping objectID -> bbox.
    objects = tracker.update(rects)
    

    # For each detection, assign a track ID by finding the nearest tracked object's center.
    detection_track_ids = []
    for rect in rects:
        cx = (rect[0] + rect[2]) // 2
        cy = (rect[1] + rect[3]) // 2
        min_dist = float('inf')
        assigned_id = None
        for (objectid, bbox) in objects.items():
            bx1, by1, bx2, by2 = bbox
            cx_tracker = (int(bx1) + int(bx2)) // 2
            cy_tracker = (int(by1) + int(by2)) // 2
            d = np.linalg.norm(np.array([cx, cy]) - np.array([cx_tracker, cy_tracker]))
            if d < min_dist:
                min_dist = d
                assigned_id = objectid
        detection_track_ids.append(assigned_id)



    # Now, for each detection, assign the track ID and filter new detections based on conn_dict.
    new_detections = []
    all_labels_list = all_labels.tolist()
    for i, bbox in enumerate(rects):
        # Ensure we have a track ID for this detection
        if i >= len(detection_track_ids):
            stream_logger.warning(f"No track ID for detection index {i}, skipping.")
            continue
        track_id = detection_track_ids[i]
        if all_labels_list[i] < len(classes):
            class_name = classes[all_labels_list[i]]
        else:
            class_name = "Unknown"
            stream_logger.info(f"Detection {i}: class {class_name}, computed track id: {track_id}")
        
        stream_logger.info(f"Detection: Class {class_name}, Track ID: {track_id}")

        # Compare the current track ID with the previous one stored in conn_dict.
        # Only append if the detection is new (i.e. different track ID for that target class).
        if class_name in weapon and track_id != conn_dict.weap_prev:
            conn_dict.weap_prev = track_id
            stream_logger.info(f"New Weapon detection, {class_name} track id: {track_id}")
            new_detections.append((class_name, all_cords[i].tolist(), bbox, track_id))
        elif class_name in fire and track_id != conn_dict.fire_prev:
            conn_dict.fire_prev = track_id
            stream_logger.info(f"New Fire detection, track id: {track_id}")
            new_detections.append((class_name, all_cords[i].tolist(), bbox, track_id))
        elif class_name == "fall" and track_id != conn_dict.fall_prev:
            conn_dict.fall_prev = track_id
            stream_logger.info(f"New Fall detection, track id: {track_id}")
            new_detections.append((class_name, all_cords[i].tolist(), bbox, track_id))
        elif class_name == "jump" and track_id != conn_dict.jump_prev:
            conn_dict.jump_prev = track_id
            stream_logger.info(f"New Jump detection, track id: {track_id}")
            new_detections.append((class_name, all_cords[i].tolist(), bbox, track_id))
        else:
            # Skip detection if the track id remains unchanged for that class.
            continue

    return new_detections, results
