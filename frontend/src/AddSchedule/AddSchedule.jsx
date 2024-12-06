import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSchedule.css';
import { addSchedule } from '../actions/schedule.action';

const AddSchedule = () => {
  const [form, setForm] = useState({
    className: '',
    day: '',
    classStartTime: '',
    classEndTime: '',
    taskDuration: '',
    sleepHours: '',
  });

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setError('No username found. Please log in again.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!username) {
        setError('No username found. Please log in again.');
        return;
      }

      await addSchedule(
        form.className,
        form.day,
        form.classStartTime,
        form.classEndTime,
        form.taskDuration,
        form.sleepHours,
        username // Use username from localStorage
      );

      navigate('/scheduleList'); // Navigate back to the schedule list after adding
    } catch (error) {
      setError('Failed to add schedule. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="add-schedule-container">
      <h1>Add New Schedule</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="add-schedule-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class Name:</label>
          <input
            type="text"
            name="className"
            value={form.className}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Day:</label>
          <input
            type="text"
            name="day"
            value={form.day}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            name="classStartTime"
            value={form.classStartTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            name="classEndTime"
            value={form.classEndTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Task Duration (hours):</label>
          <input
            type="number"
            step="0.1"
            name="taskDuration"
            value={form.taskDuration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sleep Hours (hours):</label>
          <input
            type="number"
            step="0.1"
            name="sleepHours"
            value={form.sleepHours}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSchedule;