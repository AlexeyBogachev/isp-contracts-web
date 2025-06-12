import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/AuthContext';
import axios from 'axios';
import styles from './Settings.module.css';
import { SettingsForm, validateNaturalPerson, validateLegalEntity } from './SettingsForm';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({});
    const [clientType, setClientType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);

                try {
                    const naturalPersonResponse = await axios.get(
                        `http://localhost:3000/api/natural-persons/${user.id}`,
                        { withCredentials: true }
                    );

                    if (naturalPersonResponse.data) {
                        setFormData(naturalPersonResponse.data);
                        setClientType('natural');
                        setIsNewUser(false);
                        return;
                    }
                } catch (error) {
                    if (error.response?.status !== 404) {
                        throw error;
                    }
                }

                try {
                    const legalEntityResponse = await axios.get(
                        `http://localhost:3000/api/legal-entities/${user.id}`,
                        { withCredentials: true }
                    );

                    if (legalEntityResponse.data) {
                        setFormData(legalEntityResponse.data);
                        setClientType('legal');
                        setIsNewUser(false);
                        return;
                    }
                } catch (error) {
                    if (error.response?.status !== 404) {
                        throw error;
                    }
                }

                setIsNewUser(true);
                setClientType(null);

            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user?.id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }

        try {
            setErrors({});

            const validationErrors = clientType === 'natural'
                ? validateNaturalPerson(formData)
                : validateLegalEntity(formData);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const baseEndpoint = clientType === 'natural'
                ? 'http://localhost:3000/api/natural-persons'
                : 'http://localhost:3000/api/legal-entities';

            const method = isNewUser ? 'post' : 'put';
            const url = isNewUser ? baseEndpoint : `${baseEndpoint}/${user.id}`;

            const response = await axios[method](
                url,
                {
                    ...formData,
                    id_user: user.id
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                navigate('/personal-account');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    form: error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Ошибка при сохранении данных. Пожалуйста, проверьте введенные данные и попробуйте снова.'
                });
            }
        }
    };

    const handleCancel = () => {
        navigate('/personal-account');
    };

    if (loading) {
        return <div className={styles.settingsContainer}>Загрузка...</div>;
    }

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsCard}>
                <div className={styles.settingsHeader}>
                    <h1>Настройки профиля</h1>
                </div>

                {isNewUser ? (
                    <div className={styles.noDataMessage}>
                        <h2>Данных пока нет</h2>
                        <p>Для получения доступа к полному функционалу необходимо оформить заявку</p>
                        <button
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                            onClick={() => navigate('/request-formation')}
                        >
                            Оформить заявку
                        </button>
                    </div>
                ) : (
                    <SettingsForm
                        clientType={clientType}
                        formData={formData}
                        errors={errors}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onInputChange={handleInputChange}
                    />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
