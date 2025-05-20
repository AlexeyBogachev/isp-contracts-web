import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
      if (response.data) {
        setUser({ id: response.data.id, role: response.data.role });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login",
        { phone_number: phoneNumber, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
        const userData = { id: decodedToken.id, role: decodedToken.role };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return userData;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ошибка входа");
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    const publicPages = ['/login', '/registration'];
    const isPublicPage = publicPages.some(page => location.pathname === page);

    if (!isPublicPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);