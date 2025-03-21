import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ phoneNumber, setPhoneNumber, email, setEmail, password, setPassword, handleRegister, error }) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleRegister}>
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
      
      {error && <p className="error-message">{error}</p>}

      <div className="login-redirect">
        <span>Уже есть аккаунт? </span>
        <button type="button" onClick={() => navigate('/login')} className="login-button">
          Войти
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;