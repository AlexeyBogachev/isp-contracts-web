import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './ClientFooter.module.css';

const ClientFooter = ({ currentYear }) => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGlow}></div>
            <div className={styles.innerContainer}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerColumn}>
                        <h3 className={styles.footerLogo}>Оптик-Телеком</h3>
                        <p className={styles.slogan}>Ваш надежный проводник в мир высокоскоростного интернета</p>
                        <div className={styles.contactInfo}>
                            <p>
                                <motion.a
                                    href="tel:+74967268900"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    +7 (496) 726-89-00
                                </motion.a>
                            </p>
                            <p>
                                <motion.a
                                    href="mailto:info@optic-telecom.ru"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    info@optic-telecom.ru
                                </motion.a>
                            </p>
                        </div>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>Услуги</h4>
                        <ul>
                            <li>
                                <Link to="/request-formation">Подключение интернета</Link>
                            </li>
                            <li>
                                <Link to="/request-formation">Интернет для бизнеса</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>Личный кабинет</h4>
                        <ul>
                            <li>
                                <Link to="/personal-account">Мой профиль</Link>
                            </li>
                            <li>
                                <Link to="/settings">Настройки</Link>
                            </li>
                            <li>
                                <Link to="/personal-account">Текущий тариф</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>О компании</h4>
                        <ul>
                            <li>
                                <Link to="/home">О нас</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        © {currentYear} Оптик-Телеком. Все права защищены.
                    </div>
                    <div className={styles.footerLinks}>
                        <Link to="/home">Политика конфиденциальности</Link>
                        <Link to="/home">Условия использования</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ClientFooter;
