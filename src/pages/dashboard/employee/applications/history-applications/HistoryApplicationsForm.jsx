import React from "react";
import styles from "./styles.module.css";

const HistoryApplicationsForm = ({
  applications,
  searchQuery,
  setSearchQuery,
  filterTariff,
  setFilterTariff,
  filterStatus,
  setFilterStatus,
  handleReturn,
  getRowColor
}) => {
  const filteredApplications = applications.filter(app => {
    return (
      (app.user.phone_number.includes(searchQuery) ||
        (app.user.email && app.user.email.includes(searchQuery)) ||
        (`${app.employee.surname} ${app.employee.name}`).toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTariff ? app.tariff.tariff_name === filterTariff : true) &&
      (filterStatus ? app.status_application.status_application_name === filterStatus : true)
    );
  });

  return (
    <div className={styles["applications-page"]}>
      <h2>История заявок</h2>
      
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filterTariff} onChange={(e) => setFilterTariff(e.target.value)}>
          <option value="">Все тарифы</option>
          {[...new Set(applications.map(app => app.tariff.tariff_name))].map(tariff => (
            <option key={tariff} value={tariff}>{tariff}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {[...new Set(applications.map(app => app.status_application.status_application_name))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

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
            <tr key={app.id_application} style={{ backgroundColor: getRowColor(app) }}>
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
                {(app.id_status_application === 3 || app.id_status_application === 2) && (
                  <button onClick={() => handleReturn(app.id_application)} className={styles["return-button"]}>
                    Вернуть
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryApplicationsForm;