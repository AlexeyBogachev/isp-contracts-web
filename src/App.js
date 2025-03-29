import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/login/LoginPage";
import RegistrationPage from "./pages/auth/register/RegistrationPage";
import UserHomePage from "./pages/dashboard/user/home/UserHomePage";
import EmployeeHomePage from "./pages/dashboard/employee/menu/MenuPage";
import NewApplicationsPage from "./pages/dashboard/employee/applications/new-applications/NewApplicationsPage";
import HistoryApplicationsPage from "./pages/dashboard/employee/applications/history-applications/HistoryApplicationsPage";
import ContractManagementPage from "./pages/dashboard/employee/contracts/contract-management/ContractManagementPage";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/client-page" element={<UserHomePage />} />
        <Route path="/menu-page" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeHomePage /></ProtectedRoute>} />
        <Route path="/new-applications-page" element={<ProtectedRoute allowedRoles={['employee']}><NewApplicationsPage /></ProtectedRoute>} />
        <Route path="/history-applications-page" element={<ProtectedRoute allowedRoles={['employee']}><HistoryApplicationsPage /></ProtectedRoute>} />
        <Route path="/contract-management-page" element={<ProtectedRoute allowedRoles={['employee']}><ContractManagementPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;