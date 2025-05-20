import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';
import styles from './Registration.module.css';

const RegistrationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

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
      const errorMessage = err.response?.data?.message;
      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['login-container']}>
        <h2 className={styles['login-title']}>Регистрация</h2>
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