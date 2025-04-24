import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/menu-page">Заключение договоров</Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/menu-page">Главная</Link>
        <Link to="/new-applications-page">Заявки</Link>
        <Link to="/user-registration-page">Рег. пользователя</Link>
        <Link to="/history-applications-page">История заявок</Link>
        <Link to="/contract-management-legal-entities-page">Дог. Юр. лиц</Link>
        <Link to="/contract-management-natural-persons-page">Дог. Физ. лиц</Link>
        <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
      </nav>
    </header>
  );
};

export default Header;