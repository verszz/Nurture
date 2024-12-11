
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import MainPage from './MainPage/MainPage';
import ShowAllNews from './ShowAllNews/ShowAllnews';
import Chatbot from './ChatBot/ChatBot';
import WeeklyStressPage from './SchedulePage/ScheduleWeeklyPage';
import DailyStressChart from './SchedulePage/ScheduleDailyPage';
import ProtectedRoute from './ProtectedRoute';
import NewsPage from './NewsPage/NewsPage';
import ScheduleList from './ViewSchedulePage/Schedule.List';
import AddSchedule from './AddSchedule/AddSchedule';
import AutoLogout from './AutoLogout/AutoLogout';
import EditJournal from './EditJournal/EditJournal';
import ShowAllJournal from './ShowAllJournal/ShowAllJournal';
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
          <Route path='/ShowAllNews' element={
          <ProtectedRoute>
            <ShowAllNews/>
          </ProtectedRoute>
          } />
        <Route path='/dailyStress' element={
          <ProtectedRoute>
            <DailyStressChart/>
          </ProtectedRoute>
          } />
           <Route path='/ShowAllJournal' element={
          <ProtectedRoute>
            <ShowAllJournal/>
          </ProtectedRoute>
          } />
        <Route path='/scheduleList' element={
          <ProtectedRoute>
            <ScheduleList/>
          </ProtectedRoute>
          } />
        <Route path="/editjournal/:id" element={
          <ProtectedRoute>
            <EditJournal/>
          </ProtectedRoute>
        }/>
        <Route path='/addSchedule' element={
          <ProtectedRoute>
            <AddSchedule/>
          </ProtectedRoute>
          } />
      </Routes>
      </AutoLogout>
    </Router>
  );
}
export default App
