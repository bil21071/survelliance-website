import cv2

rtsp_url = "rtsp://admin:YQAQYJ@192.168.1.18:554/h264/main"
cap = cv2.VideoCapture(rtsp_url)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("EZVIZ Stream", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
