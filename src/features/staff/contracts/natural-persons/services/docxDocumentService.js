import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

export const downloadNaturalPersonsAsDocx = (contracts) => {
  const contract = contracts[0];

  const {
    id_contract,
    employee,
    application,
    face_account,
    total_cost,
    date_of_conclusion,
    date_of_termination,
    contract_terms,
  } = contract;

  const user = application.user;
  const tariff = application.tariff;
  const status = contract.status_contract;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: `Договор № ${id_contract}`, heading: "Heading1" }),
          new Paragraph(`Сотрудник: ${employee.surname} ${employee.name} ${employee.patronymic}`),
          new Paragraph(`Абонент: ${user.name} ${user.surname} ${user.patronymic}`),
          new Paragraph(`Дата рождения: ${user.date_of_birth}`),
          new Paragraph(`Пол: ${user.gender}`),
          new Paragraph(`Телефон: ${user.phone_number}`),
          new Paragraph(`Email: ${user.email || "Отсутствует"}`),
          new Paragraph(`Адрес регистрации: ${user.registration_address || "Отсутствует"}`),
          new Paragraph(`Адрес проживания: ${user.residential_address}`),
          new Paragraph(`Паспорт: ${user.passport_series} / ${user.passport_number}`),
          new Paragraph(`Тариф: ${tariff.tariff_name}, ${tariff.speed_mbps} Мбит/с`),
          new Paragraph(`Статус: ${status.status_contract_name}`),
          new Paragraph(`Дата создания заявки: ${new Date(application.date_of_creation).toLocaleDateString()}`),
          new Paragraph(`Лицевой счёт: ${face_account}`),
          new Paragraph(`Сумма: ${total_cost} ₽`),
          new Paragraph(`Дата заключения: ${new Date(date_of_conclusion).toLocaleDateString()}`),
          new Paragraph(`Дата расторжения: ${date_of_termination ? new Date(date_of_termination).toLocaleDateString() : "Отсутствует"}`),
          new Paragraph(`Условия: ${contract_terms || "Отсутствует"}`),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `Договор_ФЛ_${id_contract}.docx`);
  });
};