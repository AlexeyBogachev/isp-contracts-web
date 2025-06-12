import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeForm from './HomeForm';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleConnectClick = () => {
        navigate('/request-formation');
    };

    return <HomeForm onConnectClick={handleConnectClick} />;
};

export default HomePage;
