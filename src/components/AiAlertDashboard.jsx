import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "./firebase"; // Adjust the path as needed
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import moment from "moment";
import "../components/AiAlertDashboard.css"; // New futuristic styles

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AiAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState({});
  const [anomaliesCount, setAnomaliesCount] = useState({
    day: 0,
    hour: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const q = query(collection(db, "detections"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAlerts(data);

        updateAnomaliesCount(data);
        updateChartData(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  const updateAnomaliesCount = (alerts) => {
    let day = 0, hour = 0, month = 0;
    const now = moment();

    alerts.forEach((alert) => {
      const timestamp = moment(alert.timestamp);
      if (timestamp.isSame(now, "day")) day++;
      if (timestamp.isSame(now, "hour")) hour++;
      if (timestamp.isSame(now, "month")) month++;
    });

    setAnomaliesCount({ day, hour, month });
  };

  const updateChartData = (alerts) => {
    const days = [];
    const counts = [];
    const now = moment();

    for (let i = 6; i >= 0; i--) {
      const date = moment(now).subtract(i, "days");
      const formatted = date.format("YYYY-MM-DD");
      const count = alerts.filter((alert) =>
        moment(alert.timestamp).isSame(formatted, "day")
      ).length;
      days.push(formatted);
      counts.push(count);
    }

    setChartData({
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

  const renderAlertMessages = () =>
    alerts.map((alert, index) => (
      <div key={index} className="alert-card">
        <h3>{alert.event}</h3>
        <p><strong>Location:</strong> {alert.location}</p>
        <p><strong>Time:</strong> {moment(alert.timestamp).format("YYYY-MM-DD HH:mm:ss")}</p>
        {alert.local_path && (
          <img src={alert.local_path} alt={alert.event} className="alert-image" />
        )}
      </div>
    ));

  return (
    <div className="dashboard">
      <div className="header">
        <h1>AI Alert Dashboard</h1>
        <p>Monitor anomaly detections and track security alerts.</p>
      </div>

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

      <div className="chart-container">
        <h2>Detections in Last 7 Days</h2>
        {chartData.labels ? (
          <Line
            data={chartData}
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
          <p>Loading chart...</p>
        )}
      </div>

      <div className="alerts">
        <h2>Recent Alerts</h2>
        {alerts.length > 0 ? renderAlertMessages() : <p>No alerts found.</p>}
      </div>
    </div>
  );
};

export default AiAlerts;
