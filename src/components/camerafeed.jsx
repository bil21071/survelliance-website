import React, { useEffect, useState } from "react";

const CameraFeed = () => {
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    return () => {
      if (isStreaming) {
        fetch("http://localhost:5000/stop_feed", { method: "POST" })
          .then((response) => console.log("Camera stopped:", response))
          .catch((err) => console.error("Error stopping camera:", err));
      }
    };
  }, [isStreaming]);

  return (
    <div>
      <h2>Live Webcam Feed</h2>
      <img
        src="http://localhost:5000/video_feed"
        alt="Webcam Stream"
        style={{ width: "100%", borderRadius: "10px" }}
      />
    </div>
  );
};

export default CameraFeed;
