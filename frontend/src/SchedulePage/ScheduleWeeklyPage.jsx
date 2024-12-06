import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/user.action';
import { Line } from 'react-chartjs-2';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar
import './ScheduleWeeklyPage.module.css';
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
    case 'Senin':
      return 'rgba(54, 162, 235, 1)';
    case 'Selasa':
      return 'rgba(255, 99, 132, 1)';
    case 'Rabu':
      return 'rgba(255, 159, 64, 1)';
    case 'Kamis':
      return 'rgba(153, 102, 255, 1)';
    case 'Jumat':
      return 'rgba(75, 192, 192, 1)';
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
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const storedUsername = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUsername) {
        setError('No username found in localStorage.');
        setLoading(false);
        return;
      }
      try {
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
              borderWidth: 5,
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

  const getInitials = (name) => {
    if (!name) return 'NA';
    const initials = name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('');
    return initials;
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    logout();
    alert('Berhasil logout!');
    navigate('/');
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
        <div className='title'>Weekly Stress Analysis</div>
        <div className="profile">{getInitials(storedUsername)}</div>
      </div>
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
      <div className="main-content">
        {/* <div className="chart-card"> */}
        <div
            style={{
                height: '640px', // Tinggi chart
                width: '97.4%',  // Lebar chart
                borderRadius: '15px',
                boxSizing: 'content-box',
                marginLeft: '10px',
                marginRight: '30px',
                paddingLeft:'10px',
                paddingRight:'10px',
                backgroundColor: '#F0E3C7', // Warna latar belakang
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
                    text: 'Weekly Stress Levels',
                    font: { size: 20 },
                    color: 'black',
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
                        color: 'rgba(0, 0, 0, 0.2)', // Warna grid horizontal
                    },
                    title: {
                        display: true,
                        text: 'Day of the Week',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black',
                    },
                    },
                    y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.2)', // Warna grid vertikal
                    },
                    title: {
                        display: true,
                        text: 'Stress Level',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black',
                        stepSize: 1,
                    },
                    },
                },
                }}
            />
            </div>

        </div>
      </div>
    // </div>
  );
};

export default WeeklyStressPage;