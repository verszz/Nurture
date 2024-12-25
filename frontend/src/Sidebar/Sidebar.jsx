import React from "react";
import "./Sidebar.css"; // Pastikan memiliki styling untuk sidebar

const Sidebar = ({ isVisible, toggleSidebar, navigate, handleLogout }) => {
  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      <div className="close-btn" onClick={toggleSidebar}>
        ✖
      </div>
      <ul>
        <li onClick={() => navigate("/home")}>Home</li>
        <li onClick={() => navigate("/weeklyStress")}>Weekly Stress Tracker</li>
        <li onClick={() => navigate("/DailyStress")}>Daily Stress Tracker</li>
        <li onClick={() => navigate("/ScheduleList")}>Schedules</li>
        <li onClick={() => navigate("/ShowAllJournal")}>All Journal</li>
        <li onClick={() => navigate("/news")}>News</li>
        <li className="logout" onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;