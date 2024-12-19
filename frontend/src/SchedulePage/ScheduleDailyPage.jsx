import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import { Line } from "react-chartjs-2";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./ScheduleDailyPage.module.css";
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
import { getStressData } from "../actions/schedule.action";

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

// Utility to determine color for each day
const getColorForDay = (day) => {
  switch (day) {
    case "Senin":
      return "rgba(54, 162, 235, 1)";
    case "Selasa":
      return "rgba(255, 99, 132, 1)";
    case "Rabu":
      return "rgba(255, 159, 64, 1)";
    case "Kamis":
      return "rgba(153, 102, 255, 1)";
    case "Jumat":
      return "rgba(75, 192, 192, 1)";
    default:
      return "rgba(201, 203, 207, 1)";
  }
};

// Utility functions for stress calculations
const calculateAverageStress = (dayData) => {
  const stressValues = Object.values(dayData);
  const sum = stressValues.reduce((a, b) => a + b, 0);
  return (sum / stressValues.length).toFixed(2);
};

const findPeakStress = (dayData) => {
  const peakStress = Math.max(...Object.values(dayData));
  return peakStress.toFixed(2);
};

const DailyStressPage = () => {
  const [chartData, setChartData] = useState(null);
  const [stressAnalytics, setStressAnalytics] = useState({
    averageStress: {},
    peakStress: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [showModalDailyStress, setShowModalDailyStress] = useState(false);
  const storedUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError("No username found in localStorage.");
        setShowModalDailyStress(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getStressData(storedUsername);

        // Check if data is empty or undefined
        if (!data || Object.keys(data).length === 0) {
          setShowModalDailyStress(true);
          setError("No schedule data found");
          setLoading(false);
          return;
        }

        // Prepare data for hourly stress levels
        const hours = Object.keys(data[Object.keys(data)[0]]); // Assuming all days have the same time intervals
        const datasets = Object.keys(data).map((day) => ({
          label: day,
          data: Object.values(data[day]), // Hourly data for the day
          borderColor: getColorForDay(day),
          backgroundColor: getColorForDay(day),
          fill: false,
          tension: 0.4,
          pointRadius: 5,
        }));

        const preparedData = {
          labels: hours,
          datasets: datasets,
        };

        // Calculate stress analytics
        const averageStress = {};
        const peakStress = {};

        Object.keys(data).forEach((day) => {
          averageStress[day] = calculateAverageStress(data[day]);
          peakStress[day] = findPeakStress(data[day]);
        });

        setChartData(preparedData);
        setStressAnalytics({ averageStress, peakStress });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stress data:", err);
        setError("Error fetching stress data");
        setShowModalDailyStress(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [storedUsername]);

  const closeModal = () => {
    setShowModalDailyStress(false);
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    logout();
    alert("Berhasil logout!");
    navigate("/");
  };

  const moveToSchedulePage = () => {
    navigate("/ScheduleList");
  };

  // Modal component
  const Modal = () => (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-ScheduleList"]}>
          <div className={styles["modal-content-ScheduleList"]}>
            <button className={styles["modal-close-button"]} onClick={closeModal}>
              ×
            </button>
            <h3>No Schedule Found</h3>
            <p>
              You have not created any schedule yet. Please add a schedule to
              proceed.
            </p>
            <button className={styles["modal-action-button"]} onClick={moveToSchedulePage}>
              Add Schedule
            </button>
          </div>
        </div>
      </div>
    );

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="menu" onClick={toggleSidebar}>
          ☰
        </div>
        <div className="title">Daily Stress Analysis</div>
        <div className="profile">{getInitials(storedUsername)}</div>
      </div>
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
      {showModalDailyStress && <Modal />}
      {!showModalDailyStress && !error && (
        <div
          className="main-content"
          style={{ display: "flex", gap: "20px", padding: "20px" }}
        >
          <div
            style={{
              flex: 2,
              height: "640px",
              borderRadius: "15px",
              boxSizing: "content-box",
              backgroundColor: "#F0E3C7",
              padding: "20px",
            }}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Hourly Stress Levels Throughout the Week",
                    font: { size: 20 },
                    color: "black",
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(
                          2
                        )} stress units`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: "rgba(0, 0, 0, 0.2)",
                    },
                    title: {
                      display: true,
                      text: "Time of Day",
                      color: "black",
                    },
                    ticks: {
                      color: "black",
                    },
                  },
                  y: {
                    grid: {
                      color: "rgba(0, 0, 0, 0.2)",
                    },
                    title: {
                      display: true,
                      text: "Stress Level",
                      color: "black",
                    },
                    ticks: {
                      color: "black",
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Additional Insight Cards */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "640px",
            }}
          >
            {/* Average Stress Card */}
            <div
              style={{
                backgroundColor: "#E6D5B8",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                Average Daily Stress
              </h3>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {Object.entries(stressAnalytics.averageStress).map(
                  ([day, avgStress]) => (
                    <div
                      key={day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        color: getColorForDay(day),
                        fontWeight: "bold",
                      }}
                    >
                      <span>{day}</span>
                      <span>{avgStress}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Peak Stress Card */}
            <div
              style={{
                backgroundColor: "#E6D5B8",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                Peak Daily Stress
              </h3>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {Object.entries(stressAnalytics.peakStress).map(
                  ([day, peakStress]) => (
                    <div
                      key={day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        color: getColorForDay(day),
                        fontWeight: "bold",
                      }}
                    >
                      <span>{day}</span>
                      <span>{peakStress}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              className="navigate-Weekly"
              onClick={() => navigate("/weeklyStress")}
            >
              View Weekly Stress Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyStressPage;