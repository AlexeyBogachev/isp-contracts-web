import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const ContractManagementPage = () => {
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
        setContracts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке договоров:", error);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div className={styles["contract-management-page"]}>

      <table className={styles["contracts-table"]}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО Сотрудника</th>
            <th>Телефон абонента</th>
            <th>Email абонента</th>
            <th>Тариф</th>
            <th>Скорость (Мбит/с)</th>
            <th>Статус Договора</th>
            <th>Дата Создания Заявки</th>
            <th>Лицевой Счёт</th>
            <th>Сумма</th>
            <th>Дата Заключения</th>
            <th>Дата Расторжения</th>
            <th>Условия</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id_contract}>
              <td>{contract.id_contract}</td>
              <td>{`${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic || ''}`}</td>
              <td>{contract.application.user.phone_number}</td>
              <td>{contract.application.user.email || "Отсутствует"}</td>
              <td>{contract.application.tariff.tariff_name}</td>
              <td>{contract.application.tariff.speed_mbps} Мбит/с</td>
              <td>{contract.status_contract.status_contract_name}</td>
              <td>{new Date(contract.application.date_of_creation).toLocaleString()}</td>
              <td>{contract.face_account}</td>
              <td>{contract.total_cost} ₽</td>
              <td>{new Date(contract.date_of_conclusion).toLocaleDateString()}</td>
              <td>{contract.date_of_termination ? new Date(contract.date_of_termination).toLocaleDateString() : "Отсутствует"}</td>
              <td>{contract.contract_terms || "Отсутствует"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractManagementPage;