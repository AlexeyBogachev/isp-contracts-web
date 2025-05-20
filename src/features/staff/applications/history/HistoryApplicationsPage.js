import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryApplicationsForm from "./HistoryApplicationsForm";

const HistoryApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTariff, setFilterTariff] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/applications", { withCredentials: true });
        const sortedApplications = response.data.sort((a, b) => new Date(b.date_of_creation) - new Date(a.date_of_creation));
        setApplications(sortedApplications);
      } catch (err) {
        setError("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleReturn = async (id) => {
    const confirmReturn = window.confirm("Вы уверены, что хотите вернуть заявку?");
    if (!confirmReturn) return;
  
    setApplications((prev) =>
      prev.map((app) =>
        app.id_application === id
          ? { ...app, id_status_application: 1, status_application: { status_application_name: "В обработке", description: "Заявка находится в обработке" } }
          : app
      )
    );
  
    try {
      await axios.put(
        `http://localhost:3000/api/applications/${id}`,
        { id_status_application: 1 },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Ошибка при возврате заявки:", err);
    }
  };

  const getRowColor = (app) => {
    if (app.status_application.status_application_name !== "В обработке") {
      return "#f5f5f5";
    }
    
    const createdDate = new Date(app.date_of_creation);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "#d4edda";
    if (diffDays <= 2) return "#fff3cd";
    return "#f8d7da";
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <HistoryApplicationsForm
      applications={applications}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filterTariff={filterTariff}
      setFilterTariff={setFilterTariff}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      handleReturn={handleReturn}
      getRowColor={getRowColor}
    />
  );
};

export default HistoryApplicationsPage;