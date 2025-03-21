const LoginForm = ({ phoneNumber, setPhoneNumber, password, setPassword, handleLogin, error, navigate }) => {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>

        <div className="login-redirect">
          <span>Еще нет аккаунта? — Зарегистрируйтесь! </span>
          <button type="button" onClick={() => navigate('/registration')} className="register-button">
            Регистрация
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    );
  };
  
  export default LoginForm;