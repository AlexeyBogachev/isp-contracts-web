import { motion } from 'framer-motion';
import styles from './PageTransition.module.css';

const pageVariants = {
    initial: {
        opacity: 0,
        x: '-100%',
        filter: 'blur(10px)',
        scale: 0.95
    },
    in: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        scale: 1
    },
    out: {
        opacity: 0,
        x: '100%',
        filter: 'blur(10px)',
        scale: 1.05
    }
};

const pageTransition = {
    type: 'spring',
    stiffness: 50,
    mass: 0.8,
    damping: 11,
    duration: 0.6
};

const containerVariants = {
    initial: {
        background: 'linear-gradient(135deg, #1a237e, #283593, #3949ab, #1a237e)',
    },
    in: {
        background: 'linear-gradient(135deg, #1a237e, #283593, #3949ab, #1a237e)',
        transition: {
            duration: 0.8,
            ease: 'easeInOut'
        }
    },
    out: {
        background: 'linear-gradient(135deg, #283593, #3949ab, #1a237e, #283593)',
        transition: {
            duration: 0.8,
            ease: 'easeInOut'
        }
    }
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            className={styles.pageTransition}
            variants={containerVariants}
            initial="initial"
            animate="in"
            exit="out"
        >
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default PageTransition; 