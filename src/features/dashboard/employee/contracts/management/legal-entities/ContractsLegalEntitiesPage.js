import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContractsLegalEntities.module.css";
import { downloadLegalEntitiesAsExcel } from "./services/xlsxDocumentService";
import { downloadLegalEntitiesAsDocx } from "./services/docxDocumentService";
import EditContractLegalEntiti from "./edit/EditContractLegalEntitiForm";
import ContractsLegalEntitiesForm from "./ContractsLegalEntitiesForm";

const ContractsLegalEntitiesPage = () => {
  const [contracts, setContracts] = useState([]);
  const [editingContract, setEditingContract] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTariff, setSelectedTariff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 30;

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
  
  useEffect(() => {
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
    <>
      <ContractsLegalEntitiesForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTariff={selectedTariff}
        setSelectedTariff={setSelectedTariff}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        contracts={contracts}
        selectedContracts={selectedContracts}
        handleDownload={handleDownload}
        handleDownloadDocx={handleDownloadDocx}
        paginatedContracts={paginatedContracts}
        handleCheckboxChange={handleCheckboxChange}
        setEditingContract={setEditingContract}
        editingContract={editingContract}
        renderPagination={renderPagination}
        fetchContracts={fetchContracts}
      />
      {editingContract && (
        <EditContractLegalEntiti
          contract={editingContract}
          onClose={() => setEditingContract(null)}
          onSave={() => {
            setEditingContract(null);
            fetchContracts();
          }}
        />
      )}
    </>
  );
};

export default ContractsLegalEntitiesPage;