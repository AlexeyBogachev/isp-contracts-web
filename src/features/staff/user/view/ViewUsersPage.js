import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewUsersForm from './ViewUsersForm.jsx';

const ViewUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersResponse, naturalPersonsResponse, legalEntitiesResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/users', { withCredentials: true }),
          axios.get('http://localhost:3000/api/natural-persons', { withCredentials: true }),
          axios.get('http://localhost:3000/api/legal-entities', { withCredentials: true })
        ]);

        const enrichedUsers = usersResponse.data.map(user => {
          const naturalPerson = naturalPersonsResponse.data.find(np => np.id_user === user.id_user);
          const legalEntity = legalEntitiesResponse.data.find(le => le.id_user === user.id_user);

          let userType = 'undefined';
          let userDetails = null;

          if (naturalPerson) {
            userType = 'physical';
            userDetails = naturalPerson;
          } else if (legalEntity) {
            userType = 'legal';
            userDetails = legalEntity;
          }

          return {
            ...user,
            userType,
            userDetails
          };
        });

        setUsers(enrichedUsers);
      } catch (err) {
        setError('Ошибка при загрузке пользователей: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ViewUsersForm
      users={users}
      loading={loading}
      error={error}
    />
  );
};

export default ViewUsersPage;