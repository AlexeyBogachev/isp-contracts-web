import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../../shared/utils/formatPhoneNumber';
import styles from './Registration.module.css';

const RegistrationForm = ({ phoneNumber, setPhoneNumber, email, setEmail, password, setPassword, handleRegister, error }) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleRegister}>
      <div className={styles.loginBox}> 
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
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <button type="submit">Зарегистрироваться</button>

        {error && <p className={styles['error-message']}>{error}</p>}

        <div className={styles['login-redirect']}> 
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