import React from "react";
import styles from "./styles.module.css";

const EditApplicationFormContent = ({
  formData,
  statusOptions,
  tariffOptions,
  employeeOptions,
  handleChange,
  handleSubmit,
  onClose
}) => {
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

export default EditApplicationFormContent;