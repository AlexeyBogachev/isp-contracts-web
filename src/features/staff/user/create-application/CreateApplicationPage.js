import React from 'react';
import CreateApplicationForm from './CreateApplicationForm';
import styles from './CreateApplication.module.css';
import useApplicationForm from '../../../../shared/hooks/useCreateApplication';

const CreateApplicationPage = () => {
  const applicationForm = useApplicationForm();

  return (
    <div className={styles['create-application-page']}>
      <CreateApplicationForm {...applicationForm} />
    </div>
  );
};

export default CreateApplicationPage;