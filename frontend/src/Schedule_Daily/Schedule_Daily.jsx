import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./Schedule_Daily.css";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getColorForDay = (day) => {
  const color = {
    "Senin": "rgba(54, 162, 235, 1)",
    "Selasa": "rgba(255, 99, 132, 1)",
    "Rabu": "rgba(255, 159, 64, 1)",
    "Kamis": "rgba(153, 102, 255, 1)",
    "Jumat": "rgba(75, 192, 192, 1)",
  }[day] || "rgba(201, 203, 207, 1)";  // Default color if the day is unknown

  console.log(day, color); // Debugging line to check color
  return color;
};

const StressTrackerChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Retrieve username from localStorage
  const storedUsername = localStorage.getItem("username");

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError("No username found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const data = await getStressData(storedUsername);
        const preparedData = {
          labels: Object.keys(data[Object.keys(data)[0]]),
          datasets: Object.keys(data).map((day) => ({
            label: day,
            data: Object.values(data[day]),
            borderColor: getColorForDay(day), // Apply the color for the line
            backgroundColor: getColorForDay(day), // Apply the color for the background (if filled)
            fill: false, // No filling under the line
            tension: 0.4, // Line smoothness
          })),
        };
        setChartData(preparedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stress data:", err);
        setError("Error fetching stress data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [storedUsername]);  // Dependency array now includes storedUsername

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="body">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          &times;
        </div>
        <ul>
          <li>Home</li>
          <li>Weekly Stress</li>
          <li>Journal</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content-DailyStress ${sidebarVisible ? "" : "collapsed"}`}>
        {/* Header */}
        <div className="header">
          <div className="menu" onClick={toggleSidebar}>
            &#9776;
          </div>
          <h1>Daily Stress Tracker</h1>
          <div className="profile">R</div>
        </div>

        {/* Chart Card */}
        <div className="chart-card">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Stress Levels Throughout the Week",
                  font: { size: 16 },
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
                x: { title: { display: true, text: "Time of Day" } },
                y: {
                  title: { display: true, text: "Stress Level" },
                  min: 0,
                  max: 15,
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StressTrackerChart;
