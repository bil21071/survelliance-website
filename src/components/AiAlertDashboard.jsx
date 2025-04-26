import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "./firebase"; // Adjust path as needed
import { ref, onValue } from "firebase/database";
import moment from "moment";
import "../components/AiAlertDashboard.css"; // Use the updated futuristic CSS

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AiAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [lineChartData, setLineChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [anomaliesCount, setAnomaliesCount] = useState({
    day: 0,
    hour: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchAlerts = () => {
      const detectionsRef = ref(db, "detections");
      onValue(detectionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const alertsArray = Object.entries(data).map(([id, alert]) => ({
            id,
            ...alert,
          }));
          setAlerts(alertsArray);
          updateAnomaliesCount(alertsArray);
          updateLineChartData(alertsArray);
          updateBarChartData(alertsArray);
          updatePieChartData(alertsArray);
        }
      });
    };
  
    fetchAlerts();
  }, []);

  // Calculate top statistics for today, hour, month
  const updateAnomaliesCount = (alertsData) => {
    let day = 0,
      hour = 0,
      month = 0;
    const now = moment();

    alertsData.forEach((alert) => {
      const timestamp = moment(alert.timestamp);
      if (timestamp.isSame(now, "day")) day++;
      if (timestamp.isSame(now, "hour")) hour++;
      if (timestamp.isSame(now, "month")) month++;
    });

    setAnomaliesCount({ day, hour, month });
  };

  // Update Line Chart Data: detections in the last 7 days
  const updateLineChartData = (alertsData) => {
    const days = [];
    const counts = [];
    const now = moment();
    for (let i = 6; i >= 0; i--) {
      const date = moment(now).subtract(i, "days");
      const formatted = date.format("YYYY-MM-DD");
      const count = alertsData.filter((alert) => moment(alert.timestamp).isSame(formatted, "day")).length;
      days.push(formatted);
      counts.push(count);
    }
    setLineChartData({
      labels: days,
      datasets: [
        {
          label: "Anomalies Detected (per day)",
          data: counts,
          fill: false,
          backgroundColor: "#00e5ff",
          borderColor: "#00bcd4",
          tension: 0.3,
        },
      ],
    });
  };

  // Update Bar Chart Data: counts per event type
  const updateBarChartData = (alertsData) => {
    const eventCounts = {};
    alertsData.forEach((alert) => {
      const event = alert.event || "Unknown";
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
    const labels = Object.keys(eventCounts);
    const values = Object.values(eventCounts);
    setBarChartData({
      labels,
      datasets: [
        {
          label: "Detections by Event Type",
          data: values,
          backgroundColor: "#ff5722",
          borderColor: "#ff5722",
          borderWidth: 1,
        },
      ],
    });
  };

  // Update Pie Chart Data: counts per location
  const updatePieChartData = (alertsData) => {
    const locationCounts = {};
    alertsData.forEach((alert) => {
      const location = alert.location || "Unknown";
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    const labels = Object.keys(locationCounts);
    const values = Object.values(locationCounts);
    setPieChartData({
      labels,
      datasets: [
        {
          label: "Detections by Location",
          data: values,
          backgroundColor: [
            "#00bcd4",
            "#2196f3",
            "#ff9800",
            "#f44336",
            "#4caf50",
            "#9c27b0",
            "#607d8b",
          ],
        },
      ],
    });
  };
  const [selectedImage, setSelectedImage] = useState(null);
  // Alternate Alert Display: A simple list (without images)
  const renderAlertMessages = () =>
    alerts.map((alert, index) => (
      <div key={index} className="alert-list-item1">
        <div className="alert-text1">
          <span className="alert-event">{alert.event}</span>
          <span className="alert-location">{alert.location}</span>
          <span className="alert-timestamp">
            {moment(alert.timestamp).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
  
        {alert.image_url && (
          <button className="futuristic-button" onClick={() => setSelectedImage(alert.image_url)}>
            View Detected Frame
          </button>
        )}
      </div>
    ));

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <h1>AI Surveillance Dashboard</h1>
        <p>Futuristic monitoring of anomaly detections and security alerts</p>
      </div>
      
      {/* Top Stats */}
      <div className="stats">
        <div className="stat-item">
          <h2>Today's Detections</h2>
          <p>{anomaliesCount.day}</p>
        </div>
        <div className="stat-item">
          <h2>This Hour</h2>
          <p>{anomaliesCount.hour}</p>
        </div>
        <div className="stat-item">
          <h2>This Month</h2>
          <p>{anomaliesCount.month}</p>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="charts-grid">
    <div className="chart-box">
      <h2>Detections in Last 7 Days</h2>
      <div className="chart-container">
        {lineChartData.labels ? (
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#00e5ff",
                    font: { family: "Orbitron" },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#bdbdbd",
                    font: { family: "Orbitron" },
                  },
                  grid: { color: "#444" },
                },
                y: {
                  ticks: {
                    color: "#bdbdbd",
                    font: { family: "Orbitron" },
                  },
                  grid: { color: "#444" },
                },
              },
            }}
          />
        ) : (
          <p>Loading line chart...</p>
        )}
      </div>
    </div>

    <div className="chart-box">
      <h2>Event Distribution</h2>
      <div className="chart-container">
        {barChartData.labels ? (
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#ff9800",
                    font: { family: "Orbitron" },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#bdbdbd",
                    font: { family: "Orbitron" },
                  },
                  grid: { color: "#444" },
                },
                y: {
                  ticks: {
                    color: "#bdbdbd",
                    font: { family: "Orbitron" },
                  },
                  grid: { color: "#444" },
                },
              },
            }}
          />
        ) : (
          <p>Loading bar chart...</p>
        )}
      </div>
    </div>

    <div className="chart-box">
      <h2>Location Distribution</h2>
      <div className="chart-container">
        {pieChartData.labels ? (
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#00bcd4",
                    font: { family: "Orbitron" },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading pie chart...</p>
        )}
      </div>
    </div>
  </div>
      
      {/* Alerts Section */}
      <div className="alerts">
        <h2>Recent Alerts</h2>
        <div className="alerts-list1">
          {alerts.length > 0 ? renderAlertMessages() : <p>No alerts found.</p>}
        </div>
      </div>
            {/* ⬇️ Modal added properly inside return */}
        {selectedImage && (
    <div className="modal" onClick={() => setSelectedImage(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={selectedImage} alt="Detection Frame" />
        <button onClick={() => setSelectedImage(null)}>Close</button>
      </div>
    </div>
  )}
    </div>
  );
};

export default AiAlerts;
