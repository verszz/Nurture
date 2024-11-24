import React from "react";
import WeeklyStressPage from '../SchedulePage/Schedule_Weekly_Page';
import StressTrackerChart from '../Schedule_Daily/Schedule_Daily'
import "./Dashboard.css";

const StressDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Stress Dashboard</h1>
      <div className="charts-container">
        {/* Weekly Stress Chart */}
        <div className="chart-wrapper">
          <h2>Weekly Stress Levels</h2>
          <WeeklyStressPage />
        </div>
        {/* Daily Stress Chart */}
        <div className="chart-wrapper">
          <h2>Daily Stress Tracker</h2>
          <StressTrackerChart />
        </div>
      </div>
    </div>
  );
};

export default StressDashboard;
