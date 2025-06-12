import React from "react";
import styles from "./HistoryApplications.module.css";

const HistoryApplicationsForm = ({
  applications,
  searchQuery,
  setSearchQuery,
  filterTariff,
  setFilterTariff,
  filterStatus,
  setFilterStatus,
  handleReturn,
  getRowColor,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  minCost,
  setMinCost,
  maxCost,
  setMaxCost
}) => {
  const clearFilters = () => {
    setSearchQuery("");
    setFilterTariff("");
    setFilterStatus("");
    setDateFrom("");
    setDateTo("");
    setMinCost("");
    setMaxCost("");
  };

  const searchInUserDetails = (userDetails, searchLower) => {
    if (!userDetails) return false;

    if (userDetails.type === 'natural') {
      return (
        userDetails.fullName?.toLowerCase().includes(searchLower) ||
        userDetails.residentialAddress?.toLowerCase().includes(searchLower) ||
        userDetails.passportData?.toLowerCase().includes(searchLower)
      );
    } else if (userDetails.type === 'legal') {
      return (
        userDetails.companyName?.toLowerCase().includes(searchLower) ||
        userDetails.tin?.toLowerCase().includes(searchLower) ||
        userDetails.registrationNumber?.toLowerCase().includes(searchLower) ||
        userDetails.directorFullName?.toLowerCase().includes(searchLower) ||
        userDetails.contactPerson?.toLowerCase().includes(searchLower) ||
        userDetails.contactPhone?.toLowerCase().includes(searchLower) ||
        userDetails.legalAddress?.toLowerCase().includes(searchLower) ||
        userDetails.website?.toLowerCase().includes(searchLower)
      );
    }
    return false;
  };

  const filteredApplications = applications.filter(app => {
    if (!app.user) return false;

    const searchLower = searchQuery.toLowerCase();

    if (dateFrom || dateTo) {
      const appDate = new Date(app.date_of_creation);
      if (dateFrom && new Date(dateFrom) > appDate) return false;
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (toDate < appDate) return false;
      }
    }

    const cost = parseFloat(app.cost_application);
    if (minCost && cost < parseFloat(minCost)) return false;
    if (maxCost && cost > parseFloat(maxCost)) return false;

    const phoneMatch = app.user.phone_number?.toLowerCase().includes(searchLower);
    const emailMatch = app.user.email?.toLowerCase().includes(searchLower);
    const userDetailsMatch = searchInUserDetails(app.userDetails, searchLower);
    const addressMatch = app.connection_address?.toLowerCase().includes(searchLower);
    const employeeMatch = app.employee &&
      `${app.employee.surname} ${app.employee.name}`.toLowerCase().includes(searchLower);
    const costMatch = app.cost_application?.toString().includes(searchLower);
    const tariffMatch = app.tariff?.tariff_name?.toLowerCase().includes(searchLower);
    const speedMatch = app.tariff?.speed_mbps?.toString().includes(searchLower);
    const priceMatch = app.tariff?.price?.toString().includes(searchLower);
    const searchMatches = phoneMatch || emailMatch || userDetailsMatch || addressMatch ||
      employeeMatch || costMatch || tariffMatch || speedMatch || priceMatch;
    const tariffFilterMatches = filterTariff ? app.tariff?.tariff_name === filterTariff : true;
    const statusFilterMatches = filterStatus ? app.status_application?.status_application_name === filterStatus : true;

    return searchMatches && tariffFilterMatches && statusFilterMatches;
  });

  const renderUserDetails = (userDetails) => {
    if (!userDetails) return "Нет данных";

    if (userDetails.type === 'natural') {
      return (
        <div>
          <p><strong>ФИО:</strong> {userDetails.fullName}</p>
          <p><strong>Дата рождения:</strong> {new Date(userDetails.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Адрес проживания:</strong> {userDetails.residentialAddress}</p>
          <p><strong>Паспорт:</strong> {userDetails.passportData}</p>
        </div>
      );
    } else if (userDetails.type === 'legal') {
      return (
        <div>
          <p><strong>Компания:</strong> {userDetails.companyName}</p>
          <p><strong>ИНН:</strong> {userDetails.tin}</p>
          <p><strong>ОГРН:</strong> {userDetails.registrationNumber}</p>
          <p><strong>Директор:</strong> {userDetails.directorFullName}</p>
          <p><strong>Контактное лицо:</strong> {userDetails.contactPerson || 'Не указан'}</p>
          <p><strong>Контактный телефон:</strong> {userDetails.contactPhone}</p>
          <p><strong>Юр. адрес:</strong> {userDetails.legalAddress}</p>
          <p><strong>Веб-сайт:</strong> {userDetails.website || 'Не указан'}</p>
        </div>
      );
    }
    return "Тип пользователя не определен";
  };

  return (
    <div className={styles["applications-page"]}>
      <h2 className={styles["page-title"]}>История заявок</h2>

      <div className={styles.filters}>
        <div className={styles.filtersGroup}>
          <div className={styles.topFilters}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterTariff}
              onChange={(e) => setFilterTariff(e.target.value)}
            >
              <option value="">Все тарифы</option>
              {[...new Set(applications.map(app => app.tariff?.tariff_name))].filter(Boolean).map(tariff => (
                <option key={tariff} value={tariff}>{tariff}</option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Все статусы</option>
              {[...new Set(applications.map(app => app.status_application?.status_application_name))].filter(Boolean).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className={styles.dateFilters}>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="От"
              />
              <input
                type="date"
                className={styles.dateInput}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="До"
              />
            </div>
          </div>
          <div className={styles.bottomFilters}>
            <div className={styles.costFilters}>
              <input
                type="number"
                className={styles.costInput}
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                placeholder="Мин. стоимость"
                min="0"
              />
              <input
                type="number"
                className={styles.costInput}
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="Макс. стоимость"
                min="0"
              />
              <button
                className={styles.clearFiltersButton}
                onClick={clearFilters}
              >
                Очистить фильтры
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles["applications-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Менеджер</th>
              <th>Информация о клиенте</th>
              <th>Контактные данные</th>
              <th>Тариф</th>
              <th>Скорость (Мбит/с)</th>
              <th>Цена (₽)</th>
              <th>Стоимость заявки (₽)</th>
              <th>Адрес подключения</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id_application} style={{ backgroundColor: getRowColor(app) }}>
                <td><strong>#{app.id_application}</strong></td>
                <td>{app.employee?.surname} {app.employee?.name}</td>
                <td>{renderUserDetails(app.userDetails)}</td>
                <td>
                  <p><strong>Телефон:</strong> {app.user?.phone_number || 'Не указан'}</p>
                  <p><strong>Email:</strong> {app.user?.email || 'Не указан'}</p>
                </td>
                <td>{app.tariff?.tariff_name}</td>
                <td>{app.tariff?.speed_mbps}</td>
                <td>{app.tariff?.price}</td>
                <td>{app.cost_application} ₽</td>
                <td>{app.connection_address}</td>
                <td>
                  <strong>{app.status_application?.status_application_name}</strong>
                  <p>{app.status_application?.description}</p>
                </td>
                <td>{new Date(app.date_of_creation).toLocaleString()}</td>
                <td>
                  {(app.status_application?.status_application_name === "Отклонена" ||
                    app.status_application?.status_application_name === "Одобрена") && (
                      <button
                        className={styles.returnButton}
                        onClick={() => handleReturn(app.id_application)}
                      >
                        Вернуть
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryApplicationsForm;