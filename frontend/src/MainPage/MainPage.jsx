import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import { getAllJournal } from "../actions/journal.action";
import { getStressData } from "../actions/schedule.action";
import { addNews } from "../actions/news.action";
import Sidebar from "../Sidebar/Sidebar";
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
  Colors,
} from "chart.js";
import "./MainPage.css";
import styles from "../ChatBot/Chatbot.module.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MainPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State untuk sidebar
  const [username, setUsername] = useState(""); // State untuk username
  const [articles, setArticles] = useState([]); // State untuk menyimpan data artikel
  const [journal, setJournal] = useState([]); // State untuk menyimpan data journal
  const [stressData, setStressData] = useState(null);
  const [loadingStress, setLoadingStress] = useState(true);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); // State untuk kontrol modal
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    sources: "",
    images: "",
  });

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
        try {
            const response = await fetch("http://localhost:3000/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Hello" }), // Kirim pesan kosong untuk mendapatkan pesan sapaan
            });
            const data = await response.json();
            const welcomeMessage = { sender: "bot", text: data.response };
            setMessages([welcomeMessage]);
        } catch (error) {
            console.error("Error fetching welcome message:", error);
        }
    };

    fetchWelcomeMessage();
  }, []); // Hanya dipanggil sekali saat komponen dimuat

    const handleSend = async () => {
        if (!input) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("http://localhost:3000/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();

            const botMessage = { sender: "bot", text: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error communicating with backend:", error);
        }

        setInput("");
    };

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

  useEffect(() => {
    const fetchStressData = async () => {
      if (!username) return;
      try {
        const data = await getStressData(username);
        const chartData = {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Weekly Stress Levels",
              data: Object.keys(data).map((day) =>
                Object.values(data[day]).reduce((total, val) => total + val, 0)
              ),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointRadius: 5,
            },
          ],
        };
        setStressData(chartData);
        setLoadingStress(false);
      } catch (error) {
        console.error("Error fetching stress data:", error);
        setLoadingStress(false);
      }
    };
    fetchStressData();
  }, [username]);

  const handleLogout = () => {
    logout();
    alert("Berhasil logout!");
    navigate("/");
  };
  const handleAddNews = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.sources) {
      alert("Title, content, and sources are required!");
      return;
    }

    const writer = username || "Anonymous";
    const articleData = {
      ...newArticle,
      writer,
      images: newArticle.images.split(",").map((url) => url.trim()),
    };

    const response = await addNews(articleData);
    if (response.success) {
      setArticles((prevArticles) => [
        ...prevArticles,
        { ...articleData, id: response.data },
      ]);
      alert("News added successfully!");
      setModalOpen(false); // Tutup modal setelah sukses
      setNewArticle({ title: "", content: "", sources: "", images: "" }); // Reset form
    } else {
      alert("Failed to add news!");
    }
  };
  
  
  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    console.log("Sidebar toggle:", !isSidebarVisible);
    setSidebarVisible(!isSidebarVisible);
  };

  const getCurrentDate = () => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="menu" onClick={toggleSidebar}>
          ☰
        </div>
        <div className="title">Nurture</div>
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
          {username === "zik" && (
            <button
              className="add-news"
              onClick={() => setModalOpen(true)}
              style={{
                marginLeft: "auto",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              +
            </button>
          )}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add News</h2>
              <input
                type="text"
                placeholder="Title"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                placeholder="Content"
                value={newArticle.content}
                onChange={(e) =>
                  setNewArticle((prev) => ({ ...prev, content: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Sources (URL)"
                value={newArticle.sources}
                onChange={(e) =>
                  setNewArticle((prev) => ({ ...prev, sources: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Image URLs (comma-separated)"
                value={newArticle.images}
                onChange={(e) =>
                  setNewArticle((prev) => ({ ...prev, images: e.target.value }))
                }
              />
              <div className="modal-buttons">
                <button onClick={handleAddNews}>Submit</button>
                <button onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

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

        {/* Chatbot Section */}
        <div className="chatbot-container">
        <div className="header">
          <h2>Chatbot</h2>
          </div>
          <div className={styles.container}>
            <div className={styles.chatWindow}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === "user"
                                ? styles.userMessage
                                : styles.botMessage
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit" className={styles.sendButton} onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
        </div>

        {/* Stress Level Section */}
        <div className="box stress">
          <h2>Stress Level</h2>
          <div className="chart-container">
            {loadingStress ? (
              <p>Loading stress data...</p>
            ) : stressData ? (
              <Line
                data={stressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Weekly Stress Levels",
                    },
                  },
                  scales: {
                    x: { title: { display: true, text: "Days of the Week" } },
                    y: { title: { display: true, text: "Stress Level" } },
                  },
                }}
              />
            ) : (
              <p>No stress data available.</p>
            )}
          </div>
        </div>


        {/* Schedule Section */}
        <div className="box schedule">
          <h2>Schedule</h2>
          <p>({getCurrentDate()})</p>
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