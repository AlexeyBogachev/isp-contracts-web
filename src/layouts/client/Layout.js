import React from 'react';
import { motion } from 'framer-motion';
import ClientHeader from './header/ClientHeader';
import ClientFooter from './footer/ClientFooter';

const Layout = ({ children }) => {
  return (
    <div>
      <ClientHeader />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <ClientFooter />
    </div>
  );
};

export default Layout;