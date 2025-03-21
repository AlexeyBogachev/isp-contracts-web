import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-auth', { withCredentials: true });
        const userRole = response.data.role;

        if (!allowedRoles.includes(userRole)) {
          navigate('/login');
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error('Ошибка авторизации:', err.response?.data?.message || err.message);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isAuthorized === null) {
    return <p>Загрузка...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;