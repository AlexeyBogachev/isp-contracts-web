import React from 'react';
import styles from './UserHome.module.css';

const UserHomeForm = ({
  step,
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
  hasActiveApplication
}) => {
  if (hasActiveApplication) {
    return (
      <div className={styles.userHomePage}>
        <div className={styles.container}>
          <h3 className={styles.title}>У вас уже есть активная заявка</h3>
          <p className={styles.message}>Вы можете подать новую заявку после завершения текущей.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.userHomePage}>
      <div className={styles.container}>
        <div>
          {step === 1 && (
            <div>
              <h3 className={styles.title}>Выберите тип</h3>
              <button className={styles.button} onClick={() => handleUserTypeSelection('natural_person')}>Физическое лицо</button>
              <button className={styles.button} onClick={() => handleUserTypeSelection('legal_entities')}>Юридическое лицо</button>
            </div>
          )}

          {step === 2 && userType === 'natural_person' && (
            <div>
              <h3 className={styles.title}>Заполните данные физического лица</h3>
              <input className={styles.input} type="text" name="surname" placeholder="Фамилия"
                value={personData.surname}
                onChange={(e) => handleTextInputChange(e, handlePersonChange)} required />

              <input className={styles.input} type="text" name="name" placeholder="Имя"
                value={personData.name}
                onChange={(e) => handleTextInputChange(e, handlePersonChange)} required />

              <input className={styles.input} type="text" name="patronymic" placeholder="Отчество (не обязательно)"
                value={personData.patronymic}
                onChange={(e) => handleTextInputChange(e, handlePersonChange)} />

              <input className={styles.input} type="date" name="date_of_birth" placeholder="Дата рождения" onChange={handlePersonChange} required />

              <select className={styles.select} name="gender" onChange={handlePersonChange} required>
                <option value="">Выберите пол</option>
                <option value="М">М</option>
                <option value="Ж">Ж</option>
              </select>

              <input className={styles.input} type="text" name="registration_address" placeholder="Адрес регистрации (не обязательно)" onChange={handlePersonChange} />
              <input className={styles.input} type="text" name="residential_address" placeholder="Адрес проживания" onChange={handlePersonChange} />
              <input className={styles.input} type="text" name="passport_series" placeholder="Серия паспорта" onChange={handlePersonChange} required />
              <input className={styles.input} type="text" name="passport_number" placeholder="Номер паспорта" onChange={handlePersonChange} required />

              <button className={styles.button} onClick={handleSubmitUserDetails}>Далее</button>
            </div>
          )}

          {step === 2 && userType === 'legal_entities' && (
            <div>
              <h3 className={styles.title}>Заполните данные юридического лица</h3>

              <input className={styles.input} type="text" name="name" placeholder="Название компании"
                value={entityData.name}
                onChange={(e) => handleTextInputChange(e, handleEntityChange)} required />

              <input className={styles.input} type="text" name="TIN" placeholder="ИНН" onChange={handleEntityChange} required />
              <input className={styles.input} type="text" name="registration_number" placeholder="Регистрационный номер" onChange={handleEntityChange} required />

              <input className={styles.input} type="text" name="director_full_name" placeholder="ФИО директора"
                value={entityData.director_full_name}
                onChange={(e) => handleTextInputChange(e, handleEntityChange)} required />

              <input className={styles.input} type="text" name="contact_person" placeholder="Контактное лицо"
                value={entityData.contact_person}
                onChange={(e) => handleTextInputChange(e, handleEntityChange)} />

              <input className={styles.input} type="text" name="contact_phone" placeholder="Контактный телефон" onChange={handleEntityChange} required />
              <input className={styles.input} type="text" name="actual_address" placeholder="Фактический адрес" onChange={handleEntityChange} required />
              <input className={styles.input} type="text" name="legal_address" placeholder="Юридический адрес" onChange={handleEntityChange} required />
              <input className={styles.input} type="text" name="website" placeholder="Веб-сайт" onChange={handleEntityChange} />

              <button className={styles.button} onClick={handleSubmitUserDetails}>Далее</button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitApplication}>
              <select className={styles.select} name="id_tariff" value={formData.id_tariff} onChange={handleChange} required>
                <option value="">Выберите тариф</option>
                {tariffs.map((tariff) => (
                  <option key={tariff.id_tariff} value={tariff.id_tariff}>
                    {tariff.tariff_name} - {tariff.price} руб.
                  </option>
                ))}
              </select>

              <button className={styles.button} type="submit">Создать заявку</button>
            </form>
          )}

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserHomeForm;