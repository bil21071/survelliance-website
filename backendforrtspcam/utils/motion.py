import numpy as np
import cv2
from logs.Logger import Logs
logger=Logs()
def motion_detect(frame2,previous_frame):
    logger.info("motion detection fun called")
    
    text = 'SAFE'
    
    img_brg = np.array(frame2)
    img_rgb = cv2.cvtColor(src=img_brg, code=cv2.COLOR_BGR2RGB)
    # 2. Prepare image; grayscale and blur
    prepared_frame = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
    prepared_frame = cv2.GaussianBlur(src=prepared_frame, ksize=(5,5), sigmaX=0)
    
    diff_frame = cv2.absdiff(src1=previous_frame, src2=prepared_frame)
   
    previous_frame = prepared_frame
    kernel = np.ones((5, 5))
    diff_frame = cv2.dilate(diff_frame, kernel, 1)######################### last changing
    # 5. Only take different areas that are different enough (>20 / 255)
    thresh_frame = cv2.threshold(src=diff_frame, thresh=100, maxval=255, type=cv2.THRESH_BINARY)[1] #100 20
    # 6. Find The Contours Boxes From Frame
    contours, _ = cv2.findContours(image=thresh_frame, mode=cv2.RETR_EXTERNAL, method=cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) != 0:
        logger.info("countour detected")
        c = max(contours, key = cv2.contourArea)
        if cv2.contourArea(c) > 200: #100 #500 is good
            (x, y, w, h) = cv2.boundingRect(c)
            text = 'DANGER'
            
    return text,previous_frame