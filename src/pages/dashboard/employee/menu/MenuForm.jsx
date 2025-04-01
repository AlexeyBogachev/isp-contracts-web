import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const MenuForm = ({ contracts }) => {
  // Разделение договоров по типу пользователя
  const physicalContracts = contracts
    .filter((contract) => contract.application.user.user_type === "Физическое лицо")
    .slice(-15);
  const legalContracts = contracts
    .filter((contract) => contract.application.user.user_type === "Юридическое лицо")
    .slice(-15);

    const renderTable = (contracts, title, isNaturalPerson) => (
      <>
        <h2 className={styles["Menu-title"]}>{title}</h2>
        <table className={styles["contracts-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО Сотрудника</th>
              <th>Телефон</th>
              <th>Email</th>
              {isNaturalPerson ? (
                <>
                  <th>ФИО</th>
                  <th>Дата рождения</th>
                  <th>Пол</th>
                  <th>Адрес регистрации</th>
                  <th>Адрес проживания</th>
                  <th>Паспорт (Серия / Номер)</th>
                </>
              ) : (
                <>
                  <th>Название компании</th>
                  <th>ИНН</th>
                  <th>ОГРН</th>
                  <th>ФИО директора</th>
                  <th>Контактное лицо</th>
                  <th>Контактный телефон</th>
                  <th>Веб-сайт</th>
                </>
              )}
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
                {isNaturalPerson ? (
                  <>
                    <td>
                      {`${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`}
                    </td>
                    <td>{contract.application.user.date_of_birth}</td>
                    <td>{contract.application.user.gender}</td>
                    <td>{contract.application.user.registration_address || "Отсутствует"}</td>
                    <td>{contract.application.user.residential_address}</td>
                    <td>{contract.application.user.passport_series} / {contract.application.user.passport_number}</td>
                  </>
                ) : (
                  <>
                    <td>{contract.application.user.company_name}</td>
                    <td>{contract.application.user.tin}</td>
                    <td>{contract.application.user.registration_number}</td>
                    <td>{contract.application.user.director_full_name}</td>
                    <td>{contract.application.user.contact_person || "Отсутствует"}</td>
                    <td>{contract.application.user.contact_phone}</td>
                    <td>{contract.application.user.website || "Отсутствует"}</td>
                  </>
                )}
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
      </>
    );

    return (
      <div className={styles["menu-page"]}>
        <Link to="/new-applications-page">
          <button className={styles["applications-button"]}>Новые заявки</button>
        </Link>
        <Link to="/history-applications-page">
          <button className={styles["history-applications-button"]}>История заявки</button>
        </Link>
        <Link to="/contract-management-natural-persons-page">
          <button className={styles["contract-management-natural-persons-button"]}>Договоры физических лиц</button>
        </Link>
        <Link to="/contract-management-legal-entities-page">
          <button className={styles["contract-management-legal-entities-button"]}>Договоры юридических лиц</button>
        </Link>
    
        {renderTable(physicalContracts, "Договоры физических лиц", true)}
        {renderTable(legalContracts, "Договоры юридических лиц", false)}
      </div>
    );
};

export default MenuForm;