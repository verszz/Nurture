import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import { Line } from "react-chartjs-2";
import Sidebar from "../Sidebar/Sidebar";
import "./ScheduleDailyPage.module.css";
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
  const storedUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError("No username found in localStorage.");
        setLoading(false);
        return;
      }
      try {
        const data = await getStressData(storedUsername);

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
        setLoading(false);
      }
    };

    fetchData();
  }, [storedUsername]);

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

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
            height: "640px", // Match the height of the main chart card
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
              flex: 1, // Allow the card to grow and fill available space
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                marginBottom: "15px",
                color: "#333",
                fontWeight: "bold", // Make title bold
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
                      fontWeight: "bold", // Make day and stress value bold
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
              flex: 1, // Allow the card to grow and fill available space
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                marginBottom: "15px",
                color: "#333",
                fontWeight: "bold", // Make title bold
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
                      fontWeight: "bold", // Make day and stress value bold
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
    </div>
  );
};

export default DailyStressPage;
