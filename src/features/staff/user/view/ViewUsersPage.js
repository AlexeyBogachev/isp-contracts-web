// src/pages/ViewUsersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewUsers.module.css';

const ViewUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          withCredentials: true
        });
        setUsers(response.data);
      } catch (err) {
        setError('Ошибка при загрузке пользователей: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className={styles['view-users-page']}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles['view-users-page']}>{error}</div>;
  }

  return (
    <div className={styles['view-users-page']}>
      <h1 className={styles['view-users-title']}>Список клиентов</h1>
      <div className={styles['table-wrapper']}>
        <table className={styles['users-table']}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Пароль</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id_user}>
                <td>{user.id_user}</td>
                <td>{user.phone_number}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsersPage;