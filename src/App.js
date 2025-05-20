import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import StaffLayout from "./layouts/staff/Layout";
import ClientLayout from "./layouts/client/Layout";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { AuthProvider } from "./shared/context/AuthContext";
import LoginPage from "./features/auth/login/LoginPage";
import RegistrationPage from "./features/auth/register/RegistrationPage";
import RequestFormationPage from "./features/client/request-formation/RequestFormationPage";
import HomePage from "./features/client/home/HomePage";
import EmployeeHomePage from "./features/staff/menu/MenuPage";
import NewApplicationsPage from "./features/staff/applications/new/NewApplicationsPage";
import HistoryApplicationsPage from "./features/staff/applications/history/HistoryApplicationsPage";
import ContractsLegalEntitiesPage from "./features/staff/contracts/legal-entities/ContractsLegalEntitiesPage";
import ContractsNaturalPersonsPage from "./features/staff/contracts/natural-persons/ContractsNaturalPersonsPage";
import UserRegistrationPage from "./features/staff/user/user-register/UserRegistrationPage";
import ViewUsersPage from "./features/staff/user/view/ViewUsersPage";
import CreateApplicationPage from "./features/staff/user/create-application/CreateApplicationPage"

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        {/* Функционал страниц client */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/request-formation" element={<ClientLayout><RequestFormationPage /></ClientLayout>} />
        <Route path="/home" element={<ClientLayout><HomePage /></ClientLayout>} />
        {/* Функционал страниц staff */}
        <Route path="/menu" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><EmployeeHomePage /></StaffLayout></ProtectedRoute>} />
        <Route path="/new-applications" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><NewApplicationsPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/history-applications" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><HistoryApplicationsPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/contract-management-legal-entities" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><ContractsLegalEntitiesPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/contract-management-natural-persons" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><ContractsNaturalPersonsPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/user-registration" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><UserRegistrationPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/view-users" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><ViewUsersPage /></StaffLayout></ProtectedRoute>} />
        <Route path="/create-application" element={<ProtectedRoute allowedRoles={['employee']}><StaffLayout><CreateApplicationPage /></StaffLayout></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;