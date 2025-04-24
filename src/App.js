import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { AuthProvider } from "./shared/context/AuthContext";
import LoginPage from "./features/auth/login/LoginPage";
import RegistrationPage from "./features/auth/register/RegistrationPage";
import UserHomePage from "./features/user/home/UserHomePage";
import EmployeeHomePage from "./features/dashboard/employee/menu/MenuPage";
import NewApplicationsPage from "./features/dashboard/employee/applications/new/NewApplicationsPage";
import HistoryApplicationsPage from "./features/dashboard/employee/applications/history/HistoryApplicationsPage";
import ContractsLegalEntitiesPage from "./features/dashboard/employee/contracts/management/legal-entities/ContractsLegalEntitiesPage";
import ContractsNaturalPersonsPage from "./features/dashboard/employee/contracts/management/natural-persons/ContractsNaturalPersonsPage";
import UserRegistrationPage from "./features/dashboard/employee/user-register/UserRegistrationPage";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/client-page" element={<UserHomePage />} />
        <Route path="/menu-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><EmployeeHomePage /></Layout></ProtectedRoute>} />
        <Route path="/new-applications-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><NewApplicationsPage /></Layout></ProtectedRoute>} />
        <Route path="/history-applications-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><HistoryApplicationsPage /></Layout></ProtectedRoute>} />
        <Route path="/contract-management-legal-entities-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><ContractsLegalEntitiesPage /></Layout></ProtectedRoute>} />
        <Route path="/contract-management-natural-persons-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><ContractsNaturalPersonsPage /></Layout></ProtectedRoute>} />
        <Route path="/user-registration-page" element={<ProtectedRoute allowedRoles={['employee']}><Layout><UserRegistrationPage /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;