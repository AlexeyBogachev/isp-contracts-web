import React from 'react';
import styles from './ViewUsers.module.css';

const ViewUsersForm = ({ users, loading, error }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    if (loading) {
        return <div className={styles['view-users-page']}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles['view-users-page']}>{error}</div>;
    }

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();

        const basicSearch =
            user.phone_number?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query);

        const physicalPersonSearch = user.userType === 'physical' && user.userDetails && (
            `${user.userDetails.surname} ${user.userDetails.name} ${user.userDetails.patronymic || ''}`
                .toLowerCase()
                .includes(query)
        );

        const legalEntitySearch = user.userType === 'legal' && user.userDetails && (
            user.userDetails.name?.toLowerCase().includes(query)
        );

        return basicSearch || physicalPersonSearch || legalEntitySearch;
    });

    const renderUserDetails = (user) => {
        if (!user.userDetails) {
            return "Нет данных";
        }

        if (user.userType === 'physical') {
            return (
                <div>
                    <p><strong>ФИО:</strong> {`${user.userDetails.surname} ${user.userDetails.name} ${user.userDetails.patronymic || ''}`}</p>
                    <p><strong>Дата рождения:</strong> {new Date(user.userDetails.date_of_birth).toLocaleDateString()}</p>
                    <p><strong>Адрес:</strong> {user.userDetails.residential_address}</p>
                    <p><strong>Паспорт:</strong> {user.userDetails.passport_series} {user.userDetails.passport_number}</p>
                </div>
            );
        } else if (user.userType === 'legal') {
            return (
                <div>
                    <p><strong>Название:</strong> {user.userDetails.name}</p>
                    <p><strong>ИНН:</strong> {user.userDetails.tin}</p>
                    <p><strong>ОГРН:</strong> {user.userDetails.registration_number}</p>
                    <p><strong>Директор:</strong> {user.userDetails.director_full_name}</p>
                    <p><strong>Юр. адрес:</strong> {user.userDetails.legal_address}</p>
                </div>
            );
        }

        return "Тип пользователя не определен";
    };

    const getUserTypeName = (type) => {
        switch (type) {
            case 'physical':
                return 'Физическое лицо';
            case 'legal':
                return 'Юридическое лицо';
            default:
                return 'Не определен';
        }
    };

    return (
        <div className={styles['view-users-page']}>
            <h1 className={styles['view-users-title']}>Список клиентов</h1>
            <div className={styles['search-container']}>
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles['search-input']}
                />
            </div>
            <div className={styles['table-wrapper']}>
                <table className={styles['users-table']}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Тип пользователя</th>
                            <th>Данные пользователя</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id_user}>
                                <td>{user.id_user}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{getUserTypeName(user.userType)}</td>
                                <td>{renderUserDetails(user)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewUsersForm;
