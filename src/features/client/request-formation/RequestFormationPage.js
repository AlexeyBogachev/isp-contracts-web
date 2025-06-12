import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RequestFormationForm from './RequestFormationForm';
import styles from './RequestFormation.module.css';
import useApplicationForm from '../../../shared/hooks/useCreateApplication';

const RequestFormationPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [hasActiveApplication, setHasActiveApplication] = useState(false);
  const [userTypeChecked, setUserTypeChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleActiveApplication = useCallback(() => {
    setHasActiveApplication(true);
  }, []);

  const applicationForm = useApplicationForm(user?.id, handleActiveApplication);

  const handleSubmitWithUpdate = async () => {
    try {
      let userData = null;

      if (applicationForm.userType === 'legal_entities') {
        const formattedEntityData = {
          id_user: user.id,
          name: applicationForm.entityData.name,
          tin: applicationForm.entityData.tin,
          registration_number: applicationForm.entityData.registration_number,
          director_full_name: `${applicationForm.entityData.director_surname} ${applicationForm.entityData.director_name} ${applicationForm.entityData.director_patronymic || ''}`.trim(),
          contact_person: `${applicationForm.entityData.contact_person_surname} ${applicationForm.entityData.contact_person_name} ${applicationForm.entityData.contact_person_patronymic || ''}`.trim(),
          contact_phone: applicationForm.entityData.contact_phone,
          legal_address: applicationForm.entityData.legal_address,
          website: applicationForm.entityData.website || ''
        };

        try {
          const updateResponse = await axios.put(
            `http://localhost:3000/api/legal-entities/${user.id}`,
            formattedEntityData,
            {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' }
            }
          );
          userData = updateResponse.data;
        } catch (error) {
          if (error.response?.status === 404) {
            const createResponse = await axios.post(
              'http://localhost:3000/api/legal-entities',
              formattedEntityData,
              {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
              }
            );
            userData = createResponse.data;
          } else {
            throw error;
          }
        }
      } else if (applicationForm.userType === 'natural_person') {
        if (!applicationForm.personData.passport_series?.trim() || !applicationForm.personData.passport_number?.trim()) {
          applicationForm.setMessage({
            text: 'Необходимо заполнить паспортные данные',
            type: 'error'
          });
          return;
        }

        if (!/^\d{4}$/.test(applicationForm.personData.passport_series)) {
          applicationForm.setMessage({
            text: 'Серия паспорта должна содержать 4 цифры',
            type: 'error'
          });
          return;
        }

        if (!/^\d{6}$/.test(applicationForm.personData.passport_number)) {
          applicationForm.setMessage({
            text: 'Номер паспорта должен содержать 6 цифр',
            type: 'error'
          });
          return;
        }

        const formattedPersonData = {
          id_user: user.id,
          surname: applicationForm.personData.surname,
          name: applicationForm.personData.name,
          patronymic: applicationForm.personData.patronymic,
          date_of_birth: applicationForm.personData.date_of_birth,
          gender: applicationForm.personData.gender,
          residential_address: applicationForm.personData.residential_address,
          residential_entrance: applicationForm.personData.residential_entrance,
          residential_floor: applicationForm.personData.residential_floor,
          residential_apartment: applicationForm.personData.residential_apartment,
          passport_series: applicationForm.personData.passport_series,
          passport_number: applicationForm.personData.passport_number
        };

        try {
          let recordExists = false;
          try {
            const checkResponse = await axios.get(
              `http://localhost:3000/api/natural-persons/${user.id}`,
              { withCredentials: true }
            );
            recordExists = !!checkResponse.data;
          } catch (error) {
            recordExists = false;
          }

          if (recordExists) {
            const updateResponse = await axios.put(
              `http://localhost:3000/api/natural-persons/${user.id}`,
              formattedPersonData,
              {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
              }
            );
            userData = updateResponse.data;
          } else {
            const createResponse = await axios.post(
              'http://localhost:3000/api/natural-persons',
              formattedPersonData,
              {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
              }
            );
            userData = createResponse.data;
          }
        } catch (error) {
          throw error;
        }
      }

      const applicationData = {
        id_user: user.id,
        id_tariff: applicationForm.formData.id_tariff,
        connection_address: formatFullAddress(
          applicationForm.formData.base_connection_address,
          applicationForm.formData.connection_apartment,
          applicationForm.formData.connection_entrance,
          applicationForm.formData.connection_floor
        ),
        base_connection_address: applicationForm.formData.base_connection_address,
        cost_application: 4500.00
      };

      if (applicationForm.userType === 'natural_person') {
        applicationData.natural_person_data = userData;
      } else {
        applicationData.legal_entity_data = userData;
      }

      const response = await axios.post('http://localhost:3000/api/applications', applicationData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data) {
        handleActiveApplication();
        applicationForm.setMessage({
          text: 'Заявка успешно отправлена',
          type: 'success'
        });

        applicationForm.setFormData({
          id_user: '',
          id_tariff: '',
          connection_address: '',
          connection_entrance: '',
          connection_floor: '',
          connection_apartment: '',
          base_connection_address: '',
          cost_application: 4500.00
        });

        if (applicationForm.userType === 'natural_person') {
          applicationForm.setPersonData({
            surname: '',
            name: '',
            patronymic: '',
            date_of_birth: '',
            gender: '',
            residential_address: '',
            residential_entrance: '',
            residential_floor: '',
            residential_apartment: '',
            passport_series: '',
            passport_number: ''
          });
        } else {
          applicationForm.setEntityData({
            name: '',
            tin: '',
            registration_number: '',
            director_surname: '',
            director_name: '',
            director_patronymic: '',
            contact_person_surname: '',
            contact_person_name: '',
            contact_person_patronymic: '',
            contact_phone: '',
            legal_address: '',
            website: ''
          });
        }

        setTimeout(() => {
          setHasActiveApplication(true);
          setLoading(false);
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
      applicationForm.setMessage({
        text: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUserType = async (userId) => {
      try {
        const [naturalPersonRes, legalEntityRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/natural-persons/${userId}`, { withCredentials: true }),
          axios.get(`http://localhost:3000/api/legal-entities/${userId}`, { withCredentials: true })
        ]);

        if (naturalPersonRes.data) {
          applicationForm.handleUserTypeSelection('natural_person');
          applicationForm.setPersonData(naturalPersonRes.data);
        } else if (legalEntityRes.data) {
          applicationForm.handleUserTypeSelection('legal_entities');
          applicationForm.setEntityData(legalEntityRes.data);
        }
        setUserTypeChecked(true);
      } catch (error) {
        setUserTypeChecked(true);
      }
    };

    if (user?.id && !userTypeChecked) {
      checkUserType(user.id);
    }
  }, [user?.id, applicationForm, userTypeChecked]);

  useEffect(() => {
    const checkUserApplicationStatus = async (userId) => {
      try {
        const res = await axios.get(`http://localhost:3000/api/applications/user/${userId}/active`, {
          withCredentials: true
        });
        setHasActiveApplication(res.data.length > 0);
      } catch (error) {
        console.error('Ошибка при проверке активных заявок:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      checkUserApplicationStatus(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    const selectedTariffId = location.state?.selectedTariffId;
    if (selectedTariffId && applicationForm.setFormData) {
      applicationForm.setFormData(prev => ({
        ...prev,
        id_tariff: selectedTariffId
      }));
    }
  }, [location.state, applicationForm]);

  const formatFullAddress = useCallback((baseAddress, apartment, entrance, floor) => {
    if (!baseAddress) return '';

    const details = [];
    details.push(baseAddress);

    if (entrance) details.push(`подъезд ${entrance}`);
    if (floor) details.push(`этаж ${floor}`);
    if (apartment) details.push(`кв. ${apartment}`);

    return details.join(', ');
  }, []);

  const handleMapAddressSelect = useCallback((address) => {
    applicationForm.setFormData(prev => ({
      ...prev,
      base_connection_address: address,
      connection_address: formatFullAddress(
        address,
        prev.connection_apartment,
        prev.connection_entrance,
        prev.connection_floor
      )
    }));
  }, [applicationForm, formatFullAddress]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.userHomePage}>
          <div className={styles.container}>
            <h3 className={styles.title}>Загрузка...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (hasActiveApplication) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.ray1}></div>
        <div className={styles.ray2}></div>
        <div className={styles.ray3}></div>
        <div className={styles.ray4}></div>
        <div className={styles.userHomePage}>
          <div className={styles.container}>
            <h3 className={styles.activeApplicationTitle}>У вас уже есть активная заявка</h3>
            <p className={styles.activeApplicationMessage}>
              Вы не можете создать новую заявку, пока текущая находится в обработке.
              Пожалуйста, дождитесь завершения обработки текущей заявки.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ray1}></div>
      <div className={styles.ray2}></div>
      <div className={styles.ray3}></div>
      <div className={styles.ray4}></div>
      <RequestFormationForm
        {...applicationForm}
        hasActiveApplication={hasActiveApplication}
        setMessage={applicationForm.setMessage}
        onApplicationCreated={handleActiveApplication}
        handleMapAddressSelect={handleMapAddressSelect}
        setErrors={applicationForm.setErrors}
        setFormData={applicationForm.setFormData}
        setPersonData={applicationForm.setPersonData}
        setEntityData={applicationForm.setEntityData}
        setSameAddress={applicationForm.setSameAddress}
        userId={user?.id}
        handleSubmitApplication={handleSubmitWithUpdate}
      />
    </div>
  );
};

export default RequestFormationPage;