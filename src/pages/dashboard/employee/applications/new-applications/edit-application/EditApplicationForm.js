import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const EditApplicationForm = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    report_card_number: "",
    id_status_application: "",
    id_tariff: "",
    date_of_creation: "",
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [tariffOptions, setTariffOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

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
      const localDate = new Date(application.date_of_creation);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      setFormData({
        report_card_number: application.report_card_number,
        id_status_application: application.id_status_application,
        id_tariff: application.id_tariff,
        date_of_creation: localDate.toISOString().split("T")[0],
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/applications/${application.id_application}`, formData, {
        withCredentials: true,
      });
      onUpdate();
      onClose();
    } catch (err) {
      alert("Ошибка при обновлении заявки: " + err.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Редактировать заявку</h2>
        <form onSubmit={handleSubmit}>
          <label>Менеджер:
            <select name="report_card_number" value={formData.report_card_number} onChange={handleChange} required>
              <option value="">Выберите сотрудника</option>
              {employeeOptions.map((employee) => (
                <option key={employee.report_card_number} value={employee.report_card_number}>
                  {employee.surname} {employee.name} {employee.patronymic}
                </option>
              ))}
            </select>
          </label>

          <label>Статус заявки:
            <select name="id_status_application" value={formData.id_status_application} onChange={handleChange} required>
              {statusOptions.map((status) => (
                <option key={status.id_status_application} value={status.id_status_application}>
                  {status.status_application_name}
                </option>
              ))}
            </select>
          </label>

          <label>Тариф:
            <select name="id_tariff" value={formData.id_tariff} onChange={handleChange} required>
              <option value="">Выберите тариф</option>
              {tariffOptions.map((tariff) => (
                <option key={tariff.id_tariff} value={tariff.id_tariff}>
                  {tariff.tariff_name}
                </option>
              ))}
            </select>
          </label>

          <label>Дата создания:
            <input type="date" name="date_of_creation" value={formData.date_of_creation} onChange={handleChange} required />
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>Сохранить</button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplicationForm;