import React, { useState, useEffect } from "react";
import axios from "axios";
import EditApplicationFormContent from "./EditApplicationFormContent";

const EditApplicationForm = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    report_card_number: "",
    id_status_application: "",
    id_tariff: "",
    connection_address: "",
    cost_application: "",
    surname: "",
    name: "",
    patronymic: "",
    date_of_birth: "",
    residential_address: "",
    passport_series: "",
    passport_number: "",
    company_name: "",
    tin: "",
    registration_number: "",
    director_full_name: "",
    contact_person: "",
    contact_phone: "",
    legal_address: "",
    website: "",
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [tariffOptions, setTariffOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [userType, setUserType] = useState(null);
  const [errors, setErrors] = useState({});

  const PATTERNS = {
    name: /^[А-Яа-яЁё\s-]{2,50}$/,
    phone: /^\+7\d{10}$/,
    passport_series: /^\d{4}$/,
    passport_number: /^\d{6}$/,
    tin: /^\d{10}|\d{12}$/,
    registration_number: /^\d{13}$/,
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusResponse, tariffResponse, employeeResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/status-applications", { withCredentials: true }),
          axios.get("http://localhost:3000/api/tariffs", { withCredentials: true }),
          axios.get("http://localhost:3000/api/employees", { withCredentials: true }),
        ]);
        setStatusOptions(statusResponse.data);
        setTariffOptions(tariffResponse.data);
        setEmployeeOptions(employeeResponse.data);
      } catch (err) {
        alert("Ошибка при загрузке данных: " + err.message);
      }
    };
    fetchOptions();

    if (application) {
      const formDataToSet = {
        report_card_number: application.employee?.report_card_number?.toString() || "",
        id_status_application: (application.status_application?.id_status_application || application.id_status_application || "").toString(),
        id_tariff: (application.id_tariff || application.tariff?.id_tariff || "").toString(),
        connection_address: application.connection_address || "",
        cost_application: application.cost_application?.toString() || "",
        ...(application.userDetails?.type === 'natural' ? {
          surname: application.userDetails.fullName.split(' ')[0] || '',
          name: application.userDetails.fullName.split(' ')[1] || '',
          patronymic: application.userDetails.fullName.split(' ')[2] || '',
          date_of_birth: new Date(application.userDetails.dateOfBirth).toISOString().split('T')[0],
          residential_address: application.userDetails.residentialAddress,
          passport_series: application.userDetails.passportData.split(' ')[0] || '',
          passport_number: application.userDetails.passportData.split(' ')[1] || '',
        } : {}),
        ...(application.userDetails?.type === 'legal' ? {
          company_name: application.userDetails.companyName,
          tin: application.userDetails.tin,
          registration_number: application.userDetails.registrationNumber,
          director_full_name: application.userDetails.directorFullName,
          contact_person: application.userDetails.contactPerson,
          contact_phone: application.userDetails.contactPhone,
          legal_address: application.userDetails.legalAddress,
          website: application.userDetails.website,
        } : {})
      };
      setFormData(formDataToSet);
      setUserType(application.userDetails?.type);
    }
  }, [application]);

  const validateNaturalPerson = () => {
    const newErrors = {};

    if (!formData.surname.trim()) {
      newErrors.surname = 'Фамилия обязательна';
    } else if (!PATTERNS.name.test(formData.surname)) {
      newErrors.surname = 'Фамилия должна содержать только русские буквы, дефис и пробелы (2-50 символов)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (!PATTERNS.name.test(formData.name)) {
      newErrors.name = 'Имя должно содержать только русские буквы, дефис и пробелы (2-50 символов)';
    }

    if (formData.patronymic && !PATTERNS.name.test(formData.patronymic)) {
      newErrors.patronymic = 'Отчество должно содержать только русские буквы, дефис и пробелы (2-50 символов)';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Дата рождения обязательна';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 120) {
        newErrors.date_of_birth = 'Возраст должен быть от 18 до 120 лет';
      }
    }

    if (!formData.residential_address.trim()) {
      newErrors.residential_address = 'Адрес проживания обязателен';
    }

    if (!PATTERNS.passport_series.test(formData.passport_series)) {
      newErrors.passport_series = 'Серия паспорта должна состоять из 4 цифр';
    }
    if (!PATTERNS.passport_number.test(formData.passport_number)) {
      newErrors.passport_number = 'Номер паспорта должен состоять из 6 цифр';
    }

    return newErrors;
  };

  const validateLegalEntity = () => {
    const newErrors = {};

    if (!formData.company_name || !formData.company_name.trim()) {
      newErrors.company_name = 'Название компании обязательно';
    }

    if (!PATTERNS.tin.test(formData.tin)) {
      newErrors.tin = 'ИНН должен состоять из 10 или 12 цифр';
    }

    if (!PATTERNS.registration_number.test(formData.registration_number)) {
      newErrors.registration_number = 'ОГРН должен состоять из 13 цифр';
    }

    if (!formData.director_full_name || !formData.director_full_name.trim()) {
      newErrors.director_full_name = 'ФИО директора обязательно';
    } else if (!PATTERNS.name.test(formData.director_full_name.replace(/\s+/g, ''))) {
      newErrors.director_full_name = 'ФИО директора должно содержать только русские буквы';
    }

    if (!PATTERNS.phone.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Телефон должен быть в формате +7XXXXXXXXXX';
    }

    if (!formData.legal_address || !formData.legal_address.trim()) {
      newErrors.legal_address = 'Юридический адрес обязателен';
    }

    if (formData.website && !formData.website.trim().startsWith('http')) {
      newErrors.website = 'URL должен начинаться с http:// или https://';
    }

    return newErrors;
  };

  const validateCommonFields = () => {
    const newErrors = {};

    if (!formData.report_card_number) {
      newErrors.report_card_number = 'Выберите менеджера';
    }

    if (!formData.id_status_application) {
      newErrors.id_status_application = 'Выберите статус заявки';
    }

    if (!formData.id_tariff) {
      newErrors.id_tariff = 'Выберите тариф';
    }

    if (!formData.connection_address.trim()) {
      newErrors.connection_address = 'Адрес подключения обязателен';
    }

    if (!formData.cost_application) {
      newErrors.cost_application = 'Стоимость заявки обязательна';
    } else if (parseFloat(formData.cost_application) < 0) {
      newErrors.cost_application = 'Стоимость не может быть отрицательной';
    } else if (formData.cost_application.replace(/\D/g, '').length > 8) {
      newErrors.cost_application = 'Стоимость не может превышать 8 цифр';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (['surname', 'name', 'patronymic'].includes(name)) {
      formattedValue = capitalizeFirstLetter(value);
    } else if (name === 'contact_phone' && !value.startsWith('+7')) {
      formattedValue = '+7' + value.replace(/[^\d]/g, '').slice(0, 10);
    } else if (name === 'cost_application') {
      formattedValue = value.replace(/[^\d.]/g, '');
      const numericLength = formattedValue.replace(/\D/g, '').length;
      if (numericLength > 8) {
        setErrors(prev => ({
          ...prev,
          cost_application: 'Стоимость не может превышать 8 цифр'
        }));
        return;
      }
      if (formattedValue && !isNaN(formattedValue)) {
        formattedValue = parseFloat(formattedValue).toString();
      }
    }

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateFaceAccount = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commonErrors = validateCommonFields();

    const specificErrors = userType === 'natural'
      ? validateNaturalPerson()
      : validateLegalEntity();

    const allErrors = { ...commonErrors, ...specificErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/applications/${application.id_application}`, {
        report_card_number: formData.report_card_number,
        id_status_application: formData.id_status_application,
        id_tariff: formData.id_tariff,
        connection_address: formData.connection_address,
        cost_application: parseFloat(formData.cost_application)
      }, { withCredentials: true });

      if (response.data) {
        const updatedData = response.data;
        setFormData(prev => ({
          ...prev,
          cost_application: updatedData.cost_application?.toString() || prev.cost_application
        }));
      }

      if (userType === 'natural') {
        await axios.put(`http://localhost:3000/api/natural-persons/${application.id_user}`, {
          surname: formData.surname,
          name: formData.name,
          patronymic: formData.patronymic,
          date_of_birth: formData.date_of_birth,
          residential_address: formData.residential_address,
          passport_series: formData.passport_series,
          passport_number: formData.passport_number
        }, { withCredentials: true });
      } else if (userType === 'legal') {
        await axios.put(`http://localhost:3000/api/legal-entities/${application.id_user}`, {
          name: formData.company_name,
          tin: formData.tin,
          registration_number: formData.registration_number,
          director_full_name: formData.director_full_name,
          contact_person: formData.contact_person,
          contact_phone: formData.contact_phone,
          legal_address: formData.legal_address,
          website: formData.website
        }, { withCredentials: true });
      }

      if (formData.id_status_application === "2") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const newContract = {
          id_status_contract: 1,
          report_card_number: formData.report_card_number,
          id_application: application.id_application,
          id_tariff: formData.id_tariff,
          face_account: generateFaceAccount(),
          total_cost: formData.cost_application,
          date_of_conclusion: tomorrow.toISOString().split('T')[0],
        };

        await axios.post("http://localhost:3000/api/contracts", newContract, { withCredentials: true });
      }

      onUpdate();
      onClose();
    } catch (err) {
      alert("Ошибка при обновлении данных: " + err.message);
    }
  };

  return (
    <EditApplicationFormContent
      formData={formData}
      statusOptions={statusOptions}
      tariffOptions={tariffOptions}
      employeeOptions={employeeOptions}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onClose={onClose}
      userType={userType}
      errors={errors}
    />
  );
};

export default EditApplicationForm;