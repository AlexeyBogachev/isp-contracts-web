import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';
import './styles.module.css';

const RegistrationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
  
    const userData = {
      phone_number: phoneNumber,
      password,
    };
  
     if (email.trim()) {
      userData.email = email;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register/user', userData);
  
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.message || 'Попробуйте снова'));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Регистрация</h2>
        <RegistrationForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleRegister={handleRegister}
          error={error}
        />
      </div>
    </div>
  );
};

export default RegistrationPage;