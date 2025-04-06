import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const downloadNaturalPersonsAsExcel = async (contracts) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Договоры");

  const header = [
    "ID", "ФИО Сотрудника", "Телефон", "Email", "ФИО абонента", "Дата рождения", "Пол",
    "Адрес регистрации", "Адрес проживания", "Паспорт (Серия / Номер)", "Тариф", "Скорость (Мбит/с)",
    "Статус", "Дата создания заявки", "Лицевой счёт", "Сумма", "Дата заключения", "Дата расторжения", "Условия"
  ];

  const headerRow = worksheet.addRow(header);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  contracts.forEach(contract => {
    const row = worksheet.addRow([
      contract.id_contract,
      `${contract.employee.surname} ${contract.employee.name} ${contract.employee.patronymic}`,
      contract.application.user.phone_number,
      contract.application.user.email || "Отсутствует",
      `${contract.application.user.name} ${contract.application.user.surname} ${contract.application.user.patronymic}`,
      contract.application.user.date_of_birth,
      contract.application.user.gender,
      contract.application.user.registration_address || "Отсутствует",
      contract.application.user.residential_address,
      `${contract.application.user.passport_series} / ${contract.application.user.passport_number}`,
      contract.application.tariff.tariff_name,
      contract.application.tariff.speed_mbps,
      contract.status_contract.status_contract_name,
      new Date(contract.application.date_of_creation).toLocaleString(),
      contract.face_account,
      contract.total_cost,
      new Date(contract.date_of_conclusion).toLocaleDateString(),
      contract.date_of_termination ? new Date(contract.date_of_termination).toLocaleDateString() : "Отсутствует",
      contract.contract_terms || "Отсутствует"
    ]);

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength + 4;
  });

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, "contracts_natural_persons.xlsx");
};