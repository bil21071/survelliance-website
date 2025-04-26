import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import moment from "moment";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import "../components/b1.css";

const AnomalyReportGenerator = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

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
        }
      });
    };

    fetchAlerts();
  }, []);

  const filterAlertsByTimeAndLocation = (alerts, selectedLocation, selectedDate) => {
    const startOfDay = moment(selectedDate).startOf("day");
    const endOfDay = moment(selectedDate).endOf("day");

    return alerts.filter((alert) => {
      const timestamp = moment(alert.timestamp);
      return (
        timestamp.isBetween(startOfDay, endOfDay, null, "[]") &&
        (selectedLocation ? alert.location === selectedLocation : true)
      );
    });
  };

  const getEventCounts = (alerts) => {
    const eventCounts = {};
    alerts.forEach((alert) => {
      const event = alert.event || "Unknown";
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
    return eventCounts;
  };

  const fetchImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const generateDocxReport = async (alerts, selectedLocation, selectedDate) => {
    const filteredAlerts = filterAlertsByTimeAndLocation(alerts, selectedLocation, selectedDate);
    const eventCounts = getEventCounts(filteredAlerts);
    const now = moment();

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "AI Surveillance System",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Anomaly Report: ${selectedDate}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Generated On: ${now.format("YYYY-MM-DD HH:mm:ss")}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "📊 Event Summary",
              heading: HeadingLevel.HEADING_2,
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({ children: [new Paragraph("Event Type")] }),
                    new TableCell({ children: [new Paragraph("Count")] }),
                  ],
                }),
                ...Object.entries(eventCounts).map(([event, count]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(event)] }),
                      new TableCell({ children: [new Paragraph(String(count))] }),
                    ],
                  })
                ),
              ],
            }),
            new Paragraph({
              text: "📂 Detailed Alerts",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            ...filteredAlerts.map((alert) => {
              const imageData = alert.image_url ? alert.image_url : null;

              const paragraph = new Paragraph({
                spacing: { after: 300 },
                children: [
                  new TextRun({ text: "Event: ", bold: true }),
                  new TextRun(alert.event || "Unknown"),
                  new TextRun({ text: "\nLocation: ", bold: true }),
                  new TextRun(alert.location || "Unknown"),
                  new TextRun({ text: "\nTimestamp: ", bold: true }),
                  new TextRun(moment(alert.timestamp).format("YYYY-MM-DD HH:mm:ss")),
                ],
              });

              if (imageData) {
                if (imageData.startsWith("data:image")) {
                  // It's already base64-encoded, so we can directly use it.
                  paragraph.addChildElement(
                    new ImageRun({
                      data: imageData,
                      transformation: { width: 300, height: 200 },
                    })
                  );
                } else {
                  // If it's a URL, fetch the image and convert it to base64
                  fetchImageAsBase64(imageData).then((base64Image) => {
                    if (base64Image) {
                      paragraph.addChildElement(
                        new ImageRun({
                          data: base64Image,
                          transformation: { width: 300, height: 200 },
                        })
                      );
                    }
                  });
                }
              }

              return paragraph;
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Anomaly_Report_${now.format("YYYY-MM-DD_HH-mm")}.docx`);
  };

  const renderAlertMessages = () => {
    const alertsInSelectedDate = filterAlertsByTimeAndLocation(alerts, selectedLocation, selectedDate);

    return alertsInSelectedDate.map((alert, index) => (
      <div key={index} className="alert-list-item">
        <div className="alert-text">
          <span className="alert-event">{alert.event}</span>
          <span className="alert-location">{alert.location}</span>
          <span className="alert-timestamp">
            {moment(alert.timestamp).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
        {alert.image_url && (
          <img src={alert.image_url} alt="Detection Frame" className="alert-image" />
        )}
      </div>
    ));
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>AI Surveillance Report</h1>
        <p>Futuristic monitoring of anomaly detections</p>
      </div>

      <div className="filter-section">
        <input
          type="text"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          placeholder="Filter by Location"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="alerts">
        <h2>Recent Alerts</h2>
        <div className="alerts-list">
          {alerts.length > 0 ? renderAlertMessages() : <p>No alerts found.</p>}
        </div>
      </div>

      <div className="report-section">
        <h2>📄 Anomaly Report for {moment().format("YYYY-MM-DD HH:mm")}</h2>

        <button
          className="download-btn"
          onClick={() => generateDocxReport(alerts, selectedLocation, selectedDate)}
        >
          Download Report as DOCX
        </button>
      </div>
    </div>
  );
};

export default AnomalyReportGenerator;
