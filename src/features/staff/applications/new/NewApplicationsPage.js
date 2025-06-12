import React, { useEffect, useState } from "react";
import axios from "axios";
import NewApplicationsForm from "./NewApplicationsForm";
import styles from "./NewApplications.module.css";

const NewApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTariff, setFilterTariff] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applicationToReject, setApplicationToReject] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/applications", { withCredentials: true });
        const filteredApplications = response.data
          .filter(app => {
            const statusId = app.status_application?.id_status_application || app.id_status_application;
            return statusId === 1;
          })
          .sort((a, b) => new Date(b.date_of_creation) - new Date(a.date_of_creation));
        setApplications(filteredApplications);
      } catch (err) {
        setError("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleRejectClick = (id) => {
    setApplicationToReject(id);
    setShowConfirmModal(true);
  };

  const handleConfirmReject = async (isDelete) => {
    if (!applicationToReject) return;

    const actionType = isDelete ? "удалить" : "переместить в архив";
    const confirmAction = window.confirm(`Вы уверены, что хотите ${actionType} заявку #${applicationToReject}?`);

    if (!confirmAction) return;

    try {
      if (isDelete) {
        await axios.delete(`http://localhost:3000/api/applications/${applicationToReject}`, { withCredentials: true });
      } else {
        await axios.put(
          `http://localhost:3000/api/applications/${applicationToReject}`,
          { id_status_application: 3 },
          { withCredentials: true }
        );
      }
      setApplications(applications.filter(app => app.id_application !== applicationToReject));
    } catch (err) {
      alert("Ошибка при обработке заявки: " + err.message);
    } finally {
      setShowConfirmModal(false);
      setApplicationToReject(null);
    }
  };

  const generateFaceAccount = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const approveApplication = async (application) => {
    const confirmApprove = window.confirm("Вы уверены, что хотите одобрить заявку?");
    if (!confirmApprove) return;

    try {
      await axios.put(
        `http://localhost:3000/api/applications/${application.id_application}`,
        { id_status_application: 2 },
        { withCredentials: true }
      );

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const newContract = {
        id_status_contract: 1,
        report_card_number: application.employee.report_card_number,
        id_application: application.id_application,
        id_tariff: application.tariff.id_tariff,
        face_account: generateFaceAccount(),
        total_cost: application.tariff.price,
        date_of_conclusion: tomorrow.toISOString().split('T')[0],
      };

      await axios.post("http://localhost:3000/api/contracts", newContract, { withCredentials: true });

      setApplications(applications.filter(app => app.id_application !== application.id_application));
    } catch (err) {
      alert("Ошибка при одобрении: " + err.message);
    }
  };

  const openEditForm = (app) => {
    setSelectedApplication(app);
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const getRowColor = (date_of_creation) => {
    const createdDate = new Date(date_of_creation);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "#d4edda";
    if (diffDays <= 2) return "#fff3cd";
    return "#f8d7da";
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

  const filteredApplications = applications
    .filter(app => {
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

      return searchMatches && tariffFilterMatches;
    })
    .sort((a, b) => new Date(b.date_of_creation) - new Date(a.date_of_creation));

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles["applications-page"]}>
      <NewApplicationsForm
        applications={applications}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterTariff={filterTariff}
        setFilterTariff={setFilterTariff}
        filteredApplications={filteredApplications}
        getRowColor={getRowColor}
        openEditForm={openEditForm}
        rejectApplication={handleRejectClick}
        approveApplication={approveApplication}
        selectedApplication={selectedApplication}
        closeModal={closeModal}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        minCost={minCost}
        setMinCost={setMinCost}
        maxCost={maxCost}
        setMaxCost={setMaxCost}
      />

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Подтверждение действия</h2>
            <p>Выберите действие для заявки:</p>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleConfirmReject(true)}
              >
                Удалить
              </button>
              <button
                className={`${styles.actionButton} ${styles.archiveButton}`}
                onClick={() => handleConfirmReject(false)}
              >
                В архив
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowConfirmModal(false);
                  setApplicationToReject(null);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewApplicationsPage;