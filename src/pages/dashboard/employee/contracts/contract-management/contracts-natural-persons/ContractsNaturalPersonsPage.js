import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { downloadNaturalPersonsAsExcel } from "./services/xlsxDocumentNaturalPersonsService";
import { downloadNaturalPersonsAsDocx } from "./services/docxDocumentNaturalPersonsService";

const ContractsNaturalPersonsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [tariffFilter, setTariffFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/contracts", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        const physicalContracts = response.data.filter(
          (contract) => contract.application.user.user_type === "Физическое лицо"
        );

        setContracts(physicalContracts);
      } catch (error) {
        console.error("Ошибка при загрузке договоров:", error);
      }
    };

    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const employeeFullName = `${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`.toLowerCase();
    const subscriberFullName = `${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`.toLowerCase();
    const phoneNumber = contract.application.user.phone_number.toLowerCase();
    const email = contract.application.user.email ? contract.application.user.email.toLowerCase() : "";
    const faceAccount = contract.face_account.toLowerCase();

    const matchesSearch =
      employeeFullName.includes(searchTerm.toLowerCase()) ||
      subscriberFullName.includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      faceAccount.includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter ? contract.application.user.gender === genderFilter : true;
    const matchesTariff = tariffFilter ? contract.application.tariff.tariff_name === tariffFilter : true;
    const matchesStatus = statusFilter ? contract.status_contract.status_contract_name === statusFilter : true;

    return matchesSearch && matchesGender && matchesTariff && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * contractsPerPage,
    currentPage * contractsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles["page-button"]} ${currentPage === i ? styles["active-page"] : ""}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles["pagination"]}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles["nav-button"]}
        >
          &lt;
        </button>
        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className={styles["page-button"]}>1</button>
            {startPage > 2 && <span className={styles["dots"]}>...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles["dots"]}>...</span>}
            <button onClick={() => handlePageChange(totalPages)} className={styles["page-button"]}>{totalPages}</button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles["nav-button"]}
        >
          &gt;
        </button>
      </div>
    );
  };

  const handleCheckboxChange = (contractId) => {
    setSelectedContracts((prevSelected) =>
      prevSelected.includes(contractId)
        ? prevSelected.filter((id) => id !== contractId)
        : [...prevSelected, contractId]
    );
  };

  const handleDownload = () => {
    const selectedData = filteredContracts.filter((contract) =>
      selectedContracts.includes(contract.id_contract)
    );
    if (selectedData.length === 0) {
      alert("Выберите хотя бы один договор для экспорта.");
      return;
    }
    downloadNaturalPersonsAsExcel(selectedData);
  };

  const handleDownloadDocx = () => {
    const selectedData = filteredContracts.filter((contract) =>
      selectedContracts.includes(contract.id_contract)
    );

    if (selectedData.length === 0) {
      alert("Выберите один договор для экспорта в Word.");
      return;
    }

    if (selectedData.length > 1) {
      alert("Выберите только один договор для экспорта в Word.");
      return;
    }

    downloadNaturalPersonsAsDocx(selectedData);
  };

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
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </>
      ) : (
        <p>Нет договоров физических лиц.</p>
      )}
    </div>
  );
};

export default ContractsNaturalPersonsPage;