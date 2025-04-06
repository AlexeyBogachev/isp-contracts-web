import styles from './styles.module.css';

const LoginForm = ({
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  handleLogin,
  error,
  navigate,
}) => {
  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin}>
        <div className={styles.loginBox}>
          <h2 className={styles['login-title']}>
            Заключение договоров с Интернет-провайдером
          </h2>

          <input
            type="text"
            name="phone"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            autoComplete="username"
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit">Войти</button>

          <div className="login-redirect">
            <span>Еще нет аккаунта? — Зарегистрируйтесь! </span>
            <button
              type="button"
              onClick={() => navigate('/registration')}
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