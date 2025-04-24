import EditContractNaturalPerson from "./edit/EditContractNaturalPersonForm";
import styles from "./ContractsNaturalPersons.module.css";

const ContractsNaturalPersonsForm = ({
  contracts,
  paginatedContracts,
  searchTerm,
  genderFilter,
  tariffFilter,
  statusFilter,
  selectedContracts,
  editingContract,
  setSearchTerm,
  setGenderFilter,
  setTariffFilter,
  setStatusFilter,
  handleDownload,
  handleDownloadDocx,
  handleCheckboxChange,
  setEditingContract,
  renderPagination,
  handleSave,
}) => {
  return (
    <div className={styles["contract-management-natural-persons-page"]}>
      <h2>Договоры физических лиц</h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">Пол</option>
          <option value="М">М</option>
          <option value="Ж">Ж</option>
        </select>
        <select value={tariffFilter} onChange={(e) => setTariffFilter(e.target.value)}>
          <option value="">Тариф</option>
          {[...new Set(contracts.map(contract => contract.application.tariff.tariff_name))].map(tariff => (
            <option key={tariff} value={tariff}>{tariff}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Статус</option>
          {[...new Set(contracts.map(contract => contract.status_contract.status_contract_name))].map(status => (
            <option key={status} value={status}>{status}</option>
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
                  <th>ФИО абонента</th>
                  <th>Дата рождения</th>
                  <th>Пол</th>
                  <th>Адрес регистрации</th>
                  <th>Адрес проживания</th>
                  <th>Паспорт (Серия / Номер)</th>
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
                    <td>{`${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`}</td>
                    <td>{contract.application.user.date_of_birth}</td>
                    <td>{contract.application.user.gender}</td>
                    <td>{contract.application.user.registration_address || "Отсутствует"}</td>
                    <td>{contract.application.user.residential_address}</td>
                    <td>{contract.application.user.passport_series} / {contract.application.user.passport_number}</td>
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
                      <button onClick={() => setEditingContract(contract)} title="Редактировать">
                        Редактировать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
          {editingContract && (
            <EditContractNaturalPerson
              contract={editingContract}
              onClose={() => setEditingContract(null)}
              onSave={handleSave}
            />
          )}
        </>
      ) : (
        <p>Нет договоров физических лиц.</p>
      )}
    </div>
  );
};

export default ContractsNaturalPersonsForm;