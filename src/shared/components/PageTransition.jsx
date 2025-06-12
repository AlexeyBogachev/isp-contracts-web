import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const isProfileTransition = location.pathname.includes('profile');

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)',
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            y: -20,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 1, 1],
            },
        },
    };

    const profilePageVariants = {
        initial: {
            opacity: 0,
            scale: 0.9,
            rotateX: -15,
            y: 50,
            filter: 'blur(10px)',
        },
        animate: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            rotateX: 15,
            y: -50,
            filter: 'blur(10px)',
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 1, 1],
            },
        },
    };

    const overlayVariants = {
        initial: {
            opacity: 0,
            scale: 0,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 1, 1],
                delay: 0.2,
            },
        },
    };

    const profileOverlayVariants = {
        initial: {
            clipPath: 'circle(0% at 85% 15%)',
            opacity: 0,
        },
        animate: {
            clipPath: 'circle(150% at 85% 15%)',
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                opacity: {
                    duration: 0.4,
                },
            },
        },
        exit: {
            clipPath: 'circle(0% at 85% 15%)',
            opacity: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 1, 1],
                opacity: {
                    duration: 0.3,
                    delay: 0.3,
                },
            },
        },
    };

    const particlesVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: [1, 2, 0],
            opacity: [0.5, 0.8, 0],
            transition: {
                duration: 1,
                times: [0, 0.5, 1],
                ease: "easeOut",
            }
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={isProfileTransition ? profilePageVariants : pageVariants}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}
                <motion.div
                    variants={isProfileTransition ? profileOverlayVariants : overlayVariants}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isProfileTransition
                            ? 'linear-gradient(135deg, rgba(0, 131, 143, 0.95) 0%, rgba(0, 96, 100, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(26, 35, 126, 0.95) 0%, rgba(40, 53, 147, 0.95) 50%, rgba(57, 73, 171, 0.95) 100%)',
                        transformOrigin: isProfileTransition ? 'top right' : 'center',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                    }}
                />
                {isProfileTransition && (
                    <>
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                variants={particlesVariants}
                                initial="initial"
                                animate="animate"
                                style={{
                                    position: 'fixed',
                                    top: `${15 + Math.random() * 10}%`,
                                    right: `${15 + Math.random() * 10}%`,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    zIndex: 10000,
                                    pointerEvents: 'none',
                                    filter: 'blur(2px)',
                                }}
                            />
                        ))}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [1, 1.5, 0],
                                opacity: [0.3, 0.5, 0],
                            }}
                            transition={{
                                duration: 1,
                                times: [0, 0.5, 1],
                                ease: "easeOut",
                            }}
                            style={{
                                position: 'fixed',
                                top: '15%',
                                right: '15%',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, transparent 70%)',
                                zIndex: 10000,
                                pointerEvents: 'none',
                                filter: 'blur(10px)',
                            }}
                        />
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition; 