import React, { useEffect, useRef, useState } from "react";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);
  const [latestFrame, setLatestFrame] = useState(null); // State to hold the latest frame
  const apiUrl = "https://survelliance-website.onrender.com"; // Change this to your Flask backend URL

  useEffect(() => {
    let stream;
    let intervalId;

    // Start the webcam
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }

        // Start sending frames every 1 second
        intervalId = setInterval(() => {
          captureAndSendFrame();
        }, 1000);
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setIsError(true);
      }
    };

    const captureAndSendFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Send the captured frame to the backend as JPEG
        canvas.toBlob((blob) => {
          if (blob) {
            fetch(`${apiUrl}/upload_frame`, {
              method: "POST",
              body: blob,
              headers: {
                "Content-Type": "image/jpeg",
              },
            }).catch((err) => {
              console.error("Failed to send frame:", err);
            });
          }
        }, "image/jpeg", 0.8);
      }
    };

    startWebcam();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Fetch the latest frame from the backend every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLatestFrame();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchLatestFrame = async () => {
    try {
      const response = await fetch(`${apiUrl}/latest_frame`);
      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setLatestFrame(imageUrl); // Set the latest frame URL to display
      } else {
        console.error("No frame available");
      }
    } catch (error) {
      console.error("Error fetching latest frame:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📷 Local Camera Feed</h1>
        <p style={styles.subtitle}>Streaming to Backend</p>
      </div>
      <div style={styles.cameraContainer}>
        {isError ? (
          <div style={styles.error}>Failed to access webcam</div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.video}
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {isError && <div style={styles.overlay}>Permission denied</div>}
        {!isError && !isStreaming && (
          <div style={styles.overlay}>Loading camera...</div>
        )}
      </div>

      {/* Latest Frame Display Section */}
      <div style={styles.frameContainer}>
        <h2 style={styles.frameTitle}>Latest Frame</h2>
        {latestFrame ? (
          <img
            src={latestFrame}
            alt="Latest Frame"
            style={styles.latestFrameImage}
          />
        ) : (
          <p style={styles.noFrameText}>Waiting for frame...</p>
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
    objectFit: "cover",
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
  frameContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
  frameTitle: {
    fontSize: "2rem",
    color: "#00C6FF",
    marginBottom: "10px",
  },
  latestFrameImage: {
    width: "80%",
    maxWidth: "800px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 198, 255, 0.8)",
  },
  noFrameText: {
    color: "#b0b0b0",
    fontSize: "1.2rem",
  },
};

export default CameraFeed;
