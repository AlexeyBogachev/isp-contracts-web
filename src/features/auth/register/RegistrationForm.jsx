import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../../shared/utils/formatPhoneNumber';
import { useState } from 'react';
import styles from './Registration.module.css';

const RegistrationForm = ({
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  password,
  setPassword,
  handleRegister,
  error,
  passwordStrength
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return 'Очень слабый';
      case 1:
        return 'Слабый';
      case 2:
        return 'Средний';
      case 3:
        return 'Хороший';
      case 4:
        return 'Сильный';
      default:
        return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return '#ff4d4d';
      case 1:
        return '#ffa64d';
      case 2:
        return '#ffff4d';
      case 3:
        return '#4dff4d';
      case 4:
        return '#00cc00';
      default:
        return '#ccc';
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister}>
        <div className={styles.loginBox}>
          <h2 className={styles['login-title']}>
            Интернет-провайдер Оптик-Телеком
          </h2>

          <input
            type="text"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              if (formatted.length <= 12) {
                setPhoneNumber(formatted);
              }
            }}
            required
          />

          <input
            type="email"
            placeholder="Email (необязательно)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles['password-input-container']}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
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

          {password && (
            <div className={styles['password-strength']}>
              <div className={styles['strength-bar']}>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={styles['strength-segment']}
                    style={{
                      backgroundColor: index <= passwordStrength ? getPasswordStrengthColor() : '#ccc',
                    }}
                  />
                ))}
              </div>
              <span
                className={styles['strength-text']}
                style={{ color: getPasswordStrengthColor() }}
              >
                {getPasswordStrengthText()}
              </span>
            </div>
          )}

          <button type="submit">Зарегистрироваться</button>

          {error && <p className={styles['error-message']}>{error}</p>}

          <div className={styles['login-redirect']}>
            <span className={styles['redirect-text']}>Уже есть аккаунт?</span>
            <button
              type="button"
              onClick={handleNavigateToLogin}
              className={styles['register-button']}
            >
              Войти
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;