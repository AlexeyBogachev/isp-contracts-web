import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegistrationForm from './UserRegistrationForm';
import styles from './UserRegistration.module.css';

const UserRegistrationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setCopied(false);

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
        const { userId } = response.data;
        setUserId(userId);
      }
    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.message || 'Попробуйте снова'));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Ошибка копирования ID');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['login-container']}>
        <h2 className={styles['login-title']}>Регистрация нового клиента</h2>

        {!userId ? (
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
        ) : (
          <div className={styles['registration-success']}>
            <p>Регистрация прошла успешно!</p>
            <p>Ваш ID: <strong>{userId}</strong></p>
            <button onClick={handleCopy}>
              {copied ? 'Скопировано!' : 'Скопировать ID'}
            </button>
            <div className={styles['button-group']}>
              <button onClick={() => {
                setUserId(null);
                setPhoneNumber('');
                setEmail('');
                setPassword('');
                setError('');
                }}>
                Зарегистрировать ещё
              </button>

              <button onClick={() => navigate('/create-application')}>
                Продолжить оформление клиента
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistrationPage;