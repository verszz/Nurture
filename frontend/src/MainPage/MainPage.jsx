import React from "react";
import "./MainPage.css";

const MainPage = () => {
  const handleAlert = (message) => {
    alert(message);
  };

  return (
    <div>
      <div className="header">
        <div className="menu">☰</div>
        <div>Nurture</div>
        <div className="profile">Rr</div>
      </div>

      <div className="container">
        {/* Article Section */}
        <div className="box article-container">
          <h2>Article</h2>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              className="article-card"
              key={idx}
              onClick={() => handleAlert(`Article ${idx + 1} clicked`)}
            >
              <h3>Article {idx + 1}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <h2>Chatbot</h2>
          <div className="chat-bubble">Hello! How can I help you today?</div>
          <div className="share-button">Share this entry</div>
        </div>

        {/* Journal Section */}
        <div className="box journal-container">
          <div className="header">
            <h2>Journal</h2>
            <div className="add-journal">+</div>
          </div>
          <div className="journal">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div
                className="journal-entry"
                key={idx}
                onClick={() => handleAlert(`Journal ${idx + 1} clicked`)}
              >
                <h3>Journal {idx + 1}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Level Section */}
        <div className="box stress">
          <h2>Stress Level</h2>
          <p>Current stress level: Moderate</p>
        </div>

        {/* Schedule Section */}
        <div className="box schedule">
          <h2>Schedule</h2>
          <p>Your schedule for today:</p>
          <ul>
            <li>9:00 AM - Meeting</li>
            <li>11:00 AM - Workshop</li>
            <li>2:00 PM - Presentation</li>
          </ul>
        </div>
      </div>

      <footer>© 2024 Nurture. All rights reserved.</footer>
    </div>
  );
};

export default MainPage;
