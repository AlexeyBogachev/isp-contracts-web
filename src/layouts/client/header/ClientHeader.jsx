import React from "react";
import styles from "./ClientHeader.module.css";

const ClientHeader = ({
    isScrolled,
    user,
    handleLogoClick,
    handleTitleClick,
    handleProfileClick,
    handleLogin,
    handleLogout
}) => {
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
                    Интернет-провайдер Оптик-Телеком
                </h1>
            </div>
            <div className={styles.rightSection}>
                {user ? (
                    <>
                        {user.role === 'user' && (
                            <button
                                className={styles.profileButton}
                                onClick={handleProfileClick}
                            >
                                Личный кабинет
                            </button>
                        )}
                        <button
                            className={styles.loginButton}
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <button
                        className={styles.loginButton}
                        onClick={handleLogin}
                    >
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
};

export default ClientHeader;
