import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import LoginForm from "./LoginForm";
import PageTransition from "../animation/PageTransition";

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
        navigate("/home");
      } else if (userData.role === "employee") {
        navigate("/menu");
      } else {
        setError("Неизвестная роль пользователя");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageTransition>
      <LoginForm
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        error={error}
      />
    </PageTransition>
  );
};

export default LoginPage;
