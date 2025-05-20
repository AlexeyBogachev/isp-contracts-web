import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import axios from 'axios';
import UserHomeForm from './RequestFormationForm';
import styles from './RequestFormation.module.css';
import useApplicationForm from '../../../shared/hooks/useCreateApplication';

const RequestFormationPage = () => {
  const { user } = useAuth();
  const [hasActiveApplication, setHasActiveApplication] = useState(false);

  useEffect(() => {
    const checkUserApplicationStatus = async (userId) => {
      try {
        const res = await axios.get(`http://localhost:3000/api/applications/active/${userId}`, { withCredentials: true });
        setHasActiveApplication(res.data.hasActive);
      } catch (error) {
        console.error('Ошибка при проверке статуса заявки:', error);
      }
    };

    if (user?.id) {
      checkUserApplicationStatus(user.id);
    }
  }, [user]);

  const applicationForm = useApplicationForm(user?.id, () => {
    setHasActiveApplication(true);
  });

  return (
    <div className={styles['user-home-page']}>
      <UserHomeForm {...applicationForm} hasActiveApplication={hasActiveApplication} />
    </div>
  );
};

export default RequestFormationPage;