import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';
import styles from './styles.module.css'; // Подключаем стили

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
    <div className={styles.container}> {/* Используем те же классы из авторизации */}
      <div className={styles['login-container']}> {/* Применяем контейнер из авторизации */}
        <h2 className={styles['login-title']}>Регистрация</h2> {/* Добавляем заголовок */}
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