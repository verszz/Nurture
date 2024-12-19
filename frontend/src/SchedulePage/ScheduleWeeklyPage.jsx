import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/user.action";
import { Line } from "react-chartjs-2";
import styles from "./ScheduleWeeklyPage.module.css";
import Sidebar from "../Sidebar/Sidebar";
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

// Calculate total stress level for a given day
const calculateTotalStress = (dayData) =>
  Object.values(dayData).reduce((total, current) => total + current, 0);

// Calculate average stress level
const calculateAverageStress = (data) => {
  const totalDays = Object.keys(data).length;
  const totalStress = Object.values(data).reduce(
    (sum, dayData) => sum + calculateTotalStress(dayData),
    0
  );
  return totalDays ? parseFloat((totalStress / totalDays).toFixed(2)) : 0;
};

// Find peak stress level
const calculatePeakStress = (data) => {
  return Math.max(
    ...Object.values(data).map((dayData) => calculateTotalStress(dayData))
  );
};

const WeeklyStressPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [showModalWeeklyStress, setShowModalWeeklyStress] = useState(false);
  const [averageStress, setAverageStress] = useState(0);
  const [peakStress, setPeakStress] = useState(0);

  const storedUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError("No username found in localStorage.");
        setShowModalWeeklyStress(true);
        setLoading(false);
        return;
      }
      try {
        const data = await getStressData(storedUsername);
        
        // Check if data is empty or undefined
        if (!data || Object.keys(data).length === 0) {
          setShowModalWeeklyStress(true);
          setError("No schedule data found");
          setLoading(false);
          return;
        }

        setAverageStress(calculateAverageStress(data));
        setPeakStress(calculatePeakStress(data));

        const preparedData = {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Total Stress Level per Day",
              data: Object.keys(data).map((day) => calculateTotalStress(data[day])),
              backgroundColor: Object.keys(data).map((day) => getColorForDay(day)),
              borderColor: Object.keys(data).map((day) => getColorForDay(day)),
              borderWidth: 5,
              pointBackgroundColor: Object.keys(data).map((day) => getColorForDay(day)),
              pointRadius: 5,
              hoverBackgroundColor: "rgba(0,0,0,0.3)",
            },
          ],
        };
        
        setChartData(preparedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stress data:", err);
        setError("Error fetching stress data");
        setShowModalWeeklyStress(true);
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

  const closeModal = () => {
    setShowModalWeeklyStress(false);
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
        <div className="title">Weekly Stress Analysis</div>
        <div className="profile">{getInitials(storedUsername)}</div>
      </div>
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
      {showModalWeeklyStress && <Modal />}
      {!showModalWeeklyStress && !error && (
        <div className={styles["main-content-week"]} style={{ display: "flex" }}>
          <div
            style={{
              flex: "3",
              marginRight: "20px",
              marginLeft: "10px",
            }}
          >
            <div
              style={{
                height: "640px",
                borderRadius: "15px",
                backgroundColor: "#F0E3C7",
                padding: "10px",
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
                      text: "Weekly Stress Levels",
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
                        text: "Day of the Week",
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
          </div>
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div className={styles["side-card-week"]}>
              <h3>Average Stress Level</h3>
              <div>
                The average stress level across the week is{" "}
                <span className={styles["side-card-week-value"]}>
                  {averageStress}
                </span>
                .
              </div>
            </div>
            <div className={styles["side-card-week"]}>
              <h3>Peak Stress Level</h3>
              <div>
                The peak stress level during the week is{" "}
                <span className={styles["side-card-week-value"]}>
                  {peakStress.toFixed(2)}
                </span>
                .
              </div>
            </div>
            <button
              className={styles["navigate-button-week"]}
              onClick={() => navigate("/DailyStress")}
            >
              View Daily Stress Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyStressPage;