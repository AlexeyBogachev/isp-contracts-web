import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export const downloadLegalEntitiesAsDocx = (contracts) => {
  const contract = contracts[0];

  const {
    id_contract,
    employee,
    application,
    face_account,
    total_cost,
    date_of_conclusion,
    contract_terms,
  } = contract;

  const user = application.user;
  const tariff = application.tariff;

  const infoTable = new Table({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "ОСНОВНАЯ ИНФОРМАЦИЯ О ДОГОВОРЕ", size: 28 })],
            columnSpan: 2,
            shading: { fill: "E5E5E5" }
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Номер договора:")] }),
          new TableCell({ children: [new Paragraph({ text: id_contract.toString(), bold: true })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Наименование организации:")] }),
          new TableCell({ children: [new Paragraph({ text: user.company_name, bold: true })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("ИНН/ОГРН:")] }),
          new TableCell({ children: [new Paragraph({ text: `${user.tin} / ${user.registration_number}`, bold: true })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Тарифный план:")] }),
          new TableCell({ children: [new Paragraph({ text: `${tariff.tariff_name} (${tariff.speed_mbps} Мбит/с)`, bold: true })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Стоимость услуг:")] }),
          new TableCell({ children: [new Paragraph({ text: `${total_cost} руб./мес.`, bold: true })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Лицевой счет:")] }),
          new TableCell({ children: [new Paragraph({ text: face_account, bold: true })] }),
        ],
      }),
    ],
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 28,
            font: "Times New Roman",
          },
        },
      },
    },
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `ДОГОВОР № ${id_contract}`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "об оказании услуг связи для юридических лиц",
                size: 32,
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `г. Чехов,  ${new Date(date_of_conclusion).toLocaleDateString()}`,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun("Общество с ограниченной ответственностью «Оптик-Телеком», именуемое в дальнейшем «Оператор», в лице "),
            new TextRun({
              text: `${employee.surname} ${employee.name} ${employee.patronymic}`,
              bold: true
            }),
            new TextRun(", действующего на основании доверенности, с одной стороны, и "),
            new TextRun({
              text: user.company_name,
              bold: true
            }),
            new TextRun(", в лице "),
            new TextRun({
              text: user.director_full_name,
              bold: true
            }),
            new TextRun(", действующего на основании Устава, именуемое в дальнейшем «Абонент», с другой стороны, совместно именуемые «Стороны», заключили настоящий Договор о нижеследующем:")
          ]
        }),
        infoTable,
        new Paragraph({
          text: "1. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 300 }
        }),
        new Paragraph({
          text: "1.1. В настоящем Договоре используются следующие термины и определения:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Абонент» - юридическое лицо, с которым заключен настоящий Договор об оказании услуг связи.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Оператор» - ООО «Оптик-Телеком», оказывающее услуги связи на основании соответствующих лицензий.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Услуги связи» - деятельность по приему, обработке, хранению, передаче и доставке сообщений электросвязи.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Тарифный план» - совокупность ценовых и иных условий, на которых Оператор предлагает пользоваться услугами связи.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "2. ПРЕДМЕТ ДОГОВОРА",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "2.1. Оператор обязуется оказывать Абоненту телематические услуги связи (далее - Услуги), а Абонент обязуется принимать и оплачивать Услуги в соответствии с условиями настоящего Договора и действующими тарифами Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "2.2. Услуги оказываются на основании лицензий Оператора:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "- Лицензия № 12345 на оказание телематических услуг связи от 01.01.2023;",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "2.3. Адрес предоставления Услуг: " + application.connection_address,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "3. ПРАВА И ОБЯЗАННОСТИ СТОРОН",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "3.1. Оператор обязуется:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.1. Оказывать Абоненту Услуги в соответствии с законодательством РФ, лицензиями, настоящим Договором и действующими Правилами оказания услуг связи 24 часа в сутки, 7 дней в неделю, за исключением перерывов для проведения необходимых профилактических и ремонтных работ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.2. Предоставить Абоненту доступ к личному кабинету для контроля состояния лицевого счета и управления Услугами.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.3. Обеспечить конфиденциальность информации об Абоненте в соответствии с требованиями законодательства РФ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2. Абонент обязуется:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.1. Своевременно и в полном объеме производить оплату Услуг в соответствии с условиями настоящего Договора и выбранным тарифным планом.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.2. Обеспечить доступ персонала Оператора в помещения Абонента для проведения установочных и эксплуатационных работ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.3. Использовать только сертифицированное оборудование для подключения к сети Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "4. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЕТОВ",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "4.1. Стоимость Услуг включает в себя:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.1.1. Единовременную плату за организацию доступа к Услугам (стоимость подключения), которая составляет " + contract.application.cost_application + " рублей, в том числе НДС 20%;",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.1.2. Ежемесячную абонентскую плату за пользование Услугами согласно выбранному тарифному плану.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.2. Ежемесячная стоимость Услуг по настоящему Договору составляет " + total_cost + " рублей, в том числе НДС 20%.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.3. Оплата единовременной платы за организацию доступа к Услугам производится Абонентом в течение 5 (пяти) банковских дней с момента подписания настоящего Договора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.4. Оплата ежемесячных платежей производится Абонентом путем безналичного перечисления денежных средств на расчетный счет Оператора не позднее 20 числа месяца, следующего за расчетным.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.5. Основанием для оплаты являются счета, счета-фактуры и акты выполненных работ, направляемые Оператором Абоненту ежемесячно до 5 числа месяца, следующего за расчетным.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "5. ОТВЕТСТВЕННОСТЬ СТОРОН",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "5.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору Стороны несут ответственность в соответствии с действующим законодательством РФ и настоящим Договором.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "5.2. В случае просрочки оплаты Услуг Оператор вправе потребовать от Абонента уплаты пени в размере 0,1% от суммы задолженности за каждый день просрочки.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "5.3. В случае перерывов в предоставлении Услуг по вине Оператора, превышающих 24 часа, Оператор производит перерасчет абонентской платы.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "6. ФОРС-МАЖОР",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "6.1. Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств по настоящему Договору, если это неисполнение явилось следствием обстоятельств непреодолимой силы.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "6.2. При наступлении обстоятельств непреодолимой силы Сторона должна без промедления известить о них в письменном виде другую Сторону.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "7. СРОК ДЕЙСТВИЯ И ПОРЯДОК РАСТОРЖЕНИЯ ДОГОВОРА",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "7.1. Договор вступает в силу с момента его подписания обеими Сторонами и действует неопределенный срок.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "7.2. Договор может быть расторгнут в любое время по соглашению Сторон.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "7.3. Абонент вправе в одностороннем порядке расторгнуть Договор при условии оплаты оказанных Услуг и письменного уведомления Оператора не менее чем за 30 дней до предполагаемой даты расторжения.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "8. ПРОЧИЕ УСЛОВИЯ",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "8.1. Все споры и разногласия решаются путем переговоров. В случае невозможности урегулирования споров путем переговоров, они передаются на рассмотрение в Арбитражный суд по месту нахождения Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "8.2. Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "8.3. Любые изменения и дополнения к настоящему Договору действительны при условии, если они совершены в письменной форме и подписаны уполномоченными представителями Сторон.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "9. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 300 }
        }),
        new Paragraph({
          text: "Оператор:",
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun("ООО «Оптик-Телеком»\n"),
            new TextRun("ИНН: 5048057574\n"),
            new TextRun("ОГРН: 1155048000027\n"),
            new TextRun("Юридический адрес: 142300, Московская область, г. Чехов, ул. Дружбы, д. 2А\n"),
            new TextRun("Телефон: +7 (496) 726-89-00\n"),
            new TextRun("Email: info@optic-telecom.ru\n\n"),
            new TextRun("Представитель по доверенности\n\n"),
            new TextRun("___________________ "),
            new TextRun({
              text: `${employee.surname} ${employee.name[0]}.${employee.patronymic[0]}.`,
              bold: true
            }),
            new TextRun("\n\n"),
            new TextRun("М.П.", { bold: true })
          ],
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "Абонент:",
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun(`${user.company_name}\n`),
            new TextRun(`ИНН: ${user.tin}\n`),
            new TextRun(`ОГРН: ${user.registration_number}\n`),
            new TextRun(`Юридический адрес: ${user.legal_address}\n`),
            new TextRun(`Телефон: ${user.phone_number}\n`),
            new TextRun(`Email: ${user.email || "не указан"}\n\n`),
            new TextRun("Директор\n\n"),
            new TextRun("___________________ "),
            new TextRun({
              text: user.director_full_name,
              bold: true
            }),
            new TextRun("\n\n"),
            new TextRun("М.П.", { bold: true })
          ],
          spacing: { after: 300 }
        }),
        contract_terms && new Paragraph({
          text: `Особые условия: ${contract_terms}`,
          italic: true
        })
      ].filter(Boolean)
    }]
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `Договор_ЮЛ_${id_contract}.docx`);
  });
};