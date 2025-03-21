import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import RegistrationPage from './pages/auth/register/RegistrationPage';
import UserHomePage from './pages/dashboard/user/UserHomePage';
import EmployeeHomePage from './pages/dashboard/employee/EmployeeHomePage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/client-page" element={<UserHomePage />} />
      <Route path="/employee-page" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeHomePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default App;