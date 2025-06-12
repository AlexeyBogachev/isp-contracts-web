import { formatPhoneNumber } from '../../../shared/utils/formatPhoneNumber';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Login.module.css';

const LoginForm = ({
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  handleLogin,
  error
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleNavigateToRegister = () => {
    navigate('/registration');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin}>
        <div className={styles.loginBox}>
          <h2 className={styles['login-title']}>
            Интернет-провайдер              Оптик-Телеком
          </h2>

          <input
            type="text"
            name="phone"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              if (formatted.length <= 12) {
                setPhoneNumber(formatted);
              }
            }}
            required
            autoComplete="username"
          />

          <div className={styles['password-input-container']}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles['password-toggle']}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          <button type="submit">Войти</button>

          <div className={styles['login-redirect']}>
            <span className={styles['redirect-text']}>Еще нет аккаунта? — Зарегистрируйтесь!</span>
            <button
              type="button"
              onClick={handleNavigateToRegister}
              className={styles['register-button']}
            >
              Регистрация
            </button>
          </div>

          {error && <p className={styles['error-message']}>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;