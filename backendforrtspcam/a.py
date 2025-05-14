import cv2

# RTSP URL for your camera
rtsp_url = "rtsp://admin:YQAQYJ@192.168.1.18:554/main"

# Open the RTSP stream
cap = cv2.VideoCapture(rtsp_url)

if not cap.isOpened():
    print("Error: Could not open RTSP stream.")
    exit()

while True:
    # Read a frame from the stream
    ret, frame = cap.read()

    if not ret:
        print("Error: Failed to retrieve frame.")
        break

    # Display the frame
    cv2.imshow("RTSP Stream", frame)

    # Press 'q' to quit the video display
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
