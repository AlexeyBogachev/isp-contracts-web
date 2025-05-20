import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import styles from "./ClientHeader.module.css";

const ClientHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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

    const handleTitleClick = () => {
        navigate("/home");
    };

    const handleLogoClick = () => {
        navigate("/home");
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.leftSection}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/9794/9794255.png"
                    alt="ISP Logo"
                    className={styles.logo}
                    onClick={handleLogoClick}
                />
                <h1 className={styles.title} onClick={handleTitleClick}>
                    Заключение договоров с Интернет-провайдером
                </h1>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.loginButton} onClick={handleLogout}>
                    Войти
                </button>
            </div>
        </header>
    );
};

export default ClientHeader;
