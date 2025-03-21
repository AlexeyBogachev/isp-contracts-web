import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './LoginForm';
import './styles.module.css';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { phone_number: phoneNumber, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        const token = response.data.token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userRole = decodedToken.role;

        if (userRole === 'user') {
          navigate('/client-page');
        } else if (userRole === 'employee') {
          navigate('/employee-page');
        }
      }
    } catch (err) {
      setError('Ошибка входа: ' + (err.response?.data?.message || 'Попробуйте снова'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Заключение договоров с Интернет-провайдером</h2>
        <LoginForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          error={error}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default LoginPage;