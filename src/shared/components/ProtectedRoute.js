import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, intentionalLogout, setUserChoicePending } = useAuth();
  const navigate = useNavigate();
  const alertShown = useRef(false);

  useEffect(() => {
    if (!user && !alertShown.current && !intentionalLogout) {
      alertShown.current = true;

      const isStaffRoute = allowedRoles.includes('employee');

      if (isStaffRoute) {
        navigate('/login');
      } else {
        setUserChoicePending(true);
        const confirmLogin = window.confirm(
          'Для доступа к этой странице необходимо авторизоваться. Хотите перейти на страницу входа?'
        );
        setUserChoicePending(false);

        if (confirmLogin) {
          navigate('/login');
        } else {
          navigate('/home');
        }
      }
    }
  }, [user, navigate, intentionalLogout, allowedRoles, setUserChoicePending]);

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;