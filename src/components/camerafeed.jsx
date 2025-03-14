import React, { useEffect, useState } from "react";

const CameraFeed = () => {
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    return () => {
      if (isStreaming) {
        fetch("https://camera-flask-service.onrender.com/stop_feed", { method: "POST" })
          .then((response) => console.log("Camera stopped:", response))
          .catch((err) => console.error("Error stopping camera:", err));
      }
    };
  }, [isStreaming]);

  return (
    <div>
      <h2>Live Webcam Feed</h2>
      <img
        src="https://camera-flask-service.onrender.com/video_feed"
        alt="Webcam Stream"
        style={{ width: "100%", borderRadius: "10px" }}
      />
    </div>
  );
};

export default CameraFeed;
