import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const ContractsLegalEntitiesPage = () => {
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

  return (
    <div className={styles["contract-management-legal-entities-page"]}>
      <h2>Договоры юридических лиц</h2>
      {contracts.length > 0 ? (
        <table className={styles["contracts-table"]}>
          <thead>
            <tr>
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
            {contracts.map((contract) => (
              <tr key={contract.id_contract}>
                <td>{contract.id_contract}</td>
                <td>
                  {`${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`}
                </td>
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
      ) : (
        <p>Нет договоров юридических лиц.</p>
      )}
    </div>
  );
};

export default ContractsLegalEntitiesPage;