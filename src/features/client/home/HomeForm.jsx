import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const HomeForm = () => {
    const navigate = useNavigate();

    const handleConnectClick = (tariffId) => {
        navigate('/request-formation', { state: { selectedTariffId: tariffId } });
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={styles.homeWrapper}>
            <section className={styles.heroSection}>
                <div className={styles.heroRay}></div>
                <div className={styles.heroRay2}></div>
                <div className={styles.heroRay3}></div>
                <div className={styles.heroRay4}></div>
                <div className={styles.innerContainer}>
                    <div className={styles.heroContent}>
                        <h1>Скоростной интернет для вашего дома и бизнеса</h1>
                        <p className={styles.heroSubtitle}>
                            Надежное подключение со скоростью до 1 Гбит/с
                        </p>
                        <motion.button
                            className={styles.ctaButton}
                            onClick={() => handleConnectClick()}
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Подключить интернет
                        </motion.button>
                    </div>
                </div>
            </section>

            <section className={styles.featuresSection}>
                <div className={styles.innerContainer}>
                    <h2>Почему выбирают нас</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3>Высокая скорость</h3>
                            <p>Стабильное подключение до 1 Гбит/с без ограничений и тормозов</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🛡️</div>
                            <h3>Безопасность</h3>
                            <p>Защита от вирусов и вредоносных программ включена в каждый тариф</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📱</div>
                            <h3>Поддержка 24/7</h3>
                            <p>Наша команда всегда готова помочь вам с любым вопросом</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tariffsSection}>
                <div className={styles.innerContainer}>
                    <h2>Выберите свой тариф</h2>
                    <div className={styles.tariffsGrid}>
                        <div className={styles.tariffCard}>
                            <h3>Базовый</h3>
                            <div className={styles.price}>399 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 100 Мбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Базовая защита</li>
                            </ul>
                            <motion.button
                                className={styles.tariffButton}
                                onClick={() => handleConnectClick(1)}
                                variants={buttonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Подключить
                            </motion.button>
                        </div>
                        <div className={`${styles.tariffCard} ${styles.popular}`}>
                            <div className={styles.popularBadge}>Популярный</div>
                            <h3>Оптимальный</h3>
                            <div className={styles.price}>799 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 300 Мбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Расширенная защита</li>
                                <li>Статический IP</li>
                            </ul>
                            <motion.button
                                className={styles.tariffButton}
                                onClick={() => handleConnectClick(2)}
                                variants={buttonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Подключить
                            </motion.button>
                        </div>
                        <div className={styles.tariffCard}>
                            <h3>Максимальный</h3>
                            <div className={styles.price}>1799 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 1 Гбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Максимальная защита</li>
                                <li>Статический IP</li>
                                <li>Приоритетная поддержка</li>
                            </ul>
                            <motion.button
                                className={styles.tariffButton}
                                onClick={() => handleConnectClick(3)}
                                variants={buttonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Подключить
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.benefitsSection}>
                <div className={styles.innerContainer}>
                    <h2>Преимущества нашего интернета</h2>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitItem}>
                            <h3>Стабильность</h3>
                            <p>Наша сеть построена на современном оборудовании, что обеспечивает стабильное соединение без обрывов и задержек</p>
                        </div>
                        <div className={styles.benefitItem}>
                            <h3>Технологии</h3>
                            <p>Используем передовые технологии передачи данных для обеспечения максимальной скорости и качества связи</p>
                        </div>
                        <div className={styles.benefitItem}>
                            <h3>Поддержка</h3>
                            <p>Профессиональная команда технической поддержки готова помочь вам 24/7</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.innerContainer}>
                    <h2>Готовы подключить быстрый интернет?</h2>
                    <p>Оставьте заявку, и мы свяжемся с вами в ближайшее время</p>
                    <motion.button
                        className={styles.ctaButton}
                        onClick={() => handleConnectClick()}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Оставить заявку
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default HomeForm;
