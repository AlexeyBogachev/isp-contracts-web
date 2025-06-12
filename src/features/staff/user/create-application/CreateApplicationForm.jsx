import React from 'react';
import styles from './CreateApplication.module.css';
import AddressMap from '../../../../shared/components/AddressMap';

const CreateApplicationForm = ({
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
  handleSubmitApplication,
  message,
  sameAddress,
  handleSameAddressChange,
  handleMapAddressSelect,
  errors
}) => {
  const handleNumericInput = (e, originalHandler) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    originalHandler(e);
  };

  const renderError = (fieldName) => {
    return errors[fieldName] && (
      <span className={styles.errorText}>{errors[fieldName]}</span>
    );
  };

  const renderInput = (name, placeholder, value, onChange, type = "text", required = true, maxLength = undefined, pattern = undefined) => (
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
        pattern={pattern}
      />
      {renderError(name)}
    </div>
  );

  const renderClientTypeSelection = () => (
    <div className={styles.formSection}>
      <h3 className={styles.title}>Выберите тип клиента</h3>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.typeButton} ${userType === 'natural_person' ? styles.active : ''}`}
          onClick={() => handleUserTypeSelection('natural_person')}
        >
          Физическое лицо
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${userType === 'legal_entities' ? styles.active : ''}`}
          onClick={() => handleUserTypeSelection('legal_entities')}
        >
          Юридическое лицо
        </button>
      </div>
    </div>
  );

  const renderMainForm = () => (
    <>
      <div className={styles.formSection}>
        <h3 className={styles.title}>Основная информация</h3>
        {renderInput('id_user', 'ID пользователя', formData.id_user, handleChange, "number")}
        {message && message.type === 'error' && message.text.includes('активная заявка') && (
          <p className={`${styles.message} ${styles.error}`}>
            {message.text}
          </p>
        )}

        <div className={styles.inputContainer}>
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
      </div>

      {userType === 'natural_person' && (
        <div className={styles.formSection}>
          <h3 className={styles.title}>Данные физического лица</h3>
          {renderInput('surname', 'Фамилия', personData.surname,
            (e) => handleTextInputChange(e, handlePersonChange))}
          {renderInput('name', 'Имя', personData.name,
            (e) => handleTextInputChange(e, handlePersonChange))}
          {renderInput('patronymic', 'Отчество (не обязательно)', personData.patronymic,
            (e) => handleTextInputChange(e, handlePersonChange), "text", false)}

          <div className={styles.inputContainer}>
            <input
              className={`${styles.input} ${errors.date_of_birth ? styles.inputError : ''}`}
              type="date"
              name="date_of_birth"
              value={personData.date_of_birth}
              onChange={handlePersonChange}
              required
            />
            {renderError('date_of_birth')}
          </div>

          <div className={styles.inputContainer}>
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

          <h4 className={styles.subtitle}>Паспортные данные</h4>
          <div className={styles.addressDetails}>
            <div className={styles.addressField}>
              <input
                className={`${styles.input} ${errors.passport_series ? styles.inputError : ''}`}
                type="text"
                name="passport_series"
                placeholder="Серия паспорта"
                value={personData.passport_series}
                onChange={(e) => handleNumericInput(e, handlePersonChange)}
                maxLength="4"
                required
              />
              {renderError('passport_series')}
            </div>
            <div className={styles.addressField}>
              <input
                className={`${styles.input} ${errors.passport_number ? styles.inputError : ''}`}
                type="text"
                name="passport_number"
                placeholder="Номер паспорта"
                value={personData.passport_number}
                onChange={(e) => handleNumericInput(e, handlePersonChange)}
                maxLength="6"
                required
              />
              {renderError('passport_number')}
            </div>
          </div>
        </div>
      )}

      {userType === 'legal_entities' && (
        <div className={styles.formSection}>
          <h3 className={styles.title}>Данные юридического лица</h3>
          {renderInput('name', 'Название компании', entityData.name,
            handleEntityChange, "text", true, 200)}

          {renderInput('tin', 'ИНН', entityData.tin,
            (e) => handleNumericInput(e, handleEntityChange),
            "text", true, 11, "^[0-9]*$")}
          {renderInput('registration_number', 'Регистрационный номер', entityData.registration_number,
            (e) => handleNumericInput(e, handleEntityChange),
            "text", true, 13, "^[0-9]*$")}

          <div className={styles.directorFieldset}>
            <h4 className={styles.subtitle}>ФИО директора</h4>
            <div className={styles.directorFields}>
              {renderInput('director_surname', 'Фамилия', entityData.director_surname,
                (e) => handleTextInputChange(e, handleEntityChange), "text", true, 50)}
              {renderInput('director_name', 'Имя', entityData.director_name,
                (e) => handleTextInputChange(e, handleEntityChange), "text", true, 50)}
              {renderInput('director_patronymic', 'Отчество', entityData.director_patronymic,
                (e) => handleTextInputChange(e, handleEntityChange), "text", false, 50)}
            </div>
          </div>

          <div className={styles.directorFieldset}>
            <h4 className={styles.subtitle}>Контактное лицо</h4>
            <div className={styles.directorFields}>
              {renderInput('contact_person_surname', 'Фамилия', entityData.contact_person_surname,
                (e) => handleTextInputChange(e, handleEntityChange), "text", true, 50)}
              {renderInput('contact_person_name', 'Имя', entityData.contact_person_name,
                (e) => handleTextInputChange(e, handleEntityChange), "text", true, 50)}
              {renderInput('contact_person_patronymic', 'Отчество', entityData.contact_person_patronymic,
                (e) => handleTextInputChange(e, handleEntityChange), "text", false, 50)}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <input
              className={`${styles.input} ${errors.contact_phone ? styles.inputError : ''}`}
              type="tel"
              name="contact_phone"
              placeholder="Номер телефона"
              value={entityData.contact_phone}
              onChange={handleEntityChange}
              required
              pattern="\+7\d{10}"
              maxLength="12"
            />
            {renderError('contact_phone')}
          </div>

          {renderInput('legal_address', 'Юридический адрес', entityData.legal_address, handleEntityChange, "text", true, 300)}
          {renderInput('website', 'Веб-сайт', entityData.website, handleEntityChange, "text", false, 300)}
        </div>
      )}

      <div className={styles.formSection}>
        <h3 className={styles.title}>Адрес подключения</h3>
        <h4 className={styles.subtitle}>Выберите адрес подключения на карте</h4>
        <AddressMap onAddressSelect={handleMapAddressSelect} />
        {renderInput('connection_address', 'Адрес подключения', formData.connection_address, handleChange, "text", true, 300)}

        <div className={styles.addressDetails}>
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

        {userType === 'natural_person' && (
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

            <h4 className={styles.subtitle}>Адрес проживания</h4>
            {renderInput('residential_address', 'Адрес проживания', personData.residential_address, handlePersonChange, "text", true, 300)}

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
      </div>

      <button className={styles.submitButton} type="submit">Создать заявку</button>
    </>
  );

  return (
    <div className={styles.createApplicationPage}>
      <div className={styles.container}>
        <form onSubmit={handleSubmitApplication}>
          {renderClientTypeSelection()}
          {userType && renderMainForm()}
          {message && message.text && (
            <p className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateApplicationForm;