import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import PersonalAccountForm from './PersonalAccountForm';
import { fetchUserDetails } from './services/userService';
import { fetchApplicationStatus } from './services/applicationService';
import { fetchContractDetails } from './services/contractService';

const PersonalAccountPage = () => {
    const { user } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [clientType, setClientType] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [contractDetails, setContractDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const userData = await fetchUserDetails(user.id);
                if (userData) {
                    setUserDetails(userData.userDetails);
                    setClientDetails(userData.clientDetails);
                    setClientType(userData.clientType);
                }

                const applicationData = await fetchApplicationStatus(user.id);
                setApplicationStatus(applicationData);

                const contractData = await fetchContractDetails(user.id);
                setContractDetails(contractData);

            } catch (error) {
                setError('Произошла ошибка при загрузке данных');
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [user?.id]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <PersonalAccountForm
            userDetails={userDetails}
            clientDetails={clientDetails}
            clientType={clientType}
            applicationStatus={applicationStatus}
            contractDetails={contractDetails}
        />
    );
};

export default PersonalAccountPage;