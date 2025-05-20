import React from "react";
import styles from "./NewApplications.module.css";
import editStyles from "./edit/EditApplication.module.css";
import EditApplicationForm from "./edit/EditApplicationForm";

const NewApplicationsForm = ({
  applications,
  searchQuery,
  setSearchQuery,
  filterTariff,
  setFilterTariff,
  filteredApplications,
  getRowColor,
  openEditForm,
  rejectApplication,
  approveApplication,
  selectedApplication,
  closeModal
}) => {
  return (
    <div className={styles["applications-page"]}>
      <h2 className={styles["page-title"]}>Новые заявки</h2>

      {selectedApplication && (
        <div className={editStyles.modalOverlay}>
          <div className={editStyles.modalContent}>
            <EditApplicationForm
              application={selectedApplication}
              onClose={closeModal}
              onUpdate={() => window.location.reload()}
            />
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className={styles.filterSelect} value={filterTariff} onChange={(e) => setFilterTariff(e.target.value)}>
          <option value="">Все тарифы</option>
          {[...new Set(applications.map(app => app.tariff.tariff_name))].map(tariff => (
            <option key={tariff} value={tariff}>{tariff}</option>
          ))}
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles["applications-table"]}>
          <thead>
            <tr>
              <th>Менеджер</th>
              <th>Телефон клиента</th>
              <th>Email клиента</th>
              <th>Тариф</th>
              <th>Скорость (Мбит/с)</th>
              <th>Цена (₽)</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id_application} style={{ backgroundColor: getRowColor(app.date_of_creation) }}>
                <td>{app.employee.surname} {app.employee.name}</td>
                <td>{app.user.phone_number}</td>
                <td>{app.user.email ? app.user.email : "Отсутствует"}</td>
                <td>{app.tariff.tariff_name}</td>
                <td>{app.tariff.speed_mbps}</td>
                <td>{app.tariff.price}</td>
                <td>
                  <strong>{app.status_application.status_application_name}</strong>
                  <p>{app.status_application.description}</p>
                </td>
                <td>{new Date(app.date_of_creation).toLocaleString()}</td>
                <td>
                  <div className={styles["action-buttons"]}>
                    <button onClick={() => approveApplication(app)} className={styles.accept}>Одобрить</button>
                    <button onClick={() => rejectApplication(app.id_application)} className={styles.reject}>Отклонить</button>
                    <button onClick={() => openEditForm(app)} className={styles.edit}>Редактировать</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewApplicationsForm;