import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { logout } from "../actions/user.action";
import { fetchNews } from "../actions/news.action"; // Import fetchNews
import { getAllJournal } from "../actions/journal.action";
import { deleteJournal } from "../actions/journal.action";
import { getScheduleData } from "../actions/schedule.action"; // Import getScheduleData
import { getStressData } from "../actions/schedule.action";
import { addJournal } from "../actions/journal.action";
import {addNews} from "../actions/news.action";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isAddJournalOpen, setIsAddJournalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [schedule, setSchedule] = useState([]); // User schedule data state
  const [currentClass, setCurrentClass] = useState(null); // Current class state
  const [nextClass, setNextClass] = useState(null); // Next class state

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    sources: "",
    images: "",
  });

const [addJournalTitle, setAddJournalTitle] = useState('');
const [addJournalContent, setAddJournalContent] = useState('');


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
    const loadSchedule = async () => {
        if (!username) {
            console.error("Username is required to fetch schedule");
            return;
        }
        try {
            const response = await getScheduleData(username);
            console.log("Schedule API response:", response); // Log the response for debugging
            if (response.data && response.data) {
                setSchedule(response.data); // Save the fetched schedule
                console.log("Saved Data =", response.data);
            } else {
                console.error("Failed to load schedule:", response?.data || response?.message);
            }
        } catch (error) {
            console.error("Error fetching schedule data:", error);
        }
    };

    loadSchedule();
}, [username]);

