import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [intentionalLogout, setIntentionalLogout] = useState(false);
    const [userChoicePending, setUserChoicePending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401 && !userChoicePending) {
                    localStorage.removeItem("user");
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [userChoicePending]);

    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
            if (response.data) {
                const userData = { id: response.data.id, role: response.data.role };
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

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
                navigate('/menu');
                return userData;
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Ошибка входа");
        }
    };

    const logout = async () => {
        try {
            setIntentionalLogout(true);
            await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
        } finally {
            localStorage.removeItem("user");
            setUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        const publicPages = ['/login', '/registration', '/home'];
        const isPublicPage = publicPages.some(page => location.pathname === page);

        if (!isPublicPage && !user) {
            checkAuth();
        } else {
            setLoading(false);
        }

        if (!isPublicPage) {
            const interval = setInterval(checkAuth, 1000);
            return () => clearInterval(interval);
        }
    }, [location.pathname, user, checkAuth]);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            intentionalLogout,
            setUserChoicePending,
            userChoicePending
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 