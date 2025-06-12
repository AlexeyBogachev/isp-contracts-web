import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EditApplication.module.css";

const EditApplicationFormContent = ({
  formData,
  statusOptions,
  tariffOptions,
  employeeOptions,
  handleChange,
  handleSubmit,
  onClose,
  userType,
  errors
}) => {
  const renderError = (fieldName) => {
    return errors[fieldName] && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className={styles.errorText}
      >
        {errors[fieldName]}
      </motion.span>
    );
  };

  const renderNaturalPersonFields = () => (
    <>
      <div className={styles.formGroup}>
        <label>Фамилия:</label>
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          className={`${styles.input} ${errors.surname ? styles.errorInput : ''}`}
          placeholder="Введите фамилию"
          required
        />
        {renderError('surname')}
      </div>
      <div className={styles.formGroup}>
        <label>Имя:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
          placeholder="Введите имя"
          required
        />
        {renderError('name')}
      </div>
      <div className={styles.formGroup}>
        <label>Отчество:</label>
        <input
          type="text"
          name="patronymic"
          value={formData.patronymic}
          onChange={handleChange}
          className={`${styles.input} ${errors.patronymic ? styles.errorInput : ''}`}
          placeholder="Введите отчество"
        />
        {renderError('patronymic')}
      </div>
      <div className={styles.formGroup}>
        <label>Дата рождения:</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className={`${styles.input} ${errors.date_of_birth ? styles.errorInput : ''}`}
          required
        />
        {renderError('date_of_birth')}
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Адрес проживания:</label>
        <input
          type="text"
          name="residential_address"
          value={formData.residential_address}
          onChange={handleChange}
          className={`${styles.input} ${errors.residential_address ? styles.errorInput : ''}`}
          placeholder="Введите полный адрес проживания"
          required
        />
        {renderError('residential_address')}
      </div>
      <div className={styles.formGroup}>
        <label>Серия паспорта:</label>
        <input
          type="text"
          name="passport_series"
          value={formData.passport_series}
          onChange={handleChange}
          className={`${styles.input} ${errors.passport_series ? styles.errorInput : ''}`}
          placeholder="XXXX"
          required
          maxLength="4"
        />
        {renderError('passport_series')}
      </div>
      <div className={styles.formGroup}>
        <label>Номер паспорта:</label>
        <input
          type="text"
          name="passport_number"
          value={formData.passport_number}
          onChange={handleChange}
          className={`${styles.input} ${errors.passport_number ? styles.errorInput : ''}`}
          placeholder="XXXXXX"
          required
          maxLength="6"
        />
        {renderError('passport_number')}
      </div>
    </>
  );

  const renderLegalEntityFields = () => (
    <>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Название компании:</label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className={`${styles.input} ${errors.company_name ? styles.errorInput : ''}`}
          placeholder="Введите полное название компании"
          required
        />
        {renderError('company_name')}
      </div>
      <div className={styles.formGroup}>
        <label>ИНН:</label>
        <input
          type="text"
          name="tin"
          value={formData.tin}
          onChange={handleChange}
          className={`${styles.input} ${errors.tin ? styles.errorInput : ''}`}
          placeholder="XXXXXXXXXX"
          required
          maxLength="12"
        />
        {renderError('tin')}
      </div>
      <div className={styles.formGroup}>
        <label>ОГРН:</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number}
          onChange={handleChange}
          className={`${styles.input} ${errors.registration_number ? styles.errorInput : ''}`}
          placeholder="XXXXXXXXXXXXX"
          required
          maxLength="13"
        />
        {renderError('registration_number')}
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>ФИО директора:</label>
        <input
          type="text"
          name="director_full_name"
          value={formData.director_full_name}
          onChange={handleChange}
          className={`${styles.input} ${errors.director_full_name ? styles.errorInput : ''}`}
          placeholder="Введите ФИО директора"
          required
        />
        {renderError('director_full_name')}
      </div>
      <div className={styles.formGroup}>
        <label>Контактное лицо:</label>
        <input
          type="text"
          name="contact_person"
          value={formData.contact_person}
          onChange={handleChange}
          className={`${styles.input} ${errors.contact_person ? styles.errorInput : ''}`}
          placeholder="Введите ФИО контактного лица"
        />
        {renderError('contact_person')}
      </div>
      <div className={styles.formGroup}>
        <label>Контактный телефон:</label>
        <input
          type="text"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          className={`${styles.input} ${errors.contact_phone ? styles.errorInput : ''}`}
          placeholder="+7XXXXXXXXXX"
          required
        />
        {renderError('contact_phone')}
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Юридический адрес:</label>
        <input
          type="text"
          name="legal_address"
          value={formData.legal_address}
          onChange={handleChange}
          className={`${styles.input} ${errors.legal_address ? styles.errorInput : ''}`}
          placeholder="Введите полный юридический адрес"
          required
        />
        {renderError('legal_address')}
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Веб-сайт:</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`${styles.input} ${errors.website ? styles.errorInput : ''}`}
          placeholder="https://"
        />
        {renderError('website')}
      </div>
    </>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className={styles.modalOverlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
            mass: 0.5,
            duration: 0.1
          }}
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            Редактировать заявку
          </motion.h2>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            onSubmit={handleSubmit}
          >
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Менеджер:</label>
              <select
                name="report_card_number"
                value={formData.report_card_number}
                onChange={handleChange}
                className={`${styles.select} ${errors.report_card_number ? styles.errorInput : ''}`}
                required
              >
                <option value="">Выберите сотрудника</option>
                {employeeOptions.map((employee) => (
                  <option key={employee.report_card_number} value={employee.report_card_number}>
                    {employee.surname} {employee.name} {employee.patronymic}
                  </option>
                ))}
              </select>
              {renderError('report_card_number')}
            </div>

            <div className={styles.formGroup}>
              <label>Статус заявки:</label>
              <select
                name="id_status_application"
                value={formData.id_status_application}
                onChange={handleChange}
                className={`${styles.select} ${errors.id_status_application ? styles.errorInput : ''}`}
                required
              >
                {statusOptions.map((status) => (
                  <option key={status.id_status_application} value={status.id_status_application}>
                    {status.status_application_name}
                  </option>
                ))}
              </select>
              {renderError('id_status_application')}
            </div>

            <div className={styles.formGroup}>
              <label>Тариф:</label>
              <select
                name="id_tariff"
                value={formData.id_tariff}
                onChange={handleChange}
                className={`${styles.select} ${errors.id_tariff ? styles.errorInput : ''}`}
                required
              >
                <option value="">Выберите тариф</option>
                {tariffOptions.map((tariff) => (
                  <option key={tariff.id_tariff} value={tariff.id_tariff.toString()}>
                    {tariff.tariff_name} ({tariff.speed_mbps} Мбит/с - {tariff.price} ₽)
                  </option>
                ))}
              </select>
              {renderError('id_tariff')}
            </div>

            <div className={styles.formGroup}>
              <label>Стоимость заявки (₽):</label>
              <input
                type="number"
                name="cost_application"
                value={formData.cost_application}
                onChange={handleChange}
                className={`${styles.input} ${errors.cost_application ? styles.errorInput : ''}`}
                placeholder="Введите стоимость заявки"
                min="0"
                step="any"
                required
              />
              {renderError('cost_application')}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Адрес подключения:</label>
              <input
                type="text"
                name="connection_address"
                value={formData.connection_address}
                onChange={handleChange}
                className={`${styles.input} ${errors.connection_address ? styles.errorInput : ''}`}
                placeholder="Введите полный адрес подключения"
                required
              />
              {renderError('connection_address')}
            </div>

            {userType === 'natural' && renderNaturalPersonFields()}
            {userType === 'legal' && renderLegalEntityFields()}

            <div className={styles.buttonGroup}>
              <motion.button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.05 }}
              >
                Отмена
              </motion.button>
              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.05 }}
              >
                Сохранить
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditApplicationFormContent;