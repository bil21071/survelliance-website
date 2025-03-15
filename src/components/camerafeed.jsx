import React, { useEffect, useRef } from "react";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const apiUrl = "http://localhost:5000"; // Flask backend URL

  useEffect(() => {
    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Send frames to Flask every 33ms (30 FPS)
        const sendFrame = () => {
          if (!videoRef.current) return;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            fetch(`${apiUrl}/upload_frame`, {
              method: "POST",
              body: blob,
              headers: { "Content-Type": "image/jpeg" }
            }).catch((err) => console.error("Failed to send frame:", err));
          }, "image/jpeg");
          setTimeout(sendFrame, 33);
        };

        sendFrame();
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 AI Surveillance</h1>
        <p style={styles.subtitle}>Live Camera Feed Streaming at 30 FPS</p>
      </div>
      <div style={styles.cameraContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        />
        <div style={styles.overlay}>Recording...</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "#fff",
    fontFamily: "'Orbitron', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "5px",
    background: "linear-gradient(90deg, #00C6FF, #0072FF)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#b0b0b0",
    letterSpacing: "2px",
  },
  cameraContainer: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    border: "3px solid #00C6FF",
    boxShadow: "0 0 30px #00C6FF",
    width: "80%",
    maxWidth: "800px",
    aspectRatio: "16/9",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    filter: "brightness(90%) contrast(110%) saturate(120%)",
  },
  overlay: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 198, 255, 0.8)",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#0d0d0d",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
};

export default CameraFeed;
