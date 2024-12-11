import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { logout } from "../actions/user.action";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import { getAllJournal } from "../actions/journal.action";
import { deleteJournal } from "../actions/journal.action";
import { getStressData } from "../actions/schedule.action";
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
} from "chart.js";
import "./MainPage.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loadingStress, setLoadingStress] = useState(true);
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

  const handleChatbot = () => {
    navigate("/chatbot");
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    console.log("Sidebar toggle:", !isSidebarVisible);
    setSidebarVisible(!isSidebarVisible);
  };

  const openModal = (journal) => {
    setSelectedJournal(journal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJournal(null);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    navigate(`/editjournal/${selectedJournal.id}`);
  };

  const handleDelete = async () => {
    if (!selectedJournal) return;
    try {
      await deleteJournal(selectedJournal.id);
      setJournal((prev) =>
        prev.filter((entry) => entry.id !== selectedJournal.id)
      );
      closeModal();
      alert("Journal deleted successfully!");
    } catch (error) {
      console.error("Error deleting journal:", error);
    }
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
        <div>{username}</div>
        <div className="profile">{getInitials(username)}</div> {/* Initials */}
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
          <h2>Articles</h2>
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
        <div className="box chatbot-container">
          <h2>Chatbot</h2>
          <div className="chat-bubble">Hello! Got a bad day</div>
          <div className="share-button" onClick={handleChatbot}>
            Tell me your problem
          </div>
        </div>
  
        {/* Journal Section */}
        <div className="box journal-container">
          <h2>Journal</h2>
          <div className="journal">
            {journal.length > 0 ? (
              journal.map((entry) => (
                <div
                  className="journal-entry"
                  key={entry.id}
                  onClick={() => openModal(entry)}
                >
                  <h3>{entry.journal_title}</h3>
                  <p>{entry.journal_content.slice(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p>No journal available.</p>
            )}
          </div>
        </div>
  
      {/* Modal */}
      {selectedJournal && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Journal Details"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>{selectedJournal.journal_title}</h2>
          <p>{selectedJournal.journal_content}</p>
          <div className="modal-actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </Modal>
      )}
  
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
}  

export default MainPage;

