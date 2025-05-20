import { useState, useEffect } from 'react';
import axios from 'axios';

const useCreateApplication = (initialUserId = '', onApplicationCreated) => {
  const [tariffs, setTariffs] = useState([]);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    id_user: initialUserId,
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

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tariffs', { withCredentials: true });
        setTariffs(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке тарифов:', error);
      }
    };

    fetchTariffs();
  }, []);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePersonChange = (e) => {
    setPersonData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEntityChange = (e) => {
    setEntityData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitUserDetails = async () => {
    try {
      const id_user = formData.id_user || JSON.parse(localStorage.getItem("user"))?.id;

      if (!id_user) {
        setMessage('Ошибка: ID пользователя обязателен.');
        return;
      }

      const userData = userType === 'natural_person' ? personData : entityData;
      const endpoint = userType === 'natural_person' ? 'natural-persons' : 'legal-entities';

      await axios.post(`http://localhost:3000/api/${endpoint}`,
        { id_user, ...userData },
        { withCredentials: true }
      );

      setStep(3);
    } catch (error) {
      setMessage('Ошибка при создании пользователя: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    try {
      const id_user = formData.id_user || JSON.parse(localStorage.getItem("user"))?.id;

      if (!id_user) {
        setMessage('Ошибка: ID пользователя обязателен.');
        return;
      }

      const applicationData = {
        ...formData,
        id_user,
        id_status_application: 1,
      };

      await axios.post('http://localhost:3000/api/applications',
        applicationData,
        { withCredentials: true }
      );

      setMessage('Заявка успешно создана!');
      setStep(1);
      setFormData({
        id_user: id_user,
        report_card_number: '',
        id_status_application: '',
        id_tariff: '',
      });

      if (onApplicationCreated) {
        onApplicationCreated();
      }
      
    } catch (error) {
      setMessage('Ошибка при создании заявки: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTextInputChange = (e, callback) => {
    const { name, value } = e.target;
    const onlyLetters = value.replace(/[^А-Яа-яЁё\s]/g, '');
    callback({ target: { name, value: onlyLetters } });
  };

  return {
    tariffs,
    step,
    userType,
    formData,
    personData,
    entityData,
    message,
    setFormData,
    handleUserTypeSelection,
    handleChange,
    handlePersonChange,
    handleEntityChange,
    handleSubmitUserDetails,
    handleSubmitApplication,
    handleTextInputChange,
    setStep,
  };
};

export default useCreateApplication;