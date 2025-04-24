import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../shared/context/AuthContext';
import UserHomeForm from './UserHomeForm';
import styles from './UserHome.module.css'; 

const UserHomePage = () => {
  const { user } = useAuth();
  const [tariffs, setTariffs] = useState([]);
  const [step, setStep] = useState(1);
  const [hasActiveApplication, setHasActiveApplication] = useState(false);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    id_user: user?.id || '',
    report_card_number: '',
    id_status_application: '',
    id_tariff: '',
  });

  const [personData, setPersonData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    date_of_birth: '',
    gender: '',
    registration_address: '',
    residential_address: '',
    passport_number: '',
    passport_series: '',
  });

  const [entityData, setEntityData] = useState({
    name: '',
    tin: '',
    registration_number: '',
    director_full_name: '',
    contact_person: '',
    contact_phone: '',
    actual_address: '',
    legal_address: '',
    website: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tariffs', { withCredentials: true });
        setTariffs(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке тарифов:', error);
      }
    };

    const checkUserApplicationStatus = async (userId) => {
      try {
        const res = await axios.get(`http://localhost:3000/api/applications/active/${userId}`, { withCredentials: true });
        setHasActiveApplication(res.data.hasActive);
      } catch (error) {
        console.error('Ошибка при проверке статуса заявки:', error);
      }
    };
    
    if (user) {
      setFormData((prevData) => ({ ...prevData, id_user: user.id }));
      checkUserApplicationStatus(user.id);
    }

    fetchTariffs();
    if (user) {
      setFormData((prevData) => ({ ...prevData, id_user: user.id }));
    }
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (storedUser) {
      setFormData((prevData) => ({ ...prevData, id_user: storedUser.id }));
    } else if (user) {
      setFormData((prevData) => ({ ...prevData, id_user: user.id }));
    }
  }, [user]);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePersonChange = (e) => {
    setPersonData({ ...personData, [e.target.name]: e.target.value });
  };

  const handleEntityChange = (e) => {
    setEntityData({ ...entityData, [e.target.name]: e.target.value });
  };

  const handleSubmitUserDetails = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id || user?.id;
  
      if (!userId) {
        setMessage('Ошибка: Не найден ID пользователя.');
        return;
      }
  
      const userData = userType === 'natural_person' ? personData : entityData;
      const endpoint = userType === 'natural_person' ? 'natural-persons' : 'legal-entities';
  
      await axios.post(`http://localhost:3000/api/${endpoint}`, 
        { id_user: userId, ...userData }, 
        { withCredentials: true }
      );
  
      setStep(3);
    } catch (error) {
      setMessage('Ошибка при создании пользователя: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id || user?.id;
  
    if (!userId) {
      setMessage('Ошибка: Не найден ID пользователя.');
      return;
    }
  
    try {
      const applicationData = {
        ...formData,
        id_user: userId,
        id_status_application: 1,
      };
  
      await axios.post(
        'http://localhost:3000/api/applications',
        applicationData,
        { withCredentials: true }
      );
  
      setMessage('Заявка успешно создана!');
      setStep(1);
    } catch (error) {
      setMessage('Ошибка при создании заявки: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTextInputChange = (e, callback) => {
    const { name, value } = e.target;
    const onlyLetters = value.replace(/[^А-Яа-яЁё\s]/g, '');
    callback({ target: { name, value: onlyLetters } });
  };

  return (
    <div className={styles['user-home-page']}>
      <UserHomeForm
        step={step}
        userType={userType}
        tariffs={tariffs}
        formData={formData}
        personData={personData}
        entityData={entityData}
        hasActiveApplication={hasActiveApplication}
        handleTextInputChange={handleTextInputChange}
        handleUserTypeSelection={handleUserTypeSelection}
        handlePersonChange={handlePersonChange}
        handleEntityChange={handleEntityChange}
        handleChange={handleChange}
        handleSubmitUserDetails={handleSubmitUserDetails}
        handleSubmitApplication={handleSubmitApplication}
        message={message}
      />
    </div>
  );
};

export default UserHomePage;