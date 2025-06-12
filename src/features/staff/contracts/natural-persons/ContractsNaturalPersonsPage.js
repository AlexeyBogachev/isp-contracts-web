import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContractsNaturalPersons.module.css";
import { downloadNaturalPersonsAsExcel } from "./services/xlsxDocumentService";
import { downloadNaturalPersonsAsDocx } from "./services/docxDocumentService";
import ContractsNaturalPersonsForm from "./ContractsNaturalPersonsForm";

const ContractsNaturalPersonsPage = () => {
  const [editingContract, setEditingContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [tariffFilter, setTariffFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const contractsPerPage = 10;

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError("Не удалось загрузить договоры: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const searchValue = searchTerm.toLowerCase();

    const employeeFullName = `${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`.toLowerCase();
    const subscriberFullName = `${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`.toLowerCase();
    const phoneNumber = contract.application.user.phone_number.toLowerCase();
    const email = contract.application.user.email ? contract.application.user.email.toLowerCase() : "";
    const residentialAddress = contract.application.user.residential_address.toLowerCase();
    const connectionAddress = contract.application.connection_address.toLowerCase();
    const passport = `${contract.application.user.passport_series} ${contract.application.user.passport_number}`.toLowerCase();
    const faceAccount = contract.face_account.toLowerCase();

    const matchesSearch = searchValue === "" ||
      employeeFullName.includes(searchValue) ||
      subscriberFullName.includes(searchValue) ||
      phoneNumber.includes(searchValue) ||
      email.includes(searchValue) ||
      residentialAddress.includes(searchValue) ||
      connectionAddress.includes(searchValue) ||
      passport.includes(searchValue) ||
      faceAccount.includes(searchValue);

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

  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/contracts/${contractToDelete.id_contract}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      setDeleteModalOpen(false);
      setContractToDelete(null);
      fetchContracts();
    } catch (error) {
      console.error("Ошибка при удалении договора:", error);
      setError("Не удалось удалить договор: " + error.message);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setContractToDelete(null);
  };

  return (
    <ContractsNaturalPersonsForm
      contracts={contracts}
      paginatedContracts={paginatedContracts}
      searchTerm={searchTerm}
      genderFilter={genderFilter}
      tariffFilter={tariffFilter}
      statusFilter={statusFilter}
      selectedContracts={selectedContracts}
      editingContract={editingContract}
      setSearchTerm={setSearchTerm}
      setGenderFilter={setGenderFilter}
      setTariffFilter={setTariffFilter}
      setStatusFilter={setStatusFilter}
      handleDownload={handleDownload}
      handleDownloadDocx={handleDownloadDocx}
      handleCheckboxChange={handleCheckboxChange}
      setEditingContract={setEditingContract}
      renderPagination={renderPagination}
      loading={loading}
      error={error}
      handleSave={() => {
        setEditingContract(null);
        fetchContracts();
      }}
      handleDeleteClick={handleDeleteClick}
      deleteModalOpen={deleteModalOpen}
      contractToDelete={contractToDelete}
      handleDeleteConfirm={handleDeleteConfirm}
      handleDeleteCancel={handleDeleteCancel}
    />
  );
};

export default ContractsNaturalPersonsPage;