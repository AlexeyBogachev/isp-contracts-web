import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import { clientRoutes } from "./routes/clientRoutes";
import { staffRoutes } from "./routes/staffRoutes";
import { AnimatePresence } from "framer-motion";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Клиентские маршруты */}
        {clientRoutes.map((route, index) => (
          <Route key={`client-${index}`} path={route.path} element={route.element} />
        ))}

        {/* Маршруты для сотрудников */}
        {staffRoutes.map((route, index) => (
          <Route key={`staff-${index}`} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AnimatedRoutes />
    </AuthProvider>
  </Router>
);

export default App;