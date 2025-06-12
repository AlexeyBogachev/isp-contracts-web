import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PersonalAccount.module.css';
import { downloadNaturalPersonsAsDocx } from '../../../staff/contracts/natural-persons/services/docxDocumentService';
import { downloadLegalEntitiesAsDocx } from '../../../staff/contracts/legal-entities/services/docxDocumentService';

const PersonalAccountForm = ({ userDetails, clientDetails, clientType, applicationStatus, contractDetails }) => {
    const navigate = useNavigate();
    const [showApplication, setShowApplication] = useState(false);
    const [showContract, setShowContract] = useState(false);

    const handleNavigateToSettings = () => {
        navigate('/settings');
    };

    const handleNavigateToRequest = () => {
        navigate('/request-formation');
    };

    const handleShowApplication = () => {
        setShowApplication(!showApplication);
        if (!showApplication) setShowContract(false);
    };

    const handleShowContract = () => {
        setShowContract(!showContract);
        if (!showContract) setShowApplication(false);
    };

    const handleDownloadContract = async () => {
        if (!contractDetails) return;

        try {
            const contractForDownload = {
                id_contract: contractDetails.id,
                employee: {
                    surname: contractDetails.employeeName.split(' ')[0],
                    name: contractDetails.employeeName.split(' ')[1],
                    patronymic: contractDetails.employeeName.split(' ')[2]
                },
                application: {
                    id_application: contractDetails.applicationId,
                    connection_address: contractDetails.connectionAddress,
                    cost_application: contractDetails.costApplication,
                    tariff: {
                        tariff_name: contractDetails.tariff,
                        speed_mbps: contractDetails.speed
                    },
                    user: {
                        email: userDetails?.email || '',
                        phone_number: userDetails?.phone_number || '',

                        surname: contractDetails.userData?.surname || clientDetails?.surname || '',
                        name: contractDetails.userData?.name || clientDetails?.name || '',
                        patronymic: contractDetails.userData?.patronymic || clientDetails?.patronymic || '',
                        date_of_birth: contractDetails.userData?.date_of_birth || clientDetails?.date_of_birth || '',
                        gender: contractDetails.userData?.gender || clientDetails?.gender || '',
                        residential_address: contractDetails.userData?.residential_address || clientDetails?.residential_address || '',
                        passport_series: contractDetails.userData?.passport_series || clientDetails?.passport_series || '',
                        passport_number: contractDetails.userData?.passport_number || clientDetails?.passport_number || '',

                        company_name: contractDetails.userData?.company_name || clientDetails?.name || '',
                        tin: contractDetails.userData?.tin || clientDetails?.tin || '',
                        registration_number: contractDetails.userData?.registration_number || clientDetails?.registration_number || '',
                        director_full_name: contractDetails.userData?.director_full_name || clientDetails?.director_full_name || '',
                        contact_person: contractDetails.userData?.contact_person || clientDetails?.contact_person || '',
                        contact_phone: contractDetails.userData?.contact_phone || clientDetails?.contact_phone || '',
                        legal_address: contractDetails.userData?.legal_address || clientDetails?.legal_address || '',
                        website: contractDetails.userData?.website || clientDetails?.website || ''
                    }
                },
                face_account: contractDetails.faceAccount,
                total_cost: contractDetails.totalCost,
                date_of_conclusion: new Date(contractDetails.dateOfConclusion),
                contract_terms: contractDetails.contractTerms,
                status_contract: {
                    status_contract_name: contractDetails.status
                }
            };

            try {
                if (clientType === 'natural') {
                    downloadNaturalPersonsAsDocx([contractForDownload]);
                } else if (clientType === 'legal') {
                    downloadLegalEntitiesAsDocx([contractForDownload]);
                }
            } catch (error) {
                console.error('Ошибка при формировании документа:', error);
                alert('Произошла ошибка при формировании документа');
            }
        } catch (error) {
            console.error('Ошибка при подготовке данных договора:', error);
            alert('Произошла ошибка при подготовке данных договора');
        }
    };

    const renderClientDetails = () => {
        if (!clientDetails) return null;

        if (clientType === 'natural') {
            return (
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Фамилия:</span>
                        <span className={styles.value}>{clientDetails.surname}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Имя:</span>
                        <span className={styles.value}>{clientDetails.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Отчество:</span>
                        <span className={styles.value}>{clientDetails.patronymic}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Пол:</span>
                        <span className={styles.value}>{clientDetails.gender}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Дата рождения:</span>
                        <span className={styles.value}>{clientDetails.date_of_birth}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Адрес проживания:</span>
                        <span className={styles.value}>{clientDetails.residential_address}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Серия паспорта:</span>
                        <span className={styles.value}>{clientDetails.passport_series}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Номер паспорта:</span>
                        <span className={styles.value}>{clientDetails.passport_number}</span>
                    </div>
                </div>
            );
        }

        if (clientType === 'legal') {
            return (
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Название:</span>
                        <span className={styles.value}>{clientDetails.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>ИНН:</span>
                        <span className={styles.value}>{clientDetails.tin}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Рег. номер:</span>
                        <span className={styles.value}>{clientDetails.registration_number}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Директор:</span>
                        <span className={styles.value}>{clientDetails.director_full_name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Юр. адрес:</span>
                        <span className={styles.value}>{clientDetails.legal_address}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Контактное лицо:</span>
                        <span className={styles.value}>{clientDetails.contact_person}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Контактный телефон:</span>
                        <span className={styles.value}>{clientDetails.contact_phone}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Веб-сайт:</span>
                        <span className={styles.value}>{clientDetails.website || 'Не указан'}</span>
                    </div>
                </div>
            );
        }
    };

    const renderApplicationStatus = () => {
        if (!applicationStatus) {
            return (
                <div className={styles.noDataMessage}>
                    <h2>У вас нет активных заявок</h2>
                    <p>Вы можете создать новую заявку на подключение</p>
                    <button
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                        onClick={handleNavigateToRequest}
                    >
                        Создать заявку
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Номер заявки:</span>
                    <span className={styles.value}>№{applicationStatus.id}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Статус:</span>
                    <span className={`${styles.value} ${styles.statusValue}`}>
                        {applicationStatus.status}
                    </span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Дата создания:</span>
                    <span className={styles.value}>{applicationStatus.date}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Адрес подключения:</span>
                    <span className={styles.value}>{applicationStatus.address}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Тариф:</span>
                    <span className={styles.value}>{applicationStatus.tariff}</span>
                </div>
            </div>
        );
    };

    const renderContractDetails = () => {
        if (!contractDetails) {
            return (
                <div className={styles.noDataMessage}>
                    <h2>У вас нет активного договора</h2>
                    <p>После одобрения заявки с вами свяжется наш сотрудник для заключения договора</p>
                </div>
            );
        }

        return (
            <>
                <div className={styles.contractHeader}>
                    <h2>Мой договор</h2>
                    <button
                        className={`${styles.actionButton} ${styles.downloadButton}`}
                        onClick={handleDownloadContract}
                    >
                        Скачать договор
                    </button>
                </div>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Номер договора:</span>
                        <span className={styles.value}>№{contractDetails.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Номер заявки:</span>
                        <span className={styles.value}>№{contractDetails.applicationId}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Статус:</span>
                        <span className={`${styles.value} ${styles.statusValue}`}>
                            {contractDetails.status}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Лицевой счёт:</span>
                        <span className={styles.value}>{contractDetails.faceAccount}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Тариф:</span>
                        <span className={styles.value}>{contractDetails.tariff}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Скорость:</span>
                        <span className={styles.value}>{contractDetails.speed} Мбит/с</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Адрес подключения:</span>
                        <span className={styles.value}>{contractDetails.connectionAddress}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Стоимость заявки:</span>
                        <span className={styles.value}>{contractDetails.costApplication} ₽</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Сумма договора:</span>
                        <span className={styles.value}>{contractDetails.totalCost} ₽</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Дата заключения:</span>
                        <span className={styles.value}>{contractDetails.dateOfConclusion}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Дата расторжения:</span>
                        <span className={styles.value}>{contractDetails.dateOfTermination}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Условия договора:</span>
                        <span className={styles.value}>{contractDetails.contractTerms}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Сотрудник:</span>
                        <span className={styles.value}>{contractDetails.employeeName}</span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                            {clientDetails
                                ? (clientType === 'natural' ? clientDetails.name[0] : 'Ю')
                                : (userDetails?.email?.[0]?.toUpperCase() || 'П')}
                        </div>
                    </div>
                    <h1>Личный кабинет</h1>
                </div>

                <div className={styles.profileInfo}>
                    <div className={styles.infoSection}>
                        <h2>Основная информация</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>
                                    {userDetails?.email || 'Отсутствует'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Телефон:</span>
                                <span className={styles.value}>
                                    {userDetails?.phone_number || 'Отсутствует'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!clientDetails ? (
                        <div className={styles.infoSection}>
                            <div className={styles.noDataMessage}>
                                <h2>Данных пока нет</h2>
                                <p>Для получения доступа к полному функционалу необходимо оформить заявку</p>
                                <button
                                    className={`${styles.actionButton} ${styles.primaryButton}`}
                                    onClick={handleNavigateToRequest}
                                >
                                    Оформить заявку
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.infoSection}>
                                <h2>{clientType === 'natural' ? 'Данные физического лица' : 'Данные юридического лица'}</h2>
                                {renderClientDetails()}
                            </div>
                            {showApplication && (
                                <div className={styles.infoSection}>
                                    <h2>Моя заявка</h2>
                                    {renderApplicationStatus()}
                                </div>
                            )}
                            {showContract && (
                                <div className={styles.infoSection}>
                                    {renderContractDetails()}
                                </div>
                            )}
                        </>
                    )}

                    <div className={styles.actionsSection}>
                        <h2>Действия</h2>
                        <div className={styles.actionsGrid}>
                            <button
                                className={`${styles.actionButton} ${showApplication ? styles.activeButton : ''}`}
                                onClick={handleShowApplication}
                            >
                                Моя заявка
                            </button>
                            <button
                                className={`${styles.actionButton} ${showContract ? styles.activeButton : ''}`}
                                onClick={handleShowContract}
                            >
                                Мой договор
                            </button>
                            <button className={styles.actionButton} onClick={handleNavigateToSettings}>
                                Настройки профиля
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalAccountForm;
