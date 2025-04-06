import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { downloadLegalEntitiesAsExcel } from "./services/xlsxDocumentLegalEntitiesService";
import { downloadLegalEntitiesAsDocx } from "./services/docxDocumentLegalEntitiesService";

const ContractsLegalEntitiesPage = () => {
  const [contracts, setContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTariff, setSelectedTariff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 30;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/contracts", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        const legalContracts = response.data.filter(
          (contract) => contract.application.user.user_type === "Юридическое лицо"
        );

        setContracts(legalContracts);
      } catch (error) {
        console.error("Ошибка при загрузке договоров:", error);
      }
    };

    fetchContracts();
  }, []);

  const handleCheckboxChange = (contractId) => {
    setSelectedContracts((prevSelected) =>
      prevSelected.includes(contractId)
        ? prevSelected.filter((id) => id !== contractId)
        : [...prevSelected, contractId]
    );
  };

  const handleDownload = () => {
    const selectedData = paginatedContracts.filter((contract) =>
      selectedContracts.includes(contract.id_contract)
    );

    if (selectedData.length === 0) {
      alert("Выберите хотя бы один договор для экспорта в Excel.");
      return;
    }

    downloadLegalEntitiesAsExcel(selectedData);
  };

  const handleDownloadDocx = () => {
    const selectedData = paginatedContracts.filter((contract) =>
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

    downloadLegalEntitiesAsDocx(selectedData);
  };

  const filteredContracts = contracts.filter((contract) => {
    const query = searchQuery.toLowerCase();
    const matchesSearchQuery =
      `${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`.toLowerCase().includes(query) ||
      contract.application.user.director_full_name.toLowerCase().includes(query) ||
      contract.application.user.contact_person?.toLowerCase().includes(query) ||
      contract.application.user.phone_number.includes(query) ||
      contract.application.user.email?.toLowerCase().includes(query) ||
      contract.application.user.company_name.toLowerCase().includes(query) ||
      contract.application.user.tin.includes(query) ||
      contract.application.user.registration_number.includes(query);

    const matchesTariff = selectedTariff
      ? contract.application.tariff.tariff_name.toLowerCase() === selectedTariff.toLowerCase()
      : true;

    const matchesStatus = selectedStatus
      ? contract.status_contract.status_contract_name.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    return matchesSearchQuery && matchesTariff && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * contractsPerPage,
    currentPage * contractsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            <button onClick={() => handlePageChange(1)} className={styles["page-button"]}>
              1
            </button>
            {startPage > 2 && <span className={styles["dots"]}>...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles["dots"]}>...</span>}
            <button onClick={() => handlePageChange(totalPages)} className={styles["page-button"]}>
              {totalPages}
            </button>
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
            setCurrentPage(1);
          }}
          className={styles["search-input"]}
        />

        <select
          value={selectedTariff}
          onChange={(e) => {
            setSelectedTariff(e.target.value);
            setCurrentPage(1);
          }}
          className={styles["filter-select"]}
        >
          <option value="">Все тарифы</option>
          {contracts
            .map((contract) => contract.application.tariff.tariff_name)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((tariff, index) => (
              <option key={index} value={tariff}>
                {tariff}
              </option>
            ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className={styles["filter-select"]}
        >
          <option value="">Все статусы</option>
          {contracts
            .map((contract) => contract.status_contract.status_contract_name)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
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

      {filteredContracts.length > 0 ? (
        <>
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
                  <td>
                    {contract.date_of_termination
                      ? new Date(contract.date_of_termination).toLocaleDateString()
                      : "Отсутствует"}
                  </td>
                  <td>{contract.contract_terms || "Отсутствует"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </>
      ) : (
        <p>Нет договоров юридических лиц.</p>
      )}
    </div>
  );
};

export default ContractsLegalEntitiesPage;