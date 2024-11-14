import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import './App.css';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage/>} /> 
      </Routes>
    </Router>
  );
}
export default App
