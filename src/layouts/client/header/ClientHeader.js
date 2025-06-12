import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import ClientHeaderView from "./ClientHeader.jsx";

const ClientHeader = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!user) {
            const currentPath = window.location.pathname;
            if (currentPath === '/personal-account') {
                navigate('/login');
            }
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Вы уверены, что хотите выйти?");
        if (!confirmLogout) return;

        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleTitleClick = () => {
        navigate("/home");
    };

    const handleLogoClick = () => {
        navigate("/home");
    };

    const handleProfileClick = () => {
        if (user) {
            navigate("/personal-account");
        } else {
            navigate("/login");
        }
    };

    return (
        <ClientHeaderView
            isScrolled={isScrolled}
            user={user}
            handleLogoClick={handleLogoClick}
            handleTitleClick={handleTitleClick}
            handleProfileClick={handleProfileClick}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
        />
    );
};

export default ClientHeader;
