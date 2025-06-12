import React, { useState, useEffect } from 'react';
import styles from './RequestFormation.module.css';
import AddressMap from '../../../shared/components/AddressMap';
import { FaUser, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RequestFormationForm = ({
  userType,
  tariffs,
  formData,
  personData,
  entityData,
  handleTextInputChange,
  handleUserTypeSelection,
  handlePersonChange,
  handleEntityChange,
  handleChange,
  handleSubmitUserDetails,
  handleSubmitApplication,
  message,
  hasActiveApplication,
  sameAddress,
  handleSameAddressChange,
  errors,
  handleMapAddressSelect,
  setMessage,
  setErrors,
  setFormData,
  setPersonData,
  setEntityData,
  setSameAddress,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  useEffect(() => {
    if (userType && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [userType, currentStep]);

  useEffect(() => {
    if (userId) {
      setFormData(prev => ({
        ...prev,
        id_user: userId
      }));
    }
  }, [userId, setFormData]);

  const renderError = (fieldName) => {
    return errors[fieldName] && (
      <span className={styles.errorText}>{errors[fieldName]}</span>
    );
  };

  const renderInput = (name, placeholder, value, onChange, type = "text", required = true, maxLength) => (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
      {renderError(name)}
    </div>
  );

  const validateNaturalPersonStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 2:
        if (!formData.id_tariff) {
          newErrors.id_tariff = 'Выберите тариф';
        }
        if (!personData.surname?.trim()) {
          newErrors.surname = 'Введите фамилию';
        }
        if (!personData.name?.trim()) {
          newErrors.name = 'Введите имя';
        }
        break;
      case 3:
        if (!personData.date_of_birth) {
          newErrors.date_of_birth = 'Введите дату рождения';
        }
        if (!personData.gender) {
          newErrors.gender = 'Выберите пол';
        }
        break;
      case 4:
        if (!formData.connection_address?.trim()) {
          newErrors.connection_address = 'Выберите адрес подключения';
        }
        break;
      case 5:
        if (!sameAddress && !personData.residential_address?.trim()) {
          newErrors.residential_address = 'Введите адрес проживания';
        }
        break;
      case 6:
        if (!personData.passport_series?.trim()) {
          newErrors.passport_series = 'Введите серию паспорта';
        } else if (personData.passport_series.length !== 4) {
          newErrors.passport_series = 'Серия паспорта должна содержать 4 цифры';
        } else if (!/^\d{4}$/.test(personData.passport_series)) {
          newErrors.passport_series = 'Серия паспорта должна содержать только цифры';
        }

        if (!personData.passport_number?.trim()) {
          newErrors.passport_number = 'Введите номер паспорта';
        } else if (personData.passport_number.length !== 6) {
          newErrors.passport_number = 'Номер паспорта должен содержать 6 цифр';
        } else if (!/^\d{6}$/.test(personData.passport_number)) {
          newErrors.passport_number = 'Номер паспорта должен содержать только цифры';
        }
        break;
      default:
        break;
    }

    return newErrors;
  };

  const validateLegalEntityStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 2:
        if (!formData.id_tariff) {
          newErrors.id_tariff = 'Выберите тариф';
        }
        if (!entityData.name?.trim()) {
          newErrors.name = 'Введите название компании';
        }
        break;
      case 3:
        if (!entityData.tin?.trim()) {
          newErrors.tin = 'Введите ИНН';
        } else if (entityData.tin.length !== 11) {
          newErrors.tin = 'ИНН должен содержать 11 цифр';
        } else if (!/^\d{11}$/.test(entityData.tin)) {
          newErrors.tin = 'ИНН должен содержать только цифры';
        }

        if (!entityData.registration_number?.trim()) {
          newErrors.registration_number = 'Введите регистрационный номер';
        } else if (entityData.registration_number.length !== 13) {
          newErrors.registration_number = 'Регистрационный номер должен содержать 13 цифр';
        } else if (!/^\d{13}$/.test(entityData.registration_number)) {
          newErrors.registration_number = 'Регистрационный номер должен содержать только цифры';
        }
        break;
      case 4:
        if (!entityData.director_surname?.trim()) {
          newErrors.director_surname = 'Введите фамилию директора';
        }
        if (!entityData.director_name?.trim()) {
          newErrors.director_name = 'Введите имя директора';
        }
        break;
      case 5:
        if (!entityData.contact_person_surname?.trim()) {
          newErrors.contact_person_surname = 'Введите фамилию контактного лица';
        }
        if (!entityData.contact_person_name?.trim()) {
          newErrors.contact_person_name = 'Введите имя контактного лица';
        }
        if (!entityData.contact_phone?.trim()) {
          newErrors.contact_phone = 'Введите контактный телефон';
        }
        break;
      case 6:
        if (!formData.connection_address?.trim()) {
          newErrors.connection_address = 'Выберите адрес подключения';
        }
        if (!entityData.legal_address?.trim()) {
          newErrors.legal_address = 'Введите юридический адрес';
        }
        break;
      default:
        break;
    }

    return newErrors;
  };

  const handleNumericInput = (e, onChange) => {
    const value = e.target.value.replace(/\D/g, '');
    onChange({
      target: {
        name: e.target.name,
        value: value
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!userType) {
        setMessage({ text: 'Пожалуйста, выберите тип пользователя', type: 'error' });
        return;
      }
      if (userId) {
        setFormData(prev => ({
          ...prev,
          id_user: userId
        }));
      }
      setCurrentStep(2);
      return;
    }

    let validationErrors = {};

    if (userType === 'natural_person') {
      validationErrors = validateNaturalPersonStep(currentStep);
    } else if (userType === 'legal_entities') {
      validationErrors = validateLegalEntityStep(currentStep);
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ text: 'Пожалуйста, заполните все обязательные поля', type: 'error' });
      return;
    }

    setErrors({});
    setMessage({ text: '', type: '' });
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const resetAllFormData = () => {
    if (setFormData) {
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
    }

    if (setPersonData) {
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
    }

    if (setEntityData) {
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
    }

    if (setSameAddress) {
      setSameAddress(false);
    }

    if (setErrors) {
      setErrors({});
    }
    if (setMessage) {
      setMessage({ text: '', type: '' });
    }
  };

  const handleBack = () => {
    const nextStep = currentStep - 1;
    if (nextStep === 1) {
      resetAllFormData();
      if (handleUserTypeSelection) {
        handleUserTypeSelection('');
      }
    }
    setCurrentStep(nextStep);
  };

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`${styles.step} ${currentStep === index + 1 ? styles.stepActive : ''
              } ${currentStep > index + 1 ? styles.stepCompleted : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className={styles.navigationButtons}>
        {currentStep > 1 && (
          <motion.button
            className={`${styles.button} ${styles.backButton}`}
            onClick={handleBack}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Назад
          </motion.button>
        )}
        {currentStep < totalSteps ? (
          <motion.button
            className={styles.button}
            onClick={handleNext}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Далее
          </motion.button>
        ) : (
          <motion.button
            className={styles.button}
            onClick={handleSubmitApplication}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Отправить заявку
          </motion.button>
        )}
      </div>
    );
  };

  const renderAddressFields = () => (
    <>
      <h4 className={styles.subtitle}>Выберите адрес подключения на карте</h4>
      <div className={styles.mapContainer}>
        <AddressMap onAddressSelect={handleMapAddressSelect} />
      </div>
      <div className={styles.mainAddressField}>
        {renderInput('connection_address', 'Адрес подключения', formData.connection_address, handleChange, "text", true, 300)}
      </div>
      <div className={styles.addressFieldsContainer}>
        <div className={styles.addressField}>
          {renderInput('connection_entrance', 'Подъезд', formData.connection_entrance, handleChange, "text", false)}
        </div>
        <div className={styles.addressField}>
          {renderInput('connection_floor', 'Этаж', formData.connection_floor, handleChange, "text", false)}
        </div>
        <div className={styles.addressField}>
          {renderInput('connection_apartment', 'Квартира', formData.connection_apartment, handleChange, "text", false)}
        </div>
      </div>
    </>
  );

  if (hasActiveApplication) {
    return (
      <div className={styles.userHomePage}>
        <div className={styles.container}>
          <h3 className={styles.activeApplicationTitle}>У вас уже есть активная заявка</h3>
          <p className={styles.activeApplicationMessage}>Вы можете подать новую заявку после завершения текущей.</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className={styles.userTypeSelection}>
          <h3 className={styles.title}>Давайте определим, как вы планируете пользоваться нашими услугами</h3>
          <div className={styles.userTypeButtons}>
            <button
              className={`${styles.userTypeButton} ${userType === 'natural_person' ? styles.selected : ''}`}
              onClick={() => handleUserTypeSelection('natural_person')}
            >
              <FaUser className={styles.userTypeIcon} />
              Физическое лицо
            </button>
            <button
              className={`${styles.userTypeButton} ${userType === 'legal_entities' ? styles.selected : ''}`}
              onClick={() => handleUserTypeSelection('legal_entities')}
            >
              <FaBuilding className={styles.userTypeIcon} />
              Юридическое лицо
            </button>
          </div>
        </div>
      );
    }

    if (userType === 'natural_person') {
      switch (currentStep) {
        case 2:
          return (
            <>
              <div className={`${styles.inputContainer} ${styles.tariffSelect}`}>
                <select
                  className={`${styles.select} ${errors.id_tariff ? styles.inputError : ''}`}
                  name="id_tariff"
                  value={formData.id_tariff}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите тариф</option>
                  {tariffs.map((tariff) => (
                    <option key={tariff.id_tariff} value={tariff.id_tariff}>
                      {tariff.tariff_name} - {tariff.price} руб.
                    </option>
                  ))}
                </select>
                {renderError('id_tariff')}
              </div>
              {renderInput('surname', 'Фамилия', personData.surname,
                (e) => handleTextInputChange(e, handlePersonChange), "text", true, 50)}
              {renderInput('name', 'Имя', personData.name,
                (e) => handleTextInputChange(e, handlePersonChange), "text", true, 50)}
              {renderInput('patronymic', 'Отчество (не обязательно)', personData.patronymic,
                (e) => handleTextInputChange(e, handlePersonChange), "text", false, 50)}
            </>
          );
        case 3:
          return (
            <>
              <div className={`${styles.inputContainer} ${styles.dateSelect}`}>
                <input
                  className={`${styles.input} ${errors.date_of_birth ? styles.inputError : ''}`}
                  type="date"
                  name="date_of_birth"
                  value={personData.date_of_birth}
                  onChange={handlePersonChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                {renderError('date_of_birth')}
              </div>
              <div className={`${styles.inputContainer} ${styles.genderSelect}`}>
                <select
                  className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
                  name="gender"
                  value={personData.gender}
                  onChange={handlePersonChange}
                  required
                >
                  <option value="">Выберите пол</option>
                  <option value="М">М</option>
                  <option value="Ж">Ж</option>
                </select>
                {renderError('gender')}
              </div>
            </>
          );
        case 4:
          return renderAddressFields();
        case 5:
          return (
            <>
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={handleSameAddressChange}
                    className={styles.checkbox}
                  />
                  Адрес подключения соответствует адресу проживания?
                </label>
              </div>
              {!sameAddress && (
                <>
                  <div className={styles.mainAddressField}>
                    {renderInput('residential_address', 'Адрес проживания', personData.residential_address, handlePersonChange, "text", true, 300)}
                  </div>
                  <div className={styles.addressDetails}>
                    <div className={styles.addressField}>
                      {renderInput('residential_entrance', 'Подъезд', personData.residential_entrance, handlePersonChange, "text", false)}
                    </div>
                    <div className={styles.addressField}>
                      {renderInput('residential_floor', 'Этаж', personData.residential_floor, handlePersonChange, "text", false)}
                    </div>
                    <div className={styles.addressField}>
                      {renderInput('residential_apartment', 'Квартира', personData.residential_apartment, handlePersonChange, "text", false)}
                    </div>
                  </div>
                </>
              )}
            </>
          );
        case 6:
          return (
            <>
              {renderInput('passport_series', 'Серия паспорта (4 цифры)', personData.passport_series, handlePersonChange, "text", true, 4)}
              {renderInput('passport_number', 'Номер паспорта (6 цифр)', personData.passport_number, handlePersonChange, "text", true, 6)}
            </>
          );
        default:
          return null;
      }
    } else if (userType === 'legal_entities') {
      switch (currentStep) {
        case 2:
          return (
            <>
              <div className={`${styles.inputContainer} ${styles.tariffSelect}`}>
                <select
                  className={`${styles.select} ${errors.id_tariff ? styles.inputError : ''}`}
                  name="id_tariff"
                  value={formData.id_tariff}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите тариф</option>
                  {tariffs.map((tariff) => (
                    <option key={tariff.id_tariff} value={tariff.id_tariff}>
                      {tariff.tariff_name} - {tariff.price} руб.
                    </option>
                  ))}
                </select>
                {renderError('id_tariff')}
              </div>
              {renderInput('name', 'Название компании', entityData.name, handleEntityChange, "text", true, 200)}
            </>
          );
        case 3:
          return (
            <>
              {renderInput('tin', 'ИНН (11 цифр)', entityData.tin,
                (e) => handleNumericInput(e, handleEntityChange), "text", true, 11)}
              {renderInput('registration_number', 'Регистрационный номер (13 цифр)', entityData.registration_number,
                (e) => handleNumericInput(e, handleEntityChange), "text", true, 13)}
            </>
          );
        case 4:
          return (
            <div className={styles.directorFieldset}>
              <h4 className={styles.subtitle}>ФИО директора</h4>
              <div className={styles.directorFields}>
                {renderInput('director_surname', 'Фамилия директора', entityData.director_surname, handleEntityChange, "text", true, 50)}
                {renderInput('director_name', 'Имя директора', entityData.director_name, handleEntityChange, "text", true, 50)}
                {renderInput('director_patronymic', 'Отчество директора', entityData.director_patronymic, handleEntityChange, "text", false, 50)}
              </div>
            </div>
          );
        case 5:
          return (
            <>
              <div className={styles.directorFieldset}>
                <h4 className={styles.subtitle}>Контактное лицо</h4>
                <div className={styles.directorFields}>
                  {renderInput('contact_person_surname', 'Фамилия контактного лица', entityData.contact_person_surname, handleEntityChange, "text", true, 50)}
                  {renderInput('contact_person_name', 'Имя контактного лица', entityData.contact_person_name, handleEntityChange, "text", true, 50)}
                  {renderInput('contact_person_patronymic', 'Отчество контактного лица', entityData.contact_person_patronymic, handleEntityChange, "text", false, 50)}
                </div>
              </div>
              <div className={styles.inputContainer}>
                <input
                  className={`${styles.input} ${errors.contact_phone ? styles.inputError : ''}`}
                  type="tel"
                  name="contact_phone"
                  placeholder="Контактный номер телефона"
                  value={entityData.contact_phone}
                  onChange={handleEntityChange}
                  required
                  pattern="\+7\d{10}"
                  maxLength="12"
                />
                {renderError('contact_phone')}
              </div>
              {renderInput('website', 'Веб-сайт', entityData.website, handleEntityChange, "text", false, 300)}
            </>
          );
        case 6:
          return (
            <>
              {renderAddressFields()}
              <div className={styles.legalAddressContainer}>
                {renderInput('legal_address', 'Юридический адрес', entityData.legal_address, handleEntityChange, "text", true, 300)}
              </div>
            </>
          );
        default:
          return null;
      }
    }

    return (
      <motion.div
        key={currentStep}
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {renderStep()}
      </motion.div>
    );
  };

  return (
    <motion.div
      className={styles.userHomePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className={styles.container}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.stepContainer}>
          {renderStepIndicator()}
          <div className={`${styles.stepContent} ${styles.stepContentActive}`}>
            {renderStep()}
          </div>
          {renderNavigationButtons()}
        </div>

        {message && message.text && (
          <motion.p
            className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {message.text}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RequestFormationForm;