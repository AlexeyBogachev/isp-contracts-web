import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileButton.module.css';

const ProfileButton = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-50, 50], [10, -10]);
    const rotateY = useTransform(x, [-50, 50], [-10, 10]);

    const springConfig = { damping: 15, stiffness: 150 };
    const scaleSpring = useSpring(1, springConfig);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        scaleSpring.set(1.05);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
        scaleSpring.set(1);
    };

    const buttonVariants = {
        initial: {
            scale: 1,
            boxShadow: "0 4px 15px rgba(0, 131, 143, 0.3)"
        },
        hover: {
            boxShadow: "0 8px 25px rgba(0, 131, 143, 0.4)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.95,
            boxShadow: "0 2px 10px rgba(0, 131, 143, 0.3)",
            transition: {
                duration: 0.1,
                ease: "easeInOut"
            }
        }
    };

    const iconVariants = {
        initial: {
            rotate: 0,
            scale: 1
        },
        hover: {
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
            transition: {
                duration: 0.6,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 1
            }
        }
    };

    const glowVariants = {
        initial: {
            opacity: 0,
            scale: 1
        },
        hover: {
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1],
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity
            }
        }
    };

    const handleProfileClick = () => {
        scaleSpring.set(0.95);
        setTimeout(() => {
            navigate('/profile');
        }, 200);
    };

    return (
        <motion.div
            className={styles.buttonContainer}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px"
            }}
        >
            <motion.button
                className={styles.profileButton}
                onClick={handleProfileClick}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                style={{
                    scale: scaleSpring,
                    rotateX: rotateX,
                    rotateY: rotateY,
                }}
            >
                {isHovered && (
                    <motion.div
                        className={styles.glow}
                        variants={glowVariants}
                        initial="initial"
                        animate="hover"
                    />
                )}
                <motion.div
                    className={styles.iconWrapper}
                    variants={iconVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                    >
                        <path
                            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                            fill="currentColor"
                        />
                    </svg>
                </motion.div>
                <motion.span
                    className={styles.buttonText}
                    animate={{
                        textShadow: isHovered
                            ? "0 0 8px rgba(255,255,255,0.5)"
                            : "0 0 0px rgba(255,255,255,0)"
                    }}
                >
                    Личный кабинет
                </motion.span>
            </motion.button>
        </motion.div>
    );
};

export default ProfileButton; 