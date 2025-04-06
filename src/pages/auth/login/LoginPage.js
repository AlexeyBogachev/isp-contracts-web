import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await login(phoneNumber, password);
      
      if (userData.role === "user") {
        navigate("/client-page");
      } else if (userData.role === "employee") {
        navigate("/menu-page");
      } else {
        setError("Неизвестная роль пользователя");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          error={error}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default LoginPage;
