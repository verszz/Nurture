import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UniqueScheduleList.css';
import { getScheduleData } from '../actions/schedule.action';
import { deleteSchedule } from '../actions/schedule.action';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar

const UniqueScheduleList = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const scheduleOwner = 'zik'; // Replace with actual owner or state variable
      const data = await getScheduleData(scheduleOwner);
      setSchedule(data);
    } catch (error) {
      setError('Failed to load schedule data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      const scheduleOwner = 'zik'; // Replace with actual owner
      await deleteSchedule(scheduleId, scheduleOwner); // Call the delete action
      // Remove deleted schedule from the state
      setSchedule(schedule.filter((item) => item.id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule.');
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    alert('Berhasil logout!');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const initials = name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('');
    return initials;
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const groupedSchedule = schedule.reduce((acc, item) => {
    acc[item.day] = acc[item.day] || [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div className="unique-schedule-container">
        {/* Header Section */}
    <div className="header">
      <div className="menu" onClick={toggleSidebar}>
        ☰
      </div>
      <div>Weekly Stress Analysis</div>
      <div className="profile">{getInitials("zik")}</div>
    </div>
    {/* Sidebar Component */}
    <Sidebar
      isVisible={isSidebarVisible}
      toggleSidebar={toggleSidebar}
      navigate={navigate}
      handleLogout={handleLogout}
    />
      <h1>Schedule for User "zik"</h1>
      <button className="add-schedule-button" onClick={() => navigate('/addschedule')}>
        Add Schedule
      </button>
      <div className="unique-day-cards">
        {Object.keys(groupedSchedule).map((day) => (
          <div className="unique-day-card" key={day}>
            <h2>{day}</h2>
            <div className="unique-class-cards">
              {groupedSchedule[day].map((item) => (
                <div className="unique-class-card" key={item.id}>
                  <h3>{item.class_name}</h3>
                  <p>
                    <strong>Time:</strong> {item.class_start_time} - {item.class_end_time}
                  </p>
                  <p>
                    <strong>Task Duration:</strong> {item.task_duration} hrs
                  </p>
                  <p>
                    <strong>Sleep Hours:</strong> {item.sleep_hours} hrs
                  </p>
                  <button
                    className="delete-schedule-button"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniqueScheduleList;