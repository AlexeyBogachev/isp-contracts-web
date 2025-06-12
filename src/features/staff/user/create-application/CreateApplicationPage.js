import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateApplicationForm from './CreateApplicationForm';
import styles from './CreateApplication.module.css';
import useApplicationForm from '../../../../shared/hooks/useCreateApplication';

const CreateApplicationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || '';
  const applicationForm = useApplicationForm(userId);

  useEffect(() => {
    if (userId && userId !== applicationForm.formData.id_user) {
      applicationForm.setFormData(prev => ({
        ...prev,
        id_user: userId
      }));
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (applicationForm.message?.type === 'success') {
      navigate('.', { replace: true, state: {} });
    }
  }, [applicationForm.message, navigate]);

  return (
    <div className={styles.createApplicationPage}>
      <CreateApplicationForm {...applicationForm} />
    </div>
  );
};

export default CreateApplicationPage;