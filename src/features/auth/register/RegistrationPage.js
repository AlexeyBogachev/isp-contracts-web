import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import RegistrationForm from './RegistrationForm';
import PageTransition from '../animation/PageTransition';

const RegistrationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

    if (passwordStrength < 2) {
      setError('Пароль слишком слабый. Используйте комбинацию букв, цифр и специальных символов.');
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
    <PageTransition>
      <RegistrationForm
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={handlePasswordChange}
        handleRegister={handleRegister}
        error={error}
        passwordStrength={passwordStrength}
      />
    </PageTransition>
  );
};

export default RegistrationPage;