import React from 'react';

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
  message
}) => {

  return (
    <div>
      {step === 1 && (
        <div>
          <h3>Выберите тип пользователя</h3>
          <button onClick={() => handleUserTypeSelection('natural_person')}>Физическое лицо</button>
          <button onClick={() => handleUserTypeSelection('legal_entities')}>Юридическое лицо</button>
        </div>
      )}

      {step === 2 && userType === 'natural_person' && (
        <div>
          <h3>Заполните данные физического лица</h3>
          <input type="text" name="surname" placeholder="Фамилия" 
            value={personData.surname} 
            onChange={(e) => handleTextInputChange(e, handlePersonChange)} required />

          <input type="text" name="name" placeholder="Имя" 
            value={personData.name} 
            onChange={(e) => handleTextInputChange(e, handlePersonChange)} required />

          <input type="text" name="patronymic" placeholder="Отчество (не обязательно)" 
            value={personData.patronymic} 
            onChange={(e) => handleTextInputChange(e, handlePersonChange)} />

          <input type="date" name="date_of_birth" placeholder="Дата рождения" onChange={handlePersonChange} required />
          <select name="gender" onChange={handlePersonChange} required>
            <option value="">Выберите пол</option>
            <option value="М">М</option>
            <option value="Ж">Ж</option>
          </select>
          <input type="text" name="registration_address" placeholder="Адрес регистрации (не обязательно)" onChange={handlePersonChange} />
          <input type="text" name="residential_address" placeholder="Адрес проживания" onChange={handlePersonChange} />
          <input type="text" name="passport_series" placeholder="Серия паспорта" onChange={handlePersonChange} required />
          <input type="text" name="passport_number" placeholder="Номер паспорта" onChange={handlePersonChange} required />

          <button onClick={handleSubmitUserDetails}>Далее</button>
        </div>
      )}

      {step === 2 && userType === 'legal_entities' && (
        <div>
          <h3>Заполните данные юридического лица</h3>
          <input type="text" name="name" placeholder="Название компании" 
            value={entityData.name} 
            onChange={(e) => handleTextInputChange(e, handleEntityChange)} required />

          <input type="text" name="TIN" placeholder="ИНН" onChange={handleEntityChange} required />
          <input type="text" name="registration_number" placeholder="Регистрационный номер" onChange={handleEntityChange} required />

          <input type="text" name="director_full_name" placeholder="ФИО директора" 
            value={entityData.director_full_name} 
            onChange={(e) => handleTextInputChange(e, handleEntityChange)} required />

          <input type="text" name="contact_person" placeholder="Контактное лицо" 
            value={entityData.contact_person} 
            onChange={(e) => handleTextInputChange(e, handleEntityChange)} />

          <input type="text" name="contact_phone" placeholder="Контактный телефон" onChange={handleEntityChange} required />
          <input type="text" name="actual_address" placeholder="Фактический адрес" onChange={handleEntityChange} required />
          <input type="text" name="legal_address" placeholder="Юридический адрес" onChange={handleEntityChange} required />
          <input type="text" name="website" placeholder="Веб-сайт" onChange={handleEntityChange} />

          <button onClick={handleSubmitUserDetails}>Далее</button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitApplication}>
          <select name="id_tariff" value={formData.id_tariff} onChange={handleChange} required>
            <option value="">Выберите тариф</option>
            {tariffs.map((tariff) => (
              <option key={tariff.id_tariff} value={tariff.id_tariff}>
                {tariff.tariff_name} - {tariff.price} руб.
              </option>
            ))}
          </select>

          <button type="submit">Создать заявку</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default UserHomeForm;