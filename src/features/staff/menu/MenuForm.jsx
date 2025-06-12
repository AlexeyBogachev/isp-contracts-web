import styles from "./Menu.module.css";

const MenuForm = ({ contracts }) => {
  const physicalContracts = contracts
    .filter((contract) => {
      try {
        return contract?.application?.user?.user_type === "Физическое лицо";
      } catch (error) {
        console.error('Ошибка при фильтрации физических лиц:', error);
        return false;
      }
    })
    .sort((a, b) => new Date(b.application?.date_of_creation) - new Date(a.application?.date_of_creation))
    .slice(-15);

  const legalContracts = contracts
    .filter((contract) => {
      try {
        return contract?.application?.user?.user_type === "Юридическое лицо";
      } catch (error) {
        console.error('Ошибка при фильтрации юридических лиц:', error);
        return false;
      }
    })
    .sort((a, b) => new Date(b.application?.date_of_creation) - new Date(a.application?.date_of_creation))
    .slice(-15);

  const renderTable = (contracts, title, isNaturalPerson) => {
    if (!contracts || contracts.length === 0) {
      return (
        <div className={styles.tableSection}>
          <h2 className={styles["menu-title"]}>{title}</h2>
          <p>Нет данных для отображения</p>
        </div>
      );
    }

    return (
      <div className={styles.tableSection}>
        <h2 className={styles["menu-title"]}>{title}</h2>
        <div className={styles.tableContainer}>
          <table className={styles["contracts-table"]}>
            <thead>
              <tr>
                <th>ID договора</th>
                <th>ID заявки</th>
                <th>ФИО Сотрудника</th>
                <th>Телефон</th>
                <th>Email</th>
                {isNaturalPerson ? (
                  <>
                    <th>ФИО абонента</th>
                    <th>Дата рождения</th>
                    <th>Пол</th>
                    <th>Адрес проживания</th>
                    <th>Адрес подключения</th>
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
                    <th>Юридический адрес</th>
                    <th>Адрес подключения</th>
                    <th>Веб-сайт</th>
                  </>
                )}
                <th>Тариф</th>
                <th>Скорость (Мбит/с)</th>
                <th>Статус</th>
                <th>Дата создания заявки</th>
                <th>Лицевой счёт</th>
                <th>Стоимость заявки (₽)</th>
                <th>Сумма</th>
                <th>Дата заключения</th>
                <th>Дата расторжения</th>
                <th>Условия</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => {
                if (!contract?.application?.user) {
                  console.warn('Пропущен контракт без данных пользователя:', contract?.id_contract);
                  return null;
                }

                const user = contract.application.user;
                const employee = contract.employee || {};
                const application = contract.application || {};
                const tariff = application.tariff || {};
                const status = contract.status_contract || {};

                return (
                  <tr key={contract.id_contract}>
                    <td>{contract.id_contract}</td>
                    <td>{contract.application.id_application}</td>
                    <td>{`${employee.surname || ''} ${employee.name || ''} ${employee.patronymic || ''}`}</td>
                    <td>{user.phone_number || 'Отсутствует'}</td>
                    <td>{user.email || 'Отсутствует'}</td>
                    {isNaturalPerson ? (
                      <>
                        <td>{`${user.name || ''} ${user.surname || ''} ${user.patronymic || ''}`}</td>
                        <td>{user.date_of_birth || 'Отсутствует'}</td>
                        <td>{user.gender || 'Отсутствует'}</td>
                        <td>{user.residential_address || 'Отсутствует'}</td>
                        <td>{application.connection_address || 'Отсутствует'}</td>
                        <td>{`${user.passport_series || ''} / ${user.passport_number || ''}`}</td>
                      </>
                    ) : (
                      <>
                        <td>{user.company_name || 'Отсутствует'}</td>
                        <td>{user.tin || 'Отсутствует'}</td>
                        <td>{user.registration_number || 'Отсутствует'}</td>
                        <td>{user.director_full_name || 'Отсутствует'}</td>
                        <td>{user.contact_person || 'Отсутствует'}</td>
                        <td>{user.contact_phone || 'Отсутствует'}</td>
                        <td>{user.legal_address || 'Отсутствует'}</td>
                        <td>{application.connection_address || 'Отсутствует'}</td>
                        <td>{user.website || 'Отсутствует'}</td>
                      </>
                    )}
                    <td>{tariff.tariff_name || 'Отсутствует'}</td>
                    <td>{tariff.speed_mbps ? `${tariff.speed_mbps} Мбит/с` : 'Отсутствует'}</td>
                    <td>{status.status_contract_name || 'Отсутствует'}</td>
                    <td>{application.date_of_creation ? new Date(application.date_of_creation).toLocaleString() : 'Отсутствует'}</td>
                    <td>{contract.face_account || 'Отсутствует'}</td>
                    <td>{application.cost_application ? `${application.cost_application} ₽` : 'Отсутствует'}</td>
                    <td>{contract.total_cost ? `${contract.total_cost} ₽` : 'Отсутствует'}</td>
                    <td>{contract.date_of_conclusion ? new Date(contract.date_of_conclusion).toLocaleDateString() : 'Отсутствует'}</td>
                    <td>{contract.date_of_termination ? new Date(contract.date_of_termination).toLocaleDateString() : 'Отсутствует'}</td>
                    <td>{contract.contract_terms || 'Отсутствует'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["menu-page"]}>
      {renderTable(physicalContracts, "Договоры физических лиц", true)}
      {renderTable(legalContracts, "Договоры юридических лиц", false)}
    </div>
  );
};

export default MenuForm;