import React, { useEffect, useRef, useState } from "react";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(true); // Track streaming status
  const [isError, setIsError] = useState(false); // Track error state
  const apiUrl = "http://localhost:5000"; // Flask backend URL

  useEffect(() => {
    // Start streaming from Flask
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = `${apiUrl}/video_feed`;
    }
    
    // Handle errors in video stream
    const handleError = (event) => {
      console.error("Error loading video stream:", event);
      setIsError(true); // Set error state if stream fails
    };

    // Attach error event listener
    if (videoElement) {
      videoElement.addEventListener('error', handleError);
    }

    // Clean up event listener on unmount
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 AI Surveillance</h1>
        <p style={styles.subtitle}>Live Camera Feed Streaming</p>
      </div>
      <div style={styles.cameraContainer}>
        {isError ? (
          <div style={styles.error}>Failed to load stream</div>
        ) : (
          <img
          src={`${apiUrl}/video_feed`}
          alt="Live Camera Feed"
          style={styles.video}
        />
        )}
        {isError && <div style={styles.overlay}>Error loading stream...</div>}
        {!isError && !isStreaming && (
          <div style={styles.overlay}>Loading Stream...</div>
        )}
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
    height: "auto",
    minHeight: "110vh",
    backgroundColor: "#0d0d0d",
    color: "#fff",
    fontFamily: "'Orbitron', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto",
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
  error: {
    color: "red",
    fontSize: "20px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
};

export default CameraFeed;
