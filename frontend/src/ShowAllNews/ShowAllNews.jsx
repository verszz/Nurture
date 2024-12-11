import React, { useState, useEffect } from "react";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/user.action';
import Sidebar from '../Sidebar/Sidebar';
import "./ShowAllNews.css"; // Assuming the styles are in ShowAllNews.css

const ShowAllNews = () => {
  const [articles, setArticles] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUsername = localStorage.getItem('username');
  const navigate = useNavigate();  
  useEffect(() => {
    const loadNews = async () => {
      const response = await fetchNews();
      if (response.success) {
        setArticles(response.data);
        setFilteredArticles(response.data);
      } else {
        console.error("Failed to load news:", response.data);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchBarVisible &&
        !event.target.closest(".search-bar-header") &&
        !event.target.closest(".search-icon")
      ) {
        setSearchBarVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBarVisible]);
  

  const getInitials = (name) => {
    if (!name) return 'NA';
    const initials = name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('');
    return initials;
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    logout();
    alert('Berhasil logout!');
    navigate('/');
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter articles based on title or content
    const filtered = articles.filter(
      (article) => 
        article.title.toLowerCase().includes(term) || 
        article.content.toLowerCase().includes(term)
    );

    setFilteredArticles(filtered);
  };

  return (
    <div>
      <div className="header">
      <div className="menu" onClick={toggleSidebar}>
        ☰
      </div>
      <div className="showNews-title">News</div>
      {isSearchBarVisible ? (
        <input
          type="text"
          className="search-bar-header"
          placeholder="Search news..."
          value={searchTerm}
          onChange={handleSearch}
        />
      ) : (
        <div className="search-icon" onClick={() => setSearchBarVisible(true)}>
          🔍
        </div>
      )}
      <div className="profile">{getInitials(storedUsername)}</div>
    </div>
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    <div className="journal-NewsAllView">
      {filteredArticles.length > 0 ? (
        <div className="article-grid-NewsAllView">
          {filteredArticles.map((article) => (
            <div
              className="article-card-NewsAllView"
              key={article.id}
              onClick={() => window.open(article.sources, "_blank")}
            >
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 100)}...</p>
              {article.images && (
                <img
                  src={article.images}
                  alt={article.title}
                  className="article-image-NewsAllView"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        articles.length > 0 ? (
          <div className="article-grid-NewsAllView">
            {articles.map((article) => (
              <div
                className="article-card-NewsAllView"
                key={article.id}
                onClick={() => window.open(article.sources, "_blank")}
              >
                <h3>{article.title}</h3>
                <p>{article.content.slice(0, 100)}...</p>
                {article.images && (
                  <img
                    src={article.images}
                    alt={article.title}
                    className="article-image-NewsAllView"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-articles-NewsAllView">
            "No articles available."
          </p>
        )
      )}
    </div>
    </div>
  );
};

export default ShowAllNews;