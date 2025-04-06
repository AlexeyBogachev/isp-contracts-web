import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css'; // Импортируем стили

const RegistrationForm = ({ phoneNumber, setPhoneNumber, email, setEmail, password, setPassword, handleRegister, error }) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleRegister}>
      <div className={styles.loginBox}> {/* Стиль для регистрации такой же, как и для авторизации */}
        <input
          type="text"
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email (необязательно)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>

        {error && <p className={styles['error-message']}>{error}</p>} {/* Ошибки стилизуются одинаково */}

        <div className={styles['login-redirect']}> {/* Ссылка для перехода на страницу авторизации */}
          <span>Уже есть аккаунт? </span>
          <button type="button" onClick={() => navigate('/login')} className={styles['register-button']}>
            Войти
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;