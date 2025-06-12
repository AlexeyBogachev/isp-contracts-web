import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';

const useCreateApplication = (initialUserId = '', onApplicationCreated) => {
  const [tariffs, setTariffs] = useState([]);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sameAddress, setSameAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id_user: initialUserId || '',
    report_card_number: '',
    id_status_application: '',
    id_tariff: '',
    connection_address: '',
    connection_entrance: '',
    connection_floor: '',
    connection_apartment: '',
    base_connection_address: '',
    cost_application: 4500.00,
  });

  const [personData, setPersonData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    date_of_birth: '',
    gender: '',
    residential_address: '',
    residential_entrance: '',
    residential_floor: '',
    residential_apartment: '',
    passport_number: '',
    passport_series: '',
  });

  const [entityData, setEntityData] = useState({
    name: '',
    tin: '',
    registration_number: '',
    director_surname: '',
    director_name: '',
    director_patronymic: '',
    director_full_name: '',
    contact_person_surname: '',
    contact_person_name: '',
    contact_person_patronymic: '',
    contact_person: '',
    contact_phone: '',
    legal_address: '',
    website: '',
  });

  const PATTERNS = {
    name: /^[А-Яа-яЁё-]{2,50}$/,
    phone: /^\+7\d{10}$/,
    passport_series: /^\d{4}$/,
    passport_number: /^\d{6}$/,
    tin: /^\d{10}|\d{12}$/,
    registration_number: /^\d{13}$/,
    company_name: /^[A-Za-zА-Яа-яЁё0-9\s\-_.,&()'"№]+$/,
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatFullAddress = (baseAddress, apartment, entrance, floor) => {
    if (!baseAddress) return '';

    const details = [];
    details.push(baseAddress);

    if (entrance) details.push(`подъезд ${entrance}`);
    if (floor) details.push(`этаж ${floor}`);
    if (apartment) details.push(`кв. ${apartment}`);

    return details.join(', ');
  };

  const formatAddress = (baseAddress, entrance, floor, apartment) => {
    if (!baseAddress) return '';

    const details = [];
    if (entrance) details.push(`подъезд ${entrance}`);
    if (floor) details.push(`этаж ${floor}`);
    if (apartment) details.push(`кв. ${apartment}`);

    return details.length > 0 ? `${baseAddress}, ${details.join(', ')}` : baseAddress;
  };

  const parseAddressDetails = (address) => {
    if (!address) return { baseAddress: '', entrance: '', floor: '', apartment: '' };

    const parts = address.split(',').map(part => part.trim());
    const baseAddress = parts[0];
    const details = parts.slice(1);

    let entrance = '';
    let floor = '';
    let apartment = '';

    details.forEach(detail => {
      const cleanDetail = detail.trim().toLowerCase();
      if (cleanDetail.startsWith('подъезд')) {
        entrance = cleanDetail.replace('подъезд', '').trim();
      } else if (cleanDetail.startsWith('этаж')) {
        floor = cleanDetail.replace('этаж', '').trim();
      } else if (cleanDetail.startsWith('кв.')) {
        apartment = cleanDetail.replace('кв.', '').trim();
      }
    });

    return { baseAddress, entrance, floor, apartment };
  };

  const updateResidentialAddress = (baseAddress, entrance, floor, apartment) => {
    if (!sameAddress) return;

    setPersonData(prev => ({
      ...prev,
      residential_address: formatAddress(baseAddress, entrance, floor, apartment),
      residential_entrance: entrance || '',
      residential_floor: floor || '',
      residential_apartment: apartment || ''
    }));
  };

  const checkActiveApplications = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/applications/user/${userId}/active`,
        { withCredentials: true }
      );

      const activeApplications = response.data;

      if (activeApplications && activeApplications.length > 0) {
        const statusText = activeApplications[0].status_name === 'В обработке' ? 'находится в обработке' : 'одобрена';
        setMessage({
          text: `У пользователя уже есть активная заявка (${statusText}). Создание новой заявки невозможно.`,
          type: 'error'
        });
        return true;
      }

      setMessage({ text: '', type: '' });
      return false;
    } catch (error) {
      console.error('Ошибка при проверке активных заявок:', error);
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'id_user') {
      if (!value) {
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }

      if (!/^\d+$/.test(value)) {
        return;
      }

      const hasActiveApplication = await checkActiveApplications(value);

      if (hasActiveApplication) {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
    }

    if (name === 'connection_address') {
      setFormData(prev => {
        const { baseAddress, entrance, floor, apartment } = parseAddressDetails(value);

        const newData = {
          ...prev,
          connection_address: value,
          base_connection_address: baseAddress,
          connection_entrance: entrance,
          connection_floor: floor,
          connection_apartment: apartment
        };

        if (!value) {
          newData.base_connection_address = '';
          newData.connection_entrance = '';
          newData.connection_floor = '';
          newData.connection_apartment = '';
        }

        if (sameAddress) {
          setPersonData(prev => ({
            ...prev,
            residential_address: value,
            residential_entrance: entrance,
            residential_floor: floor,
            residential_apartment: apartment
          }));
        }

        return newData;
      });
    } else if (['connection_entrance', 'connection_floor', 'connection_apartment'].includes(name)) {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };

        if (prev.base_connection_address) {
          newData.connection_address = formatAddress(
            prev.base_connection_address,
            name === 'connection_entrance' ? value : prev.connection_entrance,
            name === 'connection_floor' ? value : prev.connection_floor,
            name === 'connection_apartment' ? value : prev.connection_apartment
          );
        }

        updateResidentialAddress(
          newData.base_connection_address,
          name === 'connection_entrance' ? value : prev.connection_entrance,
          name === 'connection_floor' ? value : prev.connection_floor,
          name === 'connection_apartment' ? value : prev.connection_apartment
        );

        return newData;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (['surname', 'name', 'patronymic'].includes(name)) {
      formattedValue = capitalizeFirstLetter(value);
    }

    if (name === 'date_of_birth') {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (birthDate > today) {
        setErrors(prev => ({
          ...prev,
          date_of_birth: 'Дата рождения не может быть в будущем'
        }));
        return;
      }

      if (adjustedAge < 18) {
        setErrors(prev => ({
          ...prev,
          date_of_birth: 'Возраст должен быть не менее 18 лет'
        }));
        return;
      }

      if (adjustedAge > 120) {
        setErrors(prev => ({
          ...prev,
          date_of_birth: 'Указан некорректный возраст'
        }));
        return;
      }

      setErrors(prev => ({ ...prev, date_of_birth: '' }));
    }

    if (sameAddress && ['residential_address', 'residential_entrance', 'residential_floor', 'residential_apartment'].includes(name)) {
      return;
    }

    setPersonData(prev => {
      const newData = { ...prev, [name]: formattedValue };

      if (name === 'residential_address') {
        const { entrance, floor, apartment } = parseAddressDetails(value);

        newData.residential_address = value;
        newData.residential_entrance = entrance;
        newData.residential_floor = floor;
        newData.residential_apartment = apartment;

        if (!value) {
          newData.residential_entrance = '';
          newData.residential_floor = '';
          newData.residential_apartment = '';
        }
      } else if (['residential_entrance', 'residential_floor', 'residential_apartment'].includes(name)) {
        const baseAddress = prev.residential_address.split(',')[0];
        if (baseAddress) {
          newData.residential_address = formatAddress(
            baseAddress,
            name === 'residential_entrance' ? value : prev.residential_entrance,
            name === 'residential_floor' ? value : prev.residential_floor,
            name === 'residential_apartment' ? value : prev.residential_apartment
          );
        }
      }

      return newData;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEntityChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (['director_surname', 'director_name', 'director_patronymic',
      'contact_person_surname', 'contact_person_name', 'contact_person_patronymic'].includes(name)) {
      formattedValue = value.replace(/[^А-Яа-яЁё-]/g, '');
      formattedValue = capitalizeFirstLetter(formattedValue);

      setEntityData(prev => {
        const newData = { ...prev, [name]: formattedValue };

        if (['director_surname', 'director_name', 'director_patronymic'].includes(name)) {
          const fullName = [
            name === 'director_surname' ? formattedValue : newData.director_surname,
            name === 'director_name' ? formattedValue : newData.director_name,
            name === 'director_patronymic' ? formattedValue : newData.director_patronymic
          ].filter(Boolean).join(' ');
          newData.director_full_name = fullName;
        }

        if (['contact_person_surname', 'contact_person_name', 'contact_person_patronymic'].includes(name)) {
          const fullName = [
            name === 'contact_person_surname' ? formattedValue : newData.contact_person_surname,
            name === 'contact_person_name' ? formattedValue : newData.contact_person_name,
            name === 'contact_person_patronymic' ? formattedValue : newData.contact_person_patronymic
          ].filter(Boolean).join(' ');
          newData.contact_person = fullName;
        }

        return newData;
      });
    } else if (name === 'contact_phone') {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 12) {
        formattedValue = formatted;
      } else {
        return;
      }
      setEntityData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setEntityData(prev => ({ ...prev, [name]: formattedValue }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitUserDetails = async () => {
    try {
      const isValid = userType === 'natural_person' ? validatePersonData() : validateEntityData();

      if (!isValid) {
        setMessage({ text: 'Пожалуйста, исправьте ошибки в форме', type: 'error' });
        return;
      }

      const userId = parseInt(formData.id_user);
      if (!userId || isNaN(userId)) {
        setMessage({ text: 'Ошибка: ID пользователя должен быть числом.', type: 'error' });
        return;
      }

      const userData = userType === 'natural_person' ? personData : entityData;
      const endpoint = userType === 'natural_person' ? 'natural-persons' : 'legal-entities';

      await axios.post(`http://localhost:3000/api/${endpoint}`,
        { id_user: userId, ...userData },
        { withCredentials: true }
      );

      setStep(3);
      setMessage({ text: '', type: '' });
      setErrors({});
    } catch (error) {
      setMessage({
        text: 'Ошибка при создании пользователя: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    try {
      if (!userType) {
        setMessage({ text: 'Пожалуйста, выберите тип пользователя', type: 'error' });
        return;
      }

      if (!formData.id_tariff) {
        setMessage({ text: 'Пожалуйста, выберите тариф', type: 'error' });
        return;
      }

      if (!formData.connection_address?.trim()) {
        setMessage({ text: 'Пожалуйста, укажите адрес подключения', type: 'error' });
        return;
      }

      let validationErrors = {};
      if (userType === 'natural_person') {
        if (!personData.surname?.trim() || !personData.name?.trim()) {
          setMessage({ text: 'Необходимо указать фамилию и имя', type: 'error' });
          return;
        }

        if (!personData.date_of_birth) {
          setMessage({ text: 'Необходимо указать дату рождения', type: 'error' });
          return;
        }

        if (!personData.gender) {
          setMessage({ text: 'Необходимо указать пол', type: 'error' });
          return;
        }

        if (!personData.passport_series?.trim() || !personData.passport_number?.trim()) {
          setMessage({ text: 'Необходимо заполнить серию и номер паспорта', type: 'error' });
          return;
        }

        if (!PATTERNS.passport_series.test(personData.passport_series.trim()) ||
          !PATTERNS.passport_number.test(personData.passport_number.trim())) {
          setMessage({ text: 'Неверный формат серии или номера паспорта', type: 'error' });
          return;
        }

        validationErrors = validatePersonData();
      } else if (userType === 'legal_entities') {
        if (!entityData.name?.trim()) {
          setMessage({ text: 'Необходимо указать название компании', type: 'error' });
          return;
        }

        if (!entityData.tin?.trim() || !PATTERNS.tin.test(entityData.tin)) {
          setMessage({ text: 'Необходимо указать корректный ИНН', type: 'error' });
          return;
        }

        if (!entityData.registration_number?.trim() || !PATTERNS.registration_number.test(entityData.registration_number)) {
          setMessage({ text: 'Необходимо указать корректный регистрационный номер', type: 'error' });
          return;
        }

        if (!entityData.director_surname?.trim() || !entityData.director_name?.trim()) {
          setMessage({ text: 'Необходимо указать ФИО директора', type: 'error' });
          return;
        }

        if (!entityData.contact_person_surname?.trim() || !entityData.contact_person_name?.trim()) {
          setMessage({ text: 'Необходимо указать ФИО контактного лица', type: 'error' });
          return;
        }

        if (!entityData.contact_phone?.trim() || !entityData.contact_phone.startsWith('+7')) {
          setMessage({ text: 'Необходимо указать корректный контактный телефон', type: 'error' });
          return;
        }

        if (!entityData.legal_address?.trim()) {
          setMessage({ text: 'Необходимо указать юридический адрес', type: 'error' });
          return;
        }

        validationErrors = validateEntityData();
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setMessage({ text: 'Пожалуйста, заполните все обязательные поля корректно', type: 'error' });
        return;
      }

      if (!formData.id_user) {
        setMessage({ text: 'Ошибка: ID пользователя не определен', type: 'error' });
        return;
      }

      try {
        const userCheckResponse = await axios.get(
          `http://localhost:3000/api/users/${formData.id_user}`,
          { withCredentials: true }
        );

        if (!userCheckResponse.data) {
          setMessage({ text: 'Ошибка: Пользователь не найден', type: 'error' });
          return;
        }
      } catch (error) {
        setMessage({
          text: 'Ошибка при проверке пользователя: ' + (error.response?.data?.message || error.message),
          type: 'error'
        });
        return;
      }

      try {
        const userData = userType === 'natural_person' ? personData : entityData;
        const endpoint = userType === 'natural_person' ? 'natural-persons' : 'legal-entities';

        const legalEntityData = userType === 'legal_entities' ? {
          id_user: parseInt(formData.id_user),
          name: entityData.name,
          tin: entityData.tin,
          registration_number: entityData.registration_number,
          director_surname: entityData.director_surname,
          director_name: entityData.director_name,
          director_patronymic: entityData.director_patronymic || '',
          director_full_name: `${entityData.director_surname} ${entityData.director_name} ${entityData.director_patronymic || ''}`.trim(),
          contact_person_surname: entityData.contact_person_surname,
          contact_person_name: entityData.contact_person_name,
          contact_person_patronymic: entityData.contact_person_patronymic || '',
          contact_person: `${entityData.contact_person_surname} ${entityData.contact_person_name} ${entityData.contact_person_patronymic || ''}`.trim(),
          contact_phone: entityData.contact_phone,
          legal_address: entityData.legal_address,
          website: entityData.website || ''
        } : userData;

        const naturalPersonData = userType === 'natural_person' ? {
          id_user: parseInt(formData.id_user),
          surname: personData.surname,
          name: personData.name,
          patronymic: personData.patronymic || '',
          date_of_birth: personData.date_of_birth,
          gender: personData.gender,
          residential_address: personData.residential_address,
          passport_series: personData.passport_series,
          passport_number: personData.passport_number
        } : userData;

        const dataToSend = userType === 'legal_entities' ? legalEntityData : naturalPersonData;

        await axios.post(
          `http://localhost:3000/api/${endpoint}`,
          dataToSend,
          { withCredentials: true }
        );

      } catch (error) {
        if (error.response?.status === 409) {
        } else {
          throw new Error('Ошибка при создании данных пользователя: ' + (error.response?.data?.message || error.message));
        }
      }

      const applicationData = {
        ...formData,
        id_status_application: 1,
        id_user: parseInt(formData.id_user),
        id_tariff: parseInt(formData.id_tariff),
        cost_application: parseFloat(formData.cost_application),
        connection_address: formData.connection_address || '',
        connection_entrance: formData.connection_entrance || '',
        connection_floor: formData.connection_floor || '',
        connection_apartment: formData.connection_apartment || '',
      };

      if (!applicationData.id_user || !applicationData.id_tariff) {
        setMessage({ text: 'Отсутствуют обязательные данные: ID пользователя или тариф', type: 'error' });
        return;
      }

      await axios.post('http://localhost:3000/api/applications',
        applicationData,
        { withCredentials: true }
      );

      setErrors({});
      setMessage({ text: 'Заявка успешно создана!', type: 'success' });
      resetForm();

      if (onApplicationCreated) {
        onApplicationCreated();
      }

      return;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({
        text: 'Ошибка при создании заявки: ' + errorMessage,
        type: 'error'
      });
    }
  };

  const handleTextInputChange = (e, callback) => {
    const { name, value } = e.target;
    const onlyLetters = value.replace(/[^А-Яа-яЁё-]/g, '');
    callback({ target: { name, value: onlyLetters } });
  };

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);

    if (e.target.checked) {
      setPersonData(prev => ({
        ...prev,
        residential_address: formData.connection_address,
        residential_entrance: formData.connection_entrance || '',
        residential_floor: formData.connection_floor || '',
        residential_apartment: formData.connection_apartment || ''
      }));
    }
  };

  const validatePersonData = () => {
    const newErrors = {};

    if (!formData.id_user) {
      newErrors.id_user = 'ID пользователя обязателен';
    } else if (isNaN(parseInt(formData.id_user))) {
      newErrors.id_user = 'ID пользователя должен быть числом';
    }

    if (!personData.surname?.trim()) {
      newErrors.surname = 'Фамилия обязательна';
    } else if (!PATTERNS.name.test(personData.surname)) {
      newErrors.surname = 'Фамилия должна содержать только русские буквы, дефис и пробелы (2-50 символов)';
    }

    if (!personData.name?.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (!PATTERNS.name.test(personData.name)) {
      newErrors.name = 'Имя должно содержать только русские буквы, дефис и пробелы (2-50 символов)';
    }

    if (!personData.passport_series?.trim()) {
      newErrors.passport_series = 'Серия паспорта обязательна';
    } else if (!PATTERNS.passport_series.test(personData.passport_series.trim())) {
      newErrors.passport_series = 'Серия паспорта должна состоять из 4 цифр';
    }

    if (!personData.passport_number?.trim()) {
      newErrors.passport_number = 'Номер паспорта обязателен';
    } else if (!PATTERNS.passport_number.test(personData.passport_number.trim())) {
      newErrors.passport_number = 'Номер паспорта должен состоять из 6 цифр';
    }

    if (!personData.date_of_birth) {
      newErrors.date_of_birth = 'Дата рождения обязательна';
    } else {
      const birthDate = new Date(personData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 120) {
        newErrors.date_of_birth = 'Возраст должен быть от 18 до 120 лет';
      }
    }

    if (!personData.gender) {
      newErrors.gender = 'Пол обязателен';
    }

    if (!formData.connection_address.trim()) {
      newErrors.connection_address = 'Адрес подключения обязателен';
    } else if (formData.connection_address.length > 300) {
      newErrors.connection_address = 'Адрес подключения не может быть длиннее 300 символов';
    }

    if (!personData.residential_address.trim()) {
      newErrors.residential_address = 'Адрес проживания обязателен';
    } else if (personData.residential_address.length > 300) {
      newErrors.residential_address = 'Адрес проживания не может быть длиннее 300 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEntityData = () => {
    const newErrors = {};
    let isValid = true;

    if (!entityData.name || !entityData.name.trim()) {
      newErrors.name = 'Название компании обязательно';
      isValid = false;
    } else if (entityData.name.length > 200) {
      newErrors.name = 'Название компании не может быть длиннее 200 символов';
      isValid = false;
    } else if (!PATTERNS.company_name.test(entityData.name)) {
      newErrors.name = 'Название компании содержит недопустимые символы';
      isValid = false;
    }

    if (!entityData.tin || !entityData.tin.trim()) {
      newErrors.tin = 'ИНН обязателен';
      isValid = false;
    } else if (entityData.tin.length !== 11) {
      newErrors.tin = 'ИНН должен содержать 11 цифр';
      isValid = false;
    }

    if (!entityData.registration_number || !entityData.registration_number.trim()) {
      newErrors.registration_number = 'Регистрационный номер обязателен';
      isValid = false;
    } else if (entityData.registration_number.length !== 13) {
      newErrors.registration_number = 'Регистрационный номер должен содержать 13 цифр';
      isValid = false;
    }

    if (!formData.connection_address || !formData.connection_address.trim()) {
      newErrors.connection_address = 'Адрес подключения обязателен';
      isValid = false;
    } else if (formData.connection_address.length > 300) {
      newErrors.connection_address = 'Адрес подключения не может быть длиннее 300 символов';
      isValid = false;
    }

    if (!entityData.legal_address || !entityData.legal_address.trim()) {
      newErrors.legal_address = 'Юридический адрес обязателен';
      isValid = false;
    } else if (entityData.legal_address.length > 300) {
      newErrors.legal_address = 'Юридический адрес не может быть длиннее 300 символов';
      isValid = false;
    }

    const directorFullName = `${entityData.director_surname} ${entityData.director_name} ${entityData.director_patronymic || ''}`.trim();
    if (directorFullName.length > 150) {
      newErrors.director_surname = 'ФИО директора не может быть длиннее 150 символов';
      isValid = false;
    }

    const contactPersonFullName = `${entityData.contact_person_surname} ${entityData.contact_person_name} ${entityData.contact_person_patronymic || ''}`.trim();
    if (contactPersonFullName.length > 150) {
      newErrors.contact_person_surname = 'ФИО контактного лица не может быть длиннее 150 символов';
      isValid = false;
    }

    if (!entityData.contact_phone || !entityData.contact_phone.trim()) {
      newErrors.contact_phone = 'Контактный телефон обязателен';
      isValid = false;
    }

    if (entityData.website && entityData.website.length > 300) {
      newErrors.website = 'URL веб-сайта не может быть длиннее 300 символов';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      id_user: '',
      report_card_number: '',
      id_status_application: '',
      id_tariff: '',
      connection_address: '',
      connection_entrance: '',
      connection_floor: '',
      connection_apartment: '',
      base_connection_address: '',
      cost_application: 4500.00,
    });
    setPersonData({
      surname: '',
      name: '',
      patronymic: '',
      date_of_birth: '',
      gender: '',
      residential_address: '',
      residential_entrance: '',
      residential_floor: '',
      residential_apartment: '',
      passport_number: '',
      passport_series: '',
    });
    setEntityData({
      name: '',
      tin: '',
      registration_number: '',
      director_surname: '',
      director_name: '',
      director_patronymic: '',
      director_full_name: '',
      contact_person_surname: '',
      contact_person_name: '',
      contact_person_patronymic: '',
      contact_person: '',
      contact_phone: '',
      legal_address: '',
      website: '',
    });
    setUserType('');
    setStep(1);
  };

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tariffs', { withCredentials: true });
        setTariffs(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке тарифов:', error);
        setMessage({ text: 'Ошибка при загрузке тарифов: ' + error.message, type: 'error' });
      }
    };

    fetchTariffs();
  }, []);

  useEffect(() => {
    if (initialUserId) {
      checkActiveApplications(initialUserId).then(hasActive => {
        if (!hasActive) {
          setFormData(prev => ({
            ...prev,
            id_user: initialUserId
          }));
        }
      });
    }
  }, [initialUserId]);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(2);
    setMessage({ text: '', type: '' });
    setErrors({});

    const currentUserId = formData.id_user;
    setFormData({
      id_user: currentUserId,
      report_card_number: '',
      id_status_application: '',
      id_tariff: '',
      connection_address: '',
      connection_entrance: '',
      connection_floor: '',
      connection_apartment: '',
      base_connection_address: '',
      cost_application: 4500.00,
    });

    setPersonData({
      surname: '',
      name: '',
      patronymic: '',
      date_of_birth: '',
      gender: '',
      residential_address: '',
      residential_entrance: '',
      residential_floor: '',
      residential_apartment: '',
      passport_number: '',
      passport_series: '',
    });

    setEntityData({
      name: '',
      tin: '',
      registration_number: '',
      director_surname: '',
      director_name: '',
      director_patronymic: '',
      director_full_name: '',
      contact_person_surname: '',
      contact_person_name: '',
      contact_person_patronymic: '',
      contact_person: '',
      contact_phone: '',
      legal_address: '',
      website: '',
    });

    setSameAddress(false);
  };

  const handleMapAddressSelect = (address) => {
    setFormData(prev => ({
      ...prev,
      base_connection_address: address,
      connection_address: formatFullAddress(
        address,
        prev.connection_apartment,
        prev.connection_entrance,
        prev.connection_floor
      )
    }));
  };

  return {
    tariffs,
    step,
    userType,
    formData,
    personData,
    entityData,
    message,
    sameAddress,
    errors,
    setFormData,
    setPersonData,
    setEntityData,
    setSameAddress,
    handleUserTypeSelection,
    handleChange,
    handlePersonChange,
    handleEntityChange,
    handleSubmitUserDetails,
    handleSubmitApplication,
    handleTextInputChange,
    handleSameAddressChange,
    setStep,
    handleMapAddressSelect,
    setMessage,
    setErrors
  };
};

export default useCreateApplication;