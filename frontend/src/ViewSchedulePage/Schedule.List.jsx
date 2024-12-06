import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UniqueScheduleList.css';
import { getScheduleDataforScheduleList } from '../actions/schedule.action';
import { deleteSchedule } from '../actions/schedule.action';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar
import AddSchedule from '../AddSchedule/AddSchedule';

const UniqueScheduleList = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState(''); // State for the username
  const [showModalScheduleList, setShowModalScheduleList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setError('No username found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchSchedule();
    }
  }, [username]);

  const fetchSchedule = async () => {
    try {
      const data = await getScheduleDataforScheduleList(username); // Use username from state
      setSchedule(data);
    } catch (error) {
      if ( error.message == "Failed to fetch schedule data"){
        setShowModalScheduleList(true);
      }
      else {
        setError("An unexpected error occurred");
        console.error(error)
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId, username); // Use username from state
      // Remove deleted schedule from the state
      setSchedule(schedule.filter((item) => item.id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule.');
    }
  };

  const handleAddSchedule = () => {
    navigate("/addschedule");
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
        <div className="title">Class Schedule</div>
        <div className="profile">{getInitials(username)}</div>
      </div>
      {/* Sidebar Component */}
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
      <button className="add-schedule-button" onClick={() => navigate('/addSchedule')}>
        Add Schedule
      </button>
      {showModalScheduleList && (
        <div className="modal-ScheduleList">
          <div className="modal-content-ScheduleList">
            <h3>No Schedule Found</h3>
            <p>You have not created any schedule yet. Please add a schedule to proceed.</p>
            <button onClick={handleAddSchedule}>Add Schedule</button>
          </div>
        </div>
        )}
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