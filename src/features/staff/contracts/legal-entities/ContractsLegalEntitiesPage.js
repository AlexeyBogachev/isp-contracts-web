import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContractsLegalEntities.module.css";
import { downloadLegalEntitiesAsExcel } from "./services/xlsxDocumentService";
import { downloadLegalEntitiesAsDocx } from "./services/docxDocumentService";
import EditContractLegalEntiti from "./edit/EditContractLegalEntitiForm";
import ContractsLegalEntitiesForm from "./ContractsLegalEntitiesForm";

const ContractsLegalEntitiesPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContract, setEditingContract] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTariff, setSelectedTariff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const contractsPerPage = 30;

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

      const legalContracts = response.data.filter(
        (contract) => contract.application.user.user_type === "Юридическое лицо"
      );

      setContracts(legalContracts);
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

  const filteredContracts = contracts.filter((contract) => {
    const searchValue = searchQuery.toLowerCase();

    const employeeFullName = `${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`.toLowerCase();
    const phoneNumber = contract.application.user.phone_number.toLowerCase();
    const email = contract.application.user.email ? contract.application.user.email.toLowerCase() : "";
    const companyName = contract.application.user.company_name.toLowerCase();
    const tin = contract.application.user.tin.toLowerCase();
    const registrationNumber = contract.application.user.registration_number.toLowerCase();
    const directorFullName = contract.application.user.director_full_name.toLowerCase();
    const contactPerson = contract.application.user.contact_person ? contract.application.user.contact_person.toLowerCase() : "";
    const contactPhone = contract.application.user.contact_phone.toLowerCase();
    const legalAddress = contract.application.user.legal_address.toLowerCase();
    const connectionAddress = contract.application.connection_address.toLowerCase();
    const faceAccount = contract.face_account.toLowerCase();

    const matchesSearchQuery = searchValue === "" ||
      employeeFullName.includes(searchValue) ||
      phoneNumber.includes(searchValue) ||
      email.includes(searchValue) ||
      companyName.includes(searchValue) ||
      tin.includes(searchValue) ||
      registrationNumber.includes(searchValue) ||
      directorFullName.includes(searchValue) ||
      contactPerson.includes(searchValue) ||
      contactPhone.includes(searchValue) ||
      legalAddress.includes(searchValue) ||
      connectionAddress.includes(searchValue) ||
      faceAccount.includes(searchValue);

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
        loading={loading}
        error={error}
        fetchContracts={fetchContracts}
        handleDeleteClick={handleDeleteClick}
        deleteModalOpen={deleteModalOpen}
        contractToDelete={contractToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
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