import React from 'react';
import styles from './Home.module.css';

const HomeForm = ({ onConnectClick }) => {
    return (
        <div className={styles.homeWrapper}>
            {/* Hero Section */}
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
                        <button className={styles.ctaButton} onClick={onConnectClick}>Подключить интернет</button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
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

            {/* Tariffs Section */}
            <section className={styles.tariffsSection}>
                <div className={styles.innerContainer}>
                    <h2>Выберите свой тариф</h2>
                    <div className={styles.tariffsGrid}>
                        <div className={styles.tariffCard}>
                            <h3>Базовый</h3>
                            <div className={styles.price}>от 299 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 100 Мбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Базовая защита</li>
                            </ul>
                            <button className={styles.tariffButton} onClick={onConnectClick}>Подключить</button>
                        </div>
                        <div className={`${styles.tariffCard} ${styles.popular}`}>
                            <div className={styles.popularBadge}>Популярный</div>
                            <h3>Оптимальный</h3>
                            <div className={styles.price}>от 499 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 300 Мбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Расширенная защита</li>
                                <li>Статический IP</li>
                            </ul>
                            <button className={styles.tariffButton} onClick={onConnectClick}>Подключить</button>
                        </div>
                        <div className={styles.tariffCard}>
                            <h3>Максимальный</h3>
                            <div className={styles.price}>от 799 ₽/мес</div>
                            <ul className={styles.tariffFeatures}>
                                <li>Скорость до 1 Гбит/с</li>
                                <li>Безлимитный трафик</li>
                                <li>Максимальная защита</li>
                                <li>Статический IP</li>
                                <li>Приоритетная поддержка</li>
                            </ul>
                            <button className={styles.tariffButton} onClick={onConnectClick}>Подключить</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
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

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.innerContainer}>
                    <h2>Готовы подключить быстрый интернет?</h2>
                    <p>Оставьте заявку, и мы свяжемся с вами в ближайшее время</p>
                    <button className={styles.ctaButton} onClick={onConnectClick}>Оставить заявку</button>
                </div>
            </section>
        </div>
    );
};

export default HomeForm;
