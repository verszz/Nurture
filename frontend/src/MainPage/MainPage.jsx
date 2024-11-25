import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import { getAllJournal } from "../actions/journal.action";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar
import "./MainPage.css";

const MainPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State untuk sidebar
  const [username, setUsername] = useState(""); // State untuk username
  const [articles, setArticles] = useState([]); // State untuk menyimpan data artikel
  const [journal, setJournal] = useState([]); // State untuk menyimpan data journal
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
    const loadNews = async () => {
      const response = await fetchNews(); // Panggil fungsi fetchNews
      if (response.success) {
        setArticles(response.data); // Set state dengan data artikel jika sukses
      } else {
        console.error("Failed to load news:", response.data);
      }
    };

    loadNews();
  }, []);
  const handleAlert = (message) => {
    alert(message);
  };

  useEffect(() => {
    const loadJournal = async () => {
      const response = await getAllJournal(username); // Panggil fungsi fetchNews
      console.log(username);
      if (response.success) {
        setJournal(response.data); // Set state dengan data artikel jika sukses
      } else {
        console.error("Failed to load journal:", response.data);
      }
    };

    loadJournal();
  }, [username]);

  const handleJournalAlert = (message) => {
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
        <div>{username}</div>
        <div className="profile">{getInitials(username)}</div> {/* Inisial */}
      </div>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />

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
          <div className="share-button" onClick={handleChatbot}>Tell me your problem</div>
        </div>

        {/* Journal Section */}
        <div className="box journal-container">
          <div className="header">
            <h2>Journal</h2>
            <div className="add-journal">+</div>
          </div>
          <div className="journal">
          {journal.length > 0 ? (
              journal.map((journal) => (
                <div
                  className="journal-entry"
                  key={journal.id}
                  // onClick={() => window.open(article.sources, "_blank")}
                >
                  <h2>{journal.journal_title}</h2>
                  <p>{journal.journal_content.slice(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p>No journal available.</p>
            )}
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
