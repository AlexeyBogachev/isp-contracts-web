import { formatPhoneNumber } from '../../../../shared/utils/formatPhoneNumber';
import styles from './UserRegistration.module.css';

const UserRegistrationForm = ({
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  password,
  setPassword,
  handleRegister,
  error
}) => {
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
        <div className={styles['button-group']}>
          <button type="submit">Зарегистрироваться</button>
        </div>

        {error && <p className={styles['error-message']}>{error}</p>}
      </div>
    </form>
  );
};

export default UserRegistrationForm;