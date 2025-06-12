import React from 'react';
import { Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/client/Layout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import LoginPage from '../features/auth/login/LoginPage';
import RegistrationPage from '../features/auth/register/RegistrationPage';
import HomePage from '../features/client/home/HomePage';
import RequestFormationPage from '../features/client/request-formation/RequestFormationPage';
import PersonalAccountPage from '../features/client/account/personal-account/PersonalAccountPage';
import SettingsPage from '../features/client/account/settings/SettingsPage';

const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    REGISTRATION: '/registration',
    HOME: '/home',
    REQUEST_FORMATION: '/request-formation',
    PERSONAL_ACCOUNT: '/personal-account',
    SETTINGS: '/settings',
};

const ROLES = {
    USER: 'user',
};


const withClientProtection = (component, requiresAuth = true) => {
    const wrappedComponent = <ClientLayout>{component}</ClientLayout>;
    return requiresAuth
        ? <ProtectedRoute allowedRoles={[ROLES.USER]}>{wrappedComponent}</ProtectedRoute>
        : wrappedComponent;
};


export const clientRoutes = [
    { path: '*', element: <Navigate to={ROUTES.LOGIN} /> },
    { path: ROUTES.ROOT, element: <Navigate to={ROUTES.HOME} /> },
    { path: ROUTES.LOGIN, element: <LoginPage /> },
    { path: ROUTES.REGISTRATION, element: <RegistrationPage /> },
    {
        path: ROUTES.HOME,
        element: withClientProtection(<HomePage />, false)
    },
    {
        path: ROUTES.REQUEST_FORMATION,
        element: withClientProtection(<RequestFormationPage />)
    },
    {
        path: ROUTES.PERSONAL_ACCOUNT,
        element: withClientProtection(<PersonalAccountPage />)
    },
    {
        path: ROUTES.SETTINGS,
        element: withClientProtection(<SettingsPage />)
    }
]; 