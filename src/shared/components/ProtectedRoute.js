import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;