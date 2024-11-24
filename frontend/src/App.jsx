import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import MainPage from './MainPage/MainPage';
import Chatbot from './ChatBot/ChatBot';
import StressTrackerChart from './Schedule_Daily/Schedule_Daily'
import WeeklyStressPage from './SchedulePage/Schedule_Weekly_Page';
import StressDashboard from './Stress_Dashboard/Dashboard'
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/home" element={
        <ProtectedRoute>
          <MainPage/>
        </ProtectedRoute>
        } /> 
        <Route path="/chatbot" element={
        <ProtectedRoute>
          <Chatbot/>
        </ProtectedRoute>
          } />
        <Route path="/WeekStressSched" element={<WeeklyStressPage/>} />
        <Route path="/DailyStressSched" element={<StressTrackerChart/>} />
        <Route path="/StressDashboard" element={<StressDashboard/>} />
      </Routes>
    </Router>
  );
}
export default App
