import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './Schedule_Weekly_Page.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getStressData } from '../actions/schedule.action'; // Ensure this is implemented correctly

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
    case 'Jumat':
      return 'rgba(75, 192, 192, 1)';
    case 'Kamis':
      return 'rgba(153, 102, 255, 1)';
    case 'Rabu':
      return 'rgba(255, 159, 64, 1)';
    case 'Selasa':
      return 'rgba(255, 99, 132, 1)';
    case 'Senin':
      return 'rgba(54, 162, 235, 1)';
    default:
      return 'rgba(201, 203, 207, 1)';
  }
};

// Calculate total stress level for a given day
const calculateTotalStress = (dayData) =>
  Object.values(dayData).reduce((total, current) => total + current, 0);

const WeeklyStressPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Sidebar state
  const storedUsername = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError("No username found in localStorage.");
        setLoading(false);
        return;
      }      try {
        const data = await getStressData(storedUsername);
        const preparedData = {
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Total Stress Level per Day',
              data: Object.keys(data).map((day) =>
                calculateTotalStress(data[day])
              ),
              backgroundColor: Object.keys(data).map((day) =>
                getColorForDay(day)
              ),
              borderColor: Object.keys(data).map((day) => getColorForDay(day)),
              borderWidth: 2,
              pointBackgroundColor: Object.keys(data).map((day) =>
                getColorForDay(day)
              ),
              pointRadius: 5,
              hoverBackgroundColor: 'rgba(0,0,0,0.3)',
            },
          ],
        };
        setChartData(preparedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stress data:', err);
        setError('Error fetching stress data');
        setLoading(false);
      }
    };

    fetchData();
  }, [storedUsername]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="body">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
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
      <div className={`main-content ${sidebarVisible ? '' : 'collapsed'}`}>
        {/* Header */}
        <div className="header">
          <div className="menu" onClick={toggleSidebar}>
            &#9776;
          </div>
          <h1>Weekly Stress Levels</h1>
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
                  text: 'Weekly Stress Levels',
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
                x: { title: { display: true, text: 'Day of the Week' } },
                y: {
                  title: { display: true, text: 'Stress Level' },
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

export default WeeklyStressPage;
