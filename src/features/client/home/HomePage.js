import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeForm from './HomeForm';

const HomePage = () => {
    const navigate = useNavigate();

    const handleConnectClick = () => {
        navigate('/request-formation');
    };

    return <HomeForm onConnectClick={handleConnectClick} />;
};

export default HomePage;
