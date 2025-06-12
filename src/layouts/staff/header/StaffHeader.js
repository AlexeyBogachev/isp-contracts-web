import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import styles from "./StaffHeader.module.css";
import SidebarMenu from "../sidebar-menu/SidebarMenu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

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
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.leftSection}>
          <div className={styles.logoWrapper} onClick={handleNavigateToMenu}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/9794/9794255.png"
              alt="ISP Logo"
              className={styles.logoImage}
            />
          </div>
          <h1 className={styles.title} onClick={handleNavigateToMenu}>
            Интернет-провайдер Оптик-Телеком
          </h1>
        </div>
      </header>
      <SidebarMenu
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Header;