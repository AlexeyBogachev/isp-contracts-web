import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import styles from "./StaffHeader.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Вы уверены, что хотите выйти?");
    if (!confirmLogout) return;

    try {
      await logout();
      localStorage.removeItem("userToken");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  const handleNavigateToMenu = () => {
    navigate("/menu");
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/9794/9794255.png"
          alt="ISP Logo"
          className={styles.logoImage}
          onClick={handleNavigateToMenu}
        />
        <h1 className={styles.title} onClick={handleNavigateToMenu}>
          Заключение договоров с Интернет-провайдером
        </h1>
      </div>
      <nav className={styles.nav}>
        <Link to="/menu">Главная</Link>
        <Link to="/new-applications">Заявки</Link>
        <Link to="/history-applications">История заявок</Link>
        <Link to="/user-registration">Рег. пользователя</Link>
        <Link to="/create-application">Оформ. пользователя</Link>
        <Link to="/contract-management-legal-entities">Дог. Юр. лиц</Link>
        <Link to="/contract-management-natural-persons">Дог. Физ. лиц</Link>
        <Link to="/view-users">Пользователи</Link>
        <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
      </nav>
    </header>
  );
};

export default Header;