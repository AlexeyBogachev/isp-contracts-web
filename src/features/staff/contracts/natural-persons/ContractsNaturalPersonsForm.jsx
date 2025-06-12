import EditContractNaturalPerson from "./edit/EditContractNaturalPersonForm";
import styles from "./ContractsNaturalPersons.module.css";
import { formatDate } from "../../../../shared/utils/dateUtils";

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
  loading,
  error,
  handleDeleteClick,
  deleteModalOpen,
  contractToDelete,
  handleDeleteConfirm,
  handleDeleteCancel,
}) => {
  if (loading) {
    return (
      <div className={styles["contract-management-natural-persons-page"]}>
        <h2>Договоры физических лиц</h2>
        <div className={styles.loading}>Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["contract-management-natural-persons-page"]}>
        <h2>Договоры физических лиц</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles["contract-management-natural-persons-page"]}>
      <h2>Договоры физических лиц</h2>

      {deleteModalOpen && contractToDelete && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <h3 className={styles["modal-title"]}>Подтверждение удаления</h3>
            <p className={styles["modal-text"]}>
              Вы действительно хотите удалить договор #{contractToDelete.id_contract}?
              Это действие нельзя будет отменить.
            </p>
            <div className={styles["modal-buttons"]}>
              <button className={styles["modal-cancel"]} onClick={handleDeleteCancel}>
                Отмена
              </button>
              <button className={styles["modal-confirm"]} onClick={handleDeleteConfirm}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles['search-input']}
        />
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className={styles['filter-select']}>
          <option value="">Пол</option>
          <option value="М">М</option>
          <option value="Ж">Ж</option>
        </select>
        <select value={tariffFilter} onChange={(e) => setTariffFilter(e.target.value)} className={styles['filter-select']}>
          <option value="">Тариф</option>
          {[...new Set(contracts.map(contract => contract.application.tariff.tariff_name))].map(tariff => (
            <option key={tariff} value={tariff}>{tariff}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles['filter-select']}>
          <option value="">Статус</option>
          {[...new Set(contracts.map(contract => contract.status_contract.status_contract_name))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
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
                  <th>ID договора</th>
                  <th>ID заявки</th>
                  <th>ФИО Сотрудника</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>ФИО абонента</th>
                  <th>Дата рождения</th>
                  <th>Пол</th>
                  <th>Адрес проживания</th>
                  <th>Адрес подключения</th>
                  <th>Паспорт (Серия / Номер)</th>
                  <th>Тариф</th>
                  <th>Скорость (Мбит/с)</th>
                  <th>Статус</th>
                  <th>Дата создания заявки</th>
                  <th>Лицевой счёт</th>
                  <th>Стоимость заявки (₽)</th>
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
                    <td>{contract.application.id_application}</td>
                    <td>{`${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`}</td>
                    <td>{contract.application.user.phone_number}</td>
                    <td>{contract.application.user.email || "Отсутствует"}</td>
                    <td>{`${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`}</td>
                    <td>{formatDate(contract.application.user.date_of_birth)}</td>
                    <td>{contract.application.user.gender}</td>
                    <td>{contract.application.user.residential_address}</td>
                    <td>{contract.application.connection_address}</td>
                    <td>{contract.application.user.passport_series} / {contract.application.user.passport_number}</td>
                    <td>{contract.application.tariff.tariff_name}</td>
                    <td>{contract.application.tariff.speed_mbps} Мбит/с</td>
                    <td>{contract.status_contract.status_contract_name}</td>
                    <td>{new Date(contract.application.date_of_creation).toLocaleString()}</td>
                    <td>{contract.face_account}</td>
                    <td>{contract.application.cost_application} ₽</td>
                    <td>{contract.total_cost} ₽</td>
                    <td>{new Date(contract.date_of_conclusion).toLocaleDateString()}</td>
                    <td>{contract.date_of_termination ? new Date(contract.date_of_termination).toLocaleDateString() : "Отсутствует"}</td>
                    <td>{contract.contract_terms || "Отсутствует"}</td>
                    <td>
                      <div className={styles["action-buttons"]}>
                        <button onClick={() => setEditingContract(contract)} title="Редактировать" className={styles["edit-button"]}>
                          Редактировать
                        </button>
                        <button onClick={() => handleDeleteClick(contract)} className={styles["delete-button"]}>
                          Удалить
                        </button>
                      </div>
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