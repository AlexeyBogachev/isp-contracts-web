// ContractsLegalEntitiesForm.jsx
import styles from "./ContractsLegalEntities.module.css";

const ContractsLegalEntitiesForm = ({
  searchQuery,
  setSearchQuery,
  selectedTariff,
  setSelectedTariff,
  selectedStatus,
  setSelectedStatus,
  contracts,
  selectedContracts,
  handleDownload,
  handleDownloadDocx,
  paginatedContracts,
  handleCheckboxChange,
  setEditingContract,
  editingContract,
  renderPagination,
  fetchContracts,
}) => {
  return (
    <div className={styles["contract-management-legal-entities-page"]}>
      <h2>Договоры юридических лиц</h2>

      <div className={styles["filters"]}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className={styles["search-input"]}
        />

        <select
          value={selectedTariff}
          onChange={(e) => setSelectedTariff(e.target.value)}
          className={styles["filter-select"]}
        >
          <option value="">Все тарифы</option>
          {[...new Set(contracts.map(c => c.application.tariff.tariff_name))].map((tariff, index) => (
            <option key={index} value={tariff}>{tariff}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={styles["filter-select"]}
        >
          <option value="">Все статусы</option>
          {[...new Set(contracts.map(c => c.status_contract.status_contract_name))].map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className={styles["actions"]}>
        <button onClick={handleDownload} disabled={selectedContracts.length === 0} className={styles["download-button"]}>
          Скачать .xlsx
        </button>
        <button onClick={handleDownloadDocx} disabled={selectedContracts.length !== 1} className={styles["download-button"]}>
          Скачать .docx
        </button>
      </div>

      {paginatedContracts.length > 0 ? (
        <>
          <div className={styles["table-wrapper"]}>
            <table className={styles["contracts-table"]}>
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>ФИО Сотрудника</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Название компании</th>
                  <th>ИНН</th>
                  <th>ОГРН</th>
                  <th>ФИО директора</th>
                  <th>Контактное лицо</th>
                  <th>Контактный телефон</th>
                  <th>Веб-сайт</th>
                  <th>Тариф</th>
                  <th>Скорость (Мбит/с)</th>
                  <th>Статус</th>
                  <th>Дата создания заявки</th>
                  <th>Лицевой счёт</th>
                  <th>Сумма</th>
                  <th>Дата заключения</th>
                  <th>Дата расторжения</th>
                  <th>Условия</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContracts.map((contract) => (
                  <tr key={contract.id_contract}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedContracts.includes(contract.id_contract)}
                        onChange={() => handleCheckboxChange(contract.id_contract)}
                      />
                    </td>
                    <td>{contract.id_contract}</td>
                    <td>{`${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`}</td>
                    <td>{contract.application.user.phone_number}</td>
                    <td>{contract.application.user.email || "Отсутствует"}</td>
                    <td>{contract.application.user.company_name}</td>
                    <td>{contract.application.user.tin}</td>
                    <td>{contract.application.user.registration_number}</td>
                    <td>{contract.application.user.director_full_name}</td>
                    <td>{contract.application.user.contact_person || "Отсутствует"}</td>
                    <td>{contract.application.user.contact_phone}</td>
                    <td>{contract.application.user.website || "Отсутствует"}</td>
                    <td>{contract.application.tariff.tariff_name}</td>
                    <td>{contract.application.tariff.speed_mbps} Мбит/с</td>
                    <td>{contract.status_contract.status_contract_name}</td>
                    <td>{new Date(contract.application.date_of_creation).toLocaleString()}</td>
                    <td>{contract.face_account}</td>
                    <td>{contract.total_cost} ₽</td>
                    <td>{new Date(contract.date_of_conclusion).toLocaleDateString()}</td>
                    <td>{contract.date_of_termination ? new Date(contract.date_of_termination).toLocaleDateString() : "Отсутствует"}</td>
                    <td>{contract.contract_terms || "Отсутствует"}</td>
                    <td>
                      <button onClick={() => setEditingContract(contract)}>Редактировать</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      ) : (
        <p>Нет договоров юридических лиц.</p>
      )}
    </div>
  );
};

export default ContractsLegalEntitiesForm;