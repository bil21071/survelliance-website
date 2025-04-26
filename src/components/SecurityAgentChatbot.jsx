import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

const SecurityAgentChatbot = () => {
  const [alerts, setAlerts] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const autoQuestions = [
    "What to do if a weapon is detected at any location?",
    "What are the safety measures when a person has fallen?",
    "What actions should be taken when a fire is detected at the location?",
    "What are the measures to take during an emergency situation?",
    "How to report a suspicious activity?"
  ];

  useEffect(() => {
    const detectionsRef = ref(db, "detections");
    onValue(detectionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAlerts(data);
      }
    });
  }, []);

  const filterAlertsAndCount = (alerts) => {
    const filteredAlerts = {};
    Object.entries(alerts).forEach(([id, alert]) => {
      if (
        (selectedLocation ? alert.location === selectedLocation : true) &&
        (selectedDate ? alert.timestamp.includes(selectedDate) : true)
      ) {
        const event = alert.event || "Unknown";
        if (filteredAlerts[event]) {
          filteredAlerts[event]++;
        } else {
          filteredAlerts[event] = 1;
        }
      }
    });
    return filteredAlerts;
  };

  const fetchChatbotResponseWithQuestion = async (question) => {
    setLoading(true);
    const updatedMessages = [...messages, { role: "user", content: question }];
    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 0a8c46d74aa185ed0c317e83e5945cf6722b0ab4ebc41e425a274aee3eb684af`, // 🔐 Replace with your key
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.1",
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const assistantMessage = data.choices[0].message;
        setMessages([...updatedMessages, assistantMessage]);
        saveMessagesToFile(updatedMessages, assistantMessage);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: "No response from Together.ai." }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (userQuery.trim()) {
      fetchChatbotResponseWithQuestion(userQuery);
      setUserQuery("");
    }
  };

  useEffect(() => {
    let index = 0;

    const askNextQuestion = () => {
      if (index < autoQuestions.length) {
        const question = autoQuestions[index];
        setUserQuery(question);  // Automatically set the query
        fetchChatbotResponseWithQuestion(question);  // Fetch response for the question

        index++;
        // Call the function again after 10-15 seconds (randomized delay)
        setTimeout(askNextQuestion, Math.floor(Math.random() * 5000) + 10000); // Delay between 10 to 15 seconds
      }
    };

    // Start asking questions automatically when the component mounts
    askNextQuestion();
  }, []); // Empty array ensures this effect runs only once when component mounts

  const eventSummary = filterAlertsAndCount(alerts);

  const downloadReport = () => {
    const reportContent = `AI-Powered Security Agent Chatbot: System Report

System Overview:
This system integrates real-time surveillance alerts with an AI-powered chatbot to provide immediate, intelligent security assistance.

Features:
- Live Firebase Integration
- Location & Date Filters
- Event Count Summary
- Mistral-7B Chatbot Assistant
- Auto-FAQ on Safety Procedures

Auto Questions Asked:
${autoQuestions.map((q) => `- ${q}`).join("\n")}

Event Summary:
${Object.entries(eventSummary)
  .map(([event, count]) => `- ${event}: ${count} occurrences`)
  .join("\n")}`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "security_chatbot_report.txt";
    a.click();
  };

  // Function to save messages to a text file
  const saveMessagesToFile = (updatedMessages, assistantMessage) => {
    const messageContent = updatedMessages
      .map(msg => `${msg.role === "user" ? "You" : "Bot"}: ${msg.content}`)
      .join("\n");

    const blob = new Blob([messageContent], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chatbot_responses.txt";
    a.click();
  };

  return (
    <div className="chatbot-container" style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#121212", color: "#FFF", minHeight: "100vh" }}>
      <h1 style={{ color: "#00FF00", textAlign: "center", fontSize: "3rem", textShadow: "0 0 10px #00FF00, 0 0 20px #00FF00" }}>🛡️ Security Agent Chatbot</h1>
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#A9A9A9" }}>Ask any security-related questions and get intelligent assistance.</p>

      <div className="filter-section" style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          placeholder="Filter by Location"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #00FF00", width: "250px", background: "#333", color: "#FFF" }}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #00FF00", background: "#333", color: "#FFF" }}
        />
      </div>

      <div className="alert-summary" style={{ marginBottom: "30px" }}>
        <h2 style={{ textAlign: "center", color: "#00FF00" }}>📊 Event Summary</h2>
        <ul style={{ listStyle: "none", padding: 0, textAlign: "center", fontSize: "1.1rem" }}>
          {Object.entries(eventSummary).map(([event, count], index) => (
            <li key={index} style={{ marginBottom: "10px", color: "#A9A9A9" }}>
              <strong>{event}</strong>: {count} occurrence(s)
            </li>
          ))}
        </ul>
      </div>

      <div className="chatbox" style={{ marginBottom: "20px" }}>
        <div className="chat-history" style={{ marginBottom: "10px", maxHeight: "300px", overflowY: "auto", background: "#333", padding: "10px", borderRadius: "8px", border: "1px solid #444" }}>
          {messages
            .filter((msg) => msg.role !== "system")
            .map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#00FF00" }}>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
              </div>
            ))}
        </div>

        <form onSubmit={handleQuerySubmit}>
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask your security question..."
            rows="4"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #444", resize: "none", background: "#222", color: "#FFF" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#00FF00",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s ease-in-out"
            }}
          >
            {loading ? "Loading..." : "Ask"}
          </button>
        </form>
      </div>

      <button
        onClick={downloadReport}
        style={{
          backgroundColor: "#10b981",
          color: "white",
          padding: "10px 20px",
          fontSize: "0.95rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        📄 Download Report
      </button>
    </div>
  );
};

export default SecurityAgentChatbot;
