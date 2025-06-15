import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Adjust the path as needed
import { ref, onValue } from "firebase/database";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const FightDetectionPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [detections, setDetections] = useState([]);
  const [summaryText, setSummaryText] = useState("");

  // Fetch detection data from Firebase
  useEffect(() => {
    const dbRef = ref(db, "fightdetections");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data);
        setDetections(formatted);

        // Create summary for download
        const summary = formatted
          .filter(d => d.event === "Violence")
          .map(d => `${d.timestamp} - ${d.location}`)
          .join("\n");
        setSummaryText(summary);
      }
    });
  }, []);

  // Upload video to backend
  const uploadFightVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    setUploading(true);
    setMessage("Uploading and processing video...");

    try {
      const response = await fetch("http://localhost:5000/upload_fight", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.download_url) {
        setMessage("✅ Fight detection complete. Opening result...");
        window.open("http://localhost:5000" + result.download_url, "_blank");
      } else {
        setMessage("❌ Error: No download URL returned.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Download summary
  const downloadSummary = () => {
    const blob = new Blob([summaryText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "violence_summary.txt";
    link.click();
  };

  // Count by day
  const countByDay = detections.reduce((acc, det) => {
    if (det.event !== "Violence") return acc;
    const day = det.timestamp.split(" ")[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(countByDay).map(([day, count]) => ({
    day,
    count
  }));

  return (
    <div style={{
      fontFamily: "'Orbitron', sans-serif",
      backgroundColor: "#0f0f1a",
      color: "#00ffe7",
      padding: "40px",
      minHeight: "100vh"
    }}>
      <h2 style={{ textAlign: "center" }}>🤖 Fight Detection Dashboard</h2>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={{ color: "#00ffe7" }}
        />
        <br /><br />
        <button
          onClick={() => uploadFightVideo(selectedFile)}
          disabled={uploading}
          style={{
            padding: "10px 20px",
            background: "#00ffe7",
            color: "#0f0f1a",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {uploading ? "Processing..." : "Upload Video"}
        </button>
        <p style={{ marginTop: "10px" }}>{message}</p>
      </div>

      <div style={{ background: "#1a1a2e", padding: "20px", borderRadius: "12px" }}>
        <h3>📊 Violence Events by Day</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#00ffe7" />
              <YAxis stroke="#00ffe7" />
              <Tooltip />
              <Bar dataKey="count" fill="#00ffe7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={downloadSummary}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#00ffe7",
            color: "#0f0f1a",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          📥 Download Summary (.txt)
        </button>
      </div>
    </div>
  );
};

export default FightDetectionPage;
