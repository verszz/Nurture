import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import MainPage from './MainPage/MainPage';
import Chatbot from './ChatBot/ChatBot';
import WeeklyStressPage from './SchedulePage/ScheduleWeeklyPage';
import ProtectedRoute from './ProtectedRoute';
import NewsPage from './NewsPage/NewsPage';
import AutoLogout from './AutoLogout/AutoLogout';
import './App.css';

function App() {

  return (
    <Router>
    <AutoLogout>
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
        <Route path="/weeklyStress" element={
        <ProtectedRoute>
            <WeeklyStressPage/>
        </ProtectedRoute>
          } />
        <Route path="/news" element={
        <ProtectedRoute>
            <NewsPage/>
        </ProtectedRoute>
          } />
      </Routes>
      </AutoLogout>
    </Router>
  );
}
export default App