useEffect(() => {
  if (schedule.length > 0) {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    const currentDayIndex = now.getDay(); // Get the current day index (0-6, Sunday-Saturday)

    // Map of days to week days index
    const daysOfWeek = {
      "Minggu": 0,
      "Senin": 1,
      "Selasa": 2,
      "Rabu": 3,
      "Kamis": 4,
      "Jumat": 5,
      "Sabtu": 6,
    };

    let currentClass = null;
    let nextClass = null;

    // Sort schedule by day and class start time (converted to minutes)
    const sortedSchedule = schedule
      .map((classItem) => {
        const startTimeParts = classItem.class_start_time.split(':');
        const startTimeInMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
        const classDayIndex = daysOfWeek[classItem.day];
        const endTimeParts = classItem.class_end_time.split(':');
        const endTimeInMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);

        return {
          ...classItem,
          class_start_time_minutes: startTimeInMinutes,
          class_end_time_minutes: endTimeInMinutes, // Add the class end time
          class_day_index: classDayIndex, // Add the day index to compare
        };
      })
      .filter((classItem) => classItem.class_day_index === currentDayIndex) // Only include classes for today
      .sort((a, b) => {
        // First, compare by start time
        return a.class_start_time_minutes - b.class_start_time_minutes;
      });

    // Determine current and next class
    for (let i = 0; i < sortedSchedule.length; i++) {
      const classItem = sortedSchedule[i];
      const classStartTime = classItem.class_start_time_minutes;
      const classEndTime = classItem.class_end_time_minutes;

      // Check if the current time is within the class time range
      if (currentClass === null && classStartTime <= currentTimeInMinutes && currentTimeInMinutes <= classEndTime) {
        currentClass = classItem;
      }

      // Check if this class is the next class
      if (nextClass === null && classStartTime > currentTimeInMinutes) {
        nextClass = classItem;
        break; // Only need the first upcoming class
      }
    }

    setCurrentClass(currentClass); // Set current class
    setNextClass(nextClass); // Set next class

    // Log the current and next class to the console
    console.log("Current Class:", currentClass);
    console.log("Next Class:", nextClass);
  }
}, [schedule]);


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
  const handleSaveAddJournal = async (e) => {
    e.preventDefault();
  
    const title = addJournalTitle;
    const content = addJournalContent;
  
    // Call the API
    const result = await addJournal(username, title, content);
  
    if (result.success) {
      alert("Journal added successfully!");
      closeAddJournalModal();
      // Optionally, refresh the journal list or update state
    } else {
      alert(`Error adding journal: ${result.message}`);
    }
  };
  

  const closeModal = () => {
    setSelectedJournal(null);
    setIsModalOpen(false);
  };
  const openJournalModal = (journal) => {
    setSelectedJournal(journal);
    setIsJournalModalOpen(true); // Open Journal modal
  };
  
  const closeJournalModal = () => {
    setSelectedJournal(null);
    setIsJournalModalOpen(false); // Close Journal modal
  };

  const openAddJournalModal = (journal) => {
    setSelectedJournal(journal);
    setIsAddJournalOpen(true); // Open Journal modal
  };
  
  const closeAddJournalModal = () => {
    setSelectedJournal(null);
    setIsAddJournalOpen(false); // Close Journal modal
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

  const handleMoveToStress = () => {
    navigate("/weeklyStress");
  }

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
      setIsModalOpen(false); // Tutup modal setelah sukses
      setNewArticle({ title: "", content: "", sources: "", images: "" }); // Reset form
    } else {
      alert("Failed to add news!");
    }
  };

  const getCurrentDate = () => {
    const options = { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    return new Date().toLocaleDateString("id-ID", options); // Use Indonesian locale (id-ID)
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
          {username == "zik" &&(
            <button
              className="add-news"
              onClick={() => setIsModalOpen(true)}
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
                  {article.images && (
                    <img
                      src={article.images}
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
          <div className="modal-overlay-news">
            <div className="modal-news">
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
              <div className="modal-buttons-news">
                <button onClick={handleAddNews}>Submit</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
  
        {/* Journal Section */}
        
        <div className="box journal-container">
          <div className="journal">
          <div className="header">
          <h2>Journal</h2>
          
            <button
              className="add-news"
              onClick={() => setIsAddJournalOpen(true)}
              style={{
                marginLeft: "auto",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              +
            </button>
        </div>
            {journal.length > 0 ? (
              journal.map((entry) => (
                <div
                  className="journal-entry"
                  key={entry.id}
                  onClick={() => openJournalModal(entry)}
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
          isOpen={openJournalModal}
          onRequestClose={closeJournalModal}
          contentLabel="Journal Details"
          className="modal"
          overlayClassName="modal-overlay-journal"
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
      {/* Add Journal Modal */}
      {isAddJournalOpen && (
        <Modal
          isOpen={openAddJournalModal}
          onRequestClose={closeAddJournalModal}
          contentLabel="Add Journal"
          className="modal"
          overlayClassName="modal-overlay-journal"
        >
          <h2>Add New Journal</h2>
          <form onSubmit={handleSaveAddJournal}>
              <input
                type="text"
                value={addJournalTitle}
                onChange={(e) => setAddJournalTitle(e.target.value)}
                placeholder="Enter journal title"
                required
              />
              <textarea
                value={addJournalContent}
                onChange={(e) => setAddJournalContent(e.target.value)}
                placeholder="Enter journal content"
                rows="5"
                required
              />
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={closeAddJournalModal}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}


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
        <div className="box stress" onClick={handleMoveToStress}>
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
  <div class="class-cards-container">
  <div className="schedule-card">
    <div className="schedule-content">
      {currentClass ? (
        <div className="class-card">
          <h3>Current Class</h3>
          <p><strong>{currentClass.class_name}</strong></p>
          <p>{currentClass.class_start_time} - {currentClass.class_end_time}</p>
        </div>
      ) : (
        <div className="class-card no-class">
          <p>No class currently in session.</p>
        </div>
      )}

      {nextClass ? (
        <div className="class-card">
          <h3>Next Class</h3>
          <p><strong>{nextClass.class_name}</strong></p>
          <p>{nextClass.class_start_time} - {nextClass.class_end_time}</p>
        </div>
      ) : (
        <div className="class-card no-class">
          <p>No upcoming class.</p>
        </div>
      )}
      </div>
    </div>
  </div>
</div>

        </div>
        </div>
  );
};

export default MainPage;