import React from 'react';
import styles from './Settings.module.css';

const PATTERNS = {
    name: /^[А-Яа-яЁё-]{2,50}$/,
    phone: /^\+7\d{10}$/,
    passport_series: /^\d{4}$/,
    passport_number: /^\d{6}$/,
    tin: /^\d{11}$/,
    registration_number: /^\d{13}$/,
    company_name: /^[A-Za-zА-Яа-яЁё0-9\s\-_.,&()'"№]+$/,
};

const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const validateNaturalPerson = (data) => {
    const errors = {};

    if (!data.surname?.trim()) {
        errors.surname = 'Фамилия обязательна';
    } else if (!PATTERNS.name.test(data.surname)) {
        errors.surname = 'Фамилия должна содержать только русские буквы и дефис (2-50 символов)';
    }

    if (!data.name?.trim()) {
        errors.name = 'Имя обязательно';
    } else if (!PATTERNS.name.test(data.name)) {
        errors.name = 'Имя должно содержать только русские буквы и дефис (2-50 символов)';
    }

    if (data.patronymic && !PATTERNS.name.test(data.patronymic)) {
        errors.patronymic = 'Отчество должно содержать только русские буквы и дефис (2-50 символов)';
    }

    if (!data.date_of_birth) {
        errors.date_of_birth = 'Дата рождения обязательна';
    } else {
        const birthDate = new Date(data.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || age > 120) {
            errors.date_of_birth = 'Возраст должен быть от 18 до 120 лет';
        }
    }

    if (!data.gender) {
        errors.gender = 'Пол обязателен';
    }

    if (!data.residential_address?.trim()) {
        errors.residential_address = 'Адрес проживания обязателен';
    } else if (data.residential_address.length > 300) {
        errors.residential_address = 'Адрес проживания не может быть длиннее 300 символов';
    }

    if (!PATTERNS.passport_series.test(data.passport_series)) {
        errors.passport_series = 'Серия паспорта должна состоять из 4 цифр';
    }
    if (!PATTERNS.passport_number.test(data.passport_number)) {
        errors.passport_number = 'Номер паспорта должен состоять из 6 цифр';
    }

    return errors;
};

const validateLegalEntity = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = 'Название компании обязательно';
    } else if (data.name.length > 200) {
        errors.name = 'Название компании не может быть длиннее 200 символов';
    } else if (!PATTERNS.company_name.test(data.name)) {
        errors.name = 'Название компании содержит недопустимые символы';
    }

    if (!data.tin?.trim()) {
        errors.tin = 'ИНН обязателен';
    } else if (!PATTERNS.tin.test(data.tin)) {
        errors.tin = 'ИНН должен содержать 11 цифр';
    }

    if (!data.registration_number?.trim()) {
        errors.registration_number = 'Регистрационный номер обязателен';
    } else if (!PATTERNS.registration_number.test(data.registration_number)) {
        errors.registration_number = 'Регистрационный номер должен содержать 13 цифр';
    }

    if (!data.director_full_name?.trim()) {
        errors.director_full_name = 'ФИО директора обязательно';
    } else if (data.director_full_name.length > 150) {
        errors.director_full_name = 'ФИО директора не может быть длиннее 150 символов';
    }

    if (!data.legal_address?.trim()) {
        errors.legal_address = 'Юридический адрес обязателен';
    } else if (data.legal_address.length > 300) {
        errors.legal_address = 'Юридический адрес не может быть длиннее 300 символов';
    }

    if (!data.contact_person?.trim()) {
        errors.contact_person = 'Контактное лицо обязательно';
    } else if (data.contact_person.length > 150) {
        errors.contact_person = 'ФИО контактного лица не может быть длиннее 150 символов';
    }

    if (!data.contact_phone?.trim()) {
        errors.contact_phone = 'Контактный телефон обязателен';
    } else if (!PATTERNS.phone.test(data.contact_phone)) {
        errors.contact_phone = 'Неверный формат телефона (+7XXXXXXXXXX)';
    }

    if (data.website && data.website.length > 300) {
        errors.website = 'URL веб-сайта не может быть длиннее 300 символов';
    }

    return errors;
};

const SettingsForm = ({
    clientType,
    formData,
    errors,
    onSubmit,
    onCancel,
    onInputChange
}) => {
    const handleTextInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name' && clientType === 'legal') {
            onInputChange(e);
            return;
        }

        if (name === 'residential_address' || name === 'legal_address') {
            onInputChange(e);
            return;
        }

        if (name === 'director_full_name' || name === 'contact_person') {
            const filteredValue = value.replace(/[^А-Яа-яЁё\s-]/g, '');
            onInputChange({
                target: {
                    name,
                    value: filteredValue
                }
            });
            return;
        }

        const onlyLetters = value.replace(/[^А-Яа-яЁё-]/g, '');
        onInputChange({
            target: {
                name,
                value: capitalizeFirstLetter(onlyLetters)
            }
        });
    };

    const handleNumericInput = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/\D/g, '');
        onInputChange({
            target: {
                name,
                value: numericValue
            }
        });
    };

    const handlePhoneInput = (e) => {
        const { name, value } = e.target;
        let phoneNumber = value.replace(/\D/g, '');

        if (phoneNumber.startsWith('7') || phoneNumber.startsWith('8')) {
            phoneNumber = phoneNumber.substring(1);
        }

        if (phoneNumber) {
            phoneNumber = '+7' + phoneNumber;
        }

        if (phoneNumber.length <= 12) {
            onInputChange({
                target: {
                    name,
                    value: phoneNumber
                }
            });
        }
    };

    const renderError = (fieldName) => {
        return errors[fieldName] && (
            <span className={styles.error}>{errors[fieldName]}</span>
        );
    };

    const renderNaturalPersonForm = () => (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Фамилия</label>
                <input
                    type="text"
                    name="surname"
                    value={formData.surname || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                    required
                    maxLength={50}
                />
                {renderError('surname')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Имя</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    required
                    maxLength={50}
                />
                {renderError('name')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Отчество</label>
                <input
                    type="text"
                    name="patronymic"
                    value={formData.patronymic || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.patronymic ? styles.inputError : ''}`}
                    maxLength={50}
                />
                {renderError('patronymic')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Пол</label>
                <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={onInputChange}
                    className={`${styles.input} ${errors.gender ? styles.inputError : ''}`}
                    required
                >
                    <option value="">Выберите пол</option>
                    <option value="М">Мужской</option>
                    <option value="Ж">Женский</option>
                </select>
                {renderError('gender')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Дата рождения</label>
                <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth || ''}
                    onChange={onInputChange}
                    className={`${styles.input} ${errors.date_of_birth ? styles.inputError : ''}`}
                    required
                />
                {renderError('date_of_birth')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Адрес проживания</label>
                <input
                    type="text"
                    name="residential_address"
                    value={formData.residential_address || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.residential_address ? styles.inputError : ''}`}
                    required
                    maxLength={300}
                />
                {renderError('residential_address')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Серия паспорта</label>
                <input
                    type="text"
                    name="passport_series"
                    value={formData.passport_series || ''}
                    onChange={handleNumericInput}
                    className={`${styles.input} ${errors.passport_series ? styles.inputError : ''}`}
                    required
                    maxLength={4}
                    pattern="\d{4}"
                />
                {renderError('passport_series')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Номер паспорта</label>
                <input
                    type="text"
                    name="passport_number"
                    value={formData.passport_number || ''}
                    onChange={handleNumericInput}
                    className={`${styles.input} ${errors.passport_number ? styles.inputError : ''}`}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                />
                {renderError('passport_number')}
            </div>
        </form>
    );

    const renderLegalEntityForm = () => (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Название компании</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    required
                    maxLength={200}
                />
                {renderError('name')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>ИНН</label>
                <input
                    type="text"
                    name="tin"
                    value={formData.tin || ''}
                    onChange={handleNumericInput}
                    className={`${styles.input} ${errors.tin ? styles.inputError : ''}`}
                    required
                    maxLength={11}
                    pattern="\d{11}"
                />
                {renderError('tin')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Регистрационный номер</label>
                <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number || ''}
                    onChange={handleNumericInput}
                    className={`${styles.input} ${errors.registration_number ? styles.inputError : ''}`}
                    required
                    maxLength={13}
                    pattern="\d{13}"
                />
                {renderError('registration_number')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>ФИО директора</label>
                <input
                    type="text"
                    name="director_full_name"
                    value={formData.director_full_name || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.director_full_name ? styles.inputError : ''}`}
                    required
                    maxLength={150}
                />
                {renderError('director_full_name')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Юридический адрес</label>
                <input
                    type="text"
                    name="legal_address"
                    value={formData.legal_address || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.legal_address ? styles.inputError : ''}`}
                    required
                    maxLength={300}
                />
                {renderError('legal_address')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Контактное лицо</label>
                <input
                    type="text"
                    name="contact_person"
                    value={formData.contact_person || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.contact_person ? styles.inputError : ''}`}
                    required
                    maxLength={150}
                />
                {renderError('contact_person')}
            </div>
            <div className={`${styles.formGroup} ${styles.short}`}>
                <label className={styles.label}>Контактный телефон</label>
                <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={handlePhoneInput}
                    className={`${styles.input} ${errors.contact_phone ? styles.inputError : ''}`}
                    required
                    pattern="\+7\d{10}"
                    maxLength={12}
                />
                {renderError('contact_phone')}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Веб-сайт</label>
                <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleTextInputChange}
                    className={`${styles.input} ${errors.website ? styles.inputError : ''}`}
                    maxLength={300}
                />
                {renderError('website')}
            </div>
        </form>
    );

    return (
        <>
            {clientType === 'natural' && renderNaturalPersonForm()}
            {clientType === 'legal' && renderLegalEntityForm()}
            <div className={styles.buttonsContainer}>
                <button className={styles.saveButton} onClick={onSubmit}>
                    Сохранить
                </button>
                <button className={styles.cancelButton} onClick={onCancel}>
                    Отмена
                </button>
            </div>
        </>
    );
};

export { SettingsForm, validateNaturalPerson, validateLegalEntity };
