import React, { useState, useEffect } from "react";
import { fetchNews } from "../actions/news.action";
import "./ShowAllNews.css";

const ShowAllNews = () => {
  // State for all articles and filtered articles
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch news on component mount
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

  // Search handler
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
    <div className="journal-NewsAllView">
      {/* Search Input */}
      <div className="search-container-NewsAllView">
        <input 
          type="text" 
          placeholder="Search news..." 
          value={searchTerm}
          onChange={handleSearch}
          className="search-input-NewsAllView"
        />
      </div>

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
        <p className="no-articles-NewsAllView">
          {searchTerm 
            ? "No articles match your search." 
            : "No articles available."
          }
        </p>
      )}
    </div>
  );
};

export default ShowAllNews;