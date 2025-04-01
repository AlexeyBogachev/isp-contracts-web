import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const ContractsNaturalPersonsPage = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/contracts", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
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

  return (
    <div className={styles["contract-management-natural-persons-page"]}>
      <h2>Договоры физических лиц</h2>
      {contracts.length > 0 ? (
        <table className={styles["contracts-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО Сотрудника</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>ФИО</th>
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
            {contracts.map((contract) => (
              <tr key={contract.id_contract}>
                <td>{contract.id_contract}</td>
                <td>
                  {`${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`}
                </td>
                <td>{contract.application.user.phone_number}</td>
                <td>{contract.application.user.email || "Отсутствует"}</td>
                <td>
                  {`${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`}
                </td>
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
      ) : (
        <p>Нет договоров физических лиц.</p>
      )}
    </div>
  );
};

export default ContractsNaturalPersonsPage;