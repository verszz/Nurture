import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import "./NewsPage.module.css";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar

const NewsPage = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false); // State untuk sidebar
    const [username, setUsername] = useState(""); // State untuk username
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

      const handleLogout = () => {
        logout();
        alert("Berhasil logout!");
        navigate("/");
      };

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
        <div className="title">News</div>
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
      <main className="main-content">
        {/* Featured News */}
        <section className="featured-news">
          <div className="popular-news">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Popular News"
            />
            <h2>Popular</h2>
            <p>Small businesses surge amidst all expectations.</p>
          </div>
          <div className="latest-news">
            <img
              src="https://via.placeholder.com/150x100"
              alt="Latest News"
            />
            <h2>Latest</h2>
            <p>Exciting updates in the tech world.</p>
          </div>
        </section>

        {/* News Categories */}
        <section className="news-categories">
          <div className="news-category">
            <h3>Popular News</h3>
            <ul>
              <li>
                <p>Story 1 headline...</p>
                <span>Aug 21, 2024</span>
              </li>
              <li>
                <p>Story 2 headline...</p>
                <span>Aug 22, 2024</span>
              </li>
            </ul>
          </div>

          <div className="news-category">
            <h3>Hot News</h3>
            <ul>
              <li>
                <p>Story 1 headline...</p>
                <span>Aug 23, 2024</span>
              </li>
              <li>
                <p>Story 2 headline...</p>
                <span>Aug 24, 2024</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Lifestyle News */}
        <section className="lifestyle-news">
          <h3>Life Style</h3>
          <ul>
            <li>
              <img
                src="https://via.placeholder.com/100x70"
                alt="Lifestyle News"
              />
              <p>Story headline...</p>
            </li>
          </ul>
        </section>
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="social-links">
          <h4>Stay Connected</h4>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>

        <div className="ads">
          <h4>Ad Spot</h4>
          <p>Your Ad Here</p>
        </div>
      </aside>
    </div>
  );
};

export default NewsPage;