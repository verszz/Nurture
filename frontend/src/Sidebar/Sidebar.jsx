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
        <li onClick={() => navigate("/profile")}>Profile</li>
        <li onClick={() => navigate("/settings")}>Settings</li>
        <li className="logout" onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
