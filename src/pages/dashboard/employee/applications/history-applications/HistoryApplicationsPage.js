import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/applications", { withCredentials: true });
        setApplications(response.data);
      } catch (err) {
        setError("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleReturn = async (id) => {
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

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles["applications-page"]}>
      <h2>История заявок</h2>
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
            <tr key={app.id_application}>
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
                {(app.id_status_application === 3 || app.id_status_application === 2) && (
                  <button onClick={() => handleReturn(app.id_application)} className={styles["return-button"]}>
                    Вернуть
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsPage;