import React, { useState, useEffect } from "react";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import "./ShowAllNews.css"; // Assuming the styles are in ShowAllNews.css

const ShowAllNews = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const response = await fetchNews();
      if (response.success) {
        setArticles(response.data);
      } else {
        console.error("Failed to load news:", response.data);
      }
    };

    loadNews();
  }, []);

  return (
    <div className="journal-NewsAllView">
      {articles.length > 0 ? (
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
        <p className="no-articles-NewsAllView">No articles available.</p>
      )}
    </div>
  );
};

export default ShowAllNews;
