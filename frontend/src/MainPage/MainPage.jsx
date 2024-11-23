import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import "./MainPage.css";

const MainPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State untuk sidebar
  const [username, setUsername] = useState(""); // State untuk username
  const [articles, setArticles] = useState([]); // State untuk menyimpan data artikel
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil username dari localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3000/news/getAllNews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setArticles(data); // Simpan data artikel ke state
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleAlert = (message) => {
    alert(message);
  };

  const handleLogout = () => {
    logout();
    alert("Berhasil logout!");
    navigate("/");
  };

  const handleChatbot = () => {
    navigate("/chatbot");
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    console.log("Sidebar toggle:", !isSidebarVisible);
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="menu" onClick={toggleSidebar}>
          ☰
        </div>
        <div>Nurture</div>
        <div className="profile">{getInitials(username)}</div> {/* Inisial */}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          ✖
        </div>
        <ul>
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/profile")}>Profile</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Article Section */}
        <div className="box article-container">
          <div className="header">
            <h2>Articles</h2>
          </div>
          <div className="journal">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  className="article-card"
                  key={article.id}
                  onClick={() => window.open(article.sources, "_blank")}
                >
                  <h3>{article.title}</h3>
                  <p>{article.content.slice(0, 100)}...</p>
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="article-image"
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No articles available.</p>
            )}
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <h2>Chatbot</h2>
          <div className="chat-bubble">Hello! Got a bad day</div>
          <div className="share-button" onClick={handleChatbot}>Tell me ypur problem</div>
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
    </div>
  );
};

export default MainPage;
