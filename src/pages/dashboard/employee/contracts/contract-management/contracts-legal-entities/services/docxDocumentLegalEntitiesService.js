import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const downloadLegalEntitiesAsDocx = async (contracts) => {
  const sections = contracts.map((contract) => {
    const {
      application: { user, tariff, date_of_creation },
      employee,
      face_account,
      total_cost,
      date_of_conclusion,
      date_of_termination,
      contract_terms,
      status_contract,
      id_contract,
    } = contract;

    const children = [
      new Paragraph({
        children: [new TextRun({ text: `Договор №${id_contract}`, bold: true, size: 28 })],
      }),
      new Paragraph(" "),
      new Paragraph(`Компания: ${user.company_name}`),
      new Paragraph(`Директор: ${user.director_full_name}`),
      new Paragraph(`Контактное лицо: ${user.contact_person || "Отсутствует"}`),
      new Paragraph(`Телефон: ${user.phone_number}`),
      new Paragraph(`Email: ${user.email || "Отсутствует"}`),
      new Paragraph(`ИНН: ${user.tin}`),
      new Paragraph(`ОГРН: ${user.registration_number}`),
      new Paragraph(`Веб-сайт: ${user.website || "Отсутствует"}`),
      new Paragraph(`Тариф: ${tariff.tariff_name} (${tariff.speed_mbps} Мбит/с)`),
      new Paragraph(
        `ФИО сотрудника: ${employee.surname} ${employee.name} ${employee.patronymic}`
      ),
      new Paragraph(`Дата создания заявки: ${new Date(date_of_creation).toLocaleDateString()}`),
      new Paragraph(`Статус: ${status_contract.status_contract_name}`),
      new Paragraph(`Лицевой счёт: ${face_account}`),
      new Paragraph(`Сумма: ${total_cost} ₽`),
      new Paragraph(`Дата заключения: ${new Date(date_of_conclusion).toLocaleDateString()}`),
      new Paragraph(
        `Дата расторжения: ${
          date_of_termination ? new Date(date_of_termination).toLocaleDateString() : "Отсутствует"
        }`
      ),
      new Paragraph(`Условия: ${contract_terms || "Отсутствует"}`),
    ];

    return { children };
  });

  const doc = new Document({ sections });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Договоры_ЮрЛиц.docx");
};