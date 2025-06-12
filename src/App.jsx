import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageTransition from './shared/components/PageTransition';
import HomeForm from './features/client/home/HomeForm';
import RequestFormationForm from './features/client/request-formation/RequestFormationForm';
import ProfileButton from './shared/components/ProfileButton';

const App = () => {
    return (
        <Router>
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <ProfileButton />
            </div>
            <PageTransition>
                <Routes>
                    <Route path="/" element={<HomeForm />} />
                    <Route path="/home" element={<HomeForm />} />
                    <Route path="/request-formation" element={<RequestFormationForm />} />
                    <Route path="/profile" element={<div style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: '#006064'
                    }}>
                        Страница профиля (в разработке)
                    </div>} />
                </Routes>
            </PageTransition>
        </Router>
    );
};

export default App; 