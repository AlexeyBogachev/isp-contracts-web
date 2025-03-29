import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import ApplicationForm from "./edit-application/EditApplicationForm"; 

const NewApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  const handleDoubleClick = (app) => {
    setSelectedApplication(app);
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles["applications-page"]}>
      <h2>Новые заявки</h2>

      {selectedApplication && (
        <div className={styles.modal}>
          <ApplicationForm
            application={selectedApplication}
            onClose={closeModal}
            onUpdate={() => window.location.reload()}
          />
        </div>
      )}

      <table className={styles["applications-table"]}>
        <thead>
          <tr>
            <th>Менеджер</th>
            <th>Телефон клиента</th>
            <th>Email клиента</th>
            <th>Тариф</th>
            <th>Скорость (Мбит/с)</th>
            <th>Цена (₽)</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id_application} onDoubleClick={() => handleDoubleClick(app)}>
              <td>{app.employee.surname} {app.employee.name}</td>
              <td>{app.user.phone_number}</td>
              <td>{app.user.email ? app.user.email : "Отсутствует"}</td>
              <td>{app.tariff.tariff_name}</td>
              <td>{app.tariff.speed_mbps}</td>
              <td>{app.tariff.price}</td>
              <td>
                <strong>{app.status_application.status_application_name}</strong>
                <p>{app.status_application.description}</p>
              </td>
              <td>{new Date(app.date_of_creation).toLocaleString()}</td>
              <td>
                <button className={styles.accept}>Одобрить</button>
                <button onClick={() => rejectApplication(app.id_application)} className={styles.reject}>Отклонить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewApplicationsPage;