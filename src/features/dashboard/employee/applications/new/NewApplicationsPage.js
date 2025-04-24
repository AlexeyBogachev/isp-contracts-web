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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/applications", { withCredentials: true });
        const filteredApplications = response.data.filter(app => app.id_status_application === 1);
        setApplications(filteredApplications);
      } catch (err) {
        setError("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const rejectApplication = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/applications/${id}`, { id_status_application: 3 }, { withCredentials: true });
      setApplications(applications.filter(app => app.id_application !== id));
    } catch (err) {
      alert("Ошибка обновления статуса: " + err.message);
    }
  };

  const generateFaceAccount = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const approveApplication = async (application) => {
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

  const filteredApplications = applications.filter(app => {
    return (
      (app.user.phone_number.includes(searchQuery) ||
        (app.user.email && app.user.email.includes(searchQuery)) ||
        (`${app.employee.surname} ${app.employee.name}`).toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTariff ? app.tariff.tariff_name === filterTariff : true)
    );
  });

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
        rejectApplication={rejectApplication}
        approveApplication={approveApplication}
        selectedApplication={selectedApplication}
        closeModal={closeModal}
      />
    </div>
  );
};

export default NewApplicationsPage;