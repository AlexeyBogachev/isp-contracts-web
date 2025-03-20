import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/Authorization/Login/LoginPage';
import UserHomePage from './pages/Dashboard/User/UserHomePage';
import EmployeeHomePage from './pages/Dashboard/Employee/EmployeeHomePage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client-page" element={<UserHomePage />} />
      <Route path="/employee-page" element={<EmployeeHomePage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default App;