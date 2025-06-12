import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx";
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
          new TableCell({ children: [new Paragraph("ФИО абонента:")] }),
          new TableCell({ children: [new Paragraph({ text: `${user.surname} ${user.name} ${user.patronymic}`, bold: true })] }),
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
              text: "об оказании услуг связи для физических лиц",
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
              text: `${user.surname} ${user.name} ${user.patronymic}`,
              bold: true
            }),
            new TextRun(", именуемый(ая) в дальнейшем «Абонент», с другой стороны, совместно именуемые «Стороны», заключили настоящий Договор о нижеследующем:")
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
          text: "«Абонент» - физическое лицо, пользователь услугами связи, с которым заключен настоящий Договор.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Оператор» - ООО «Оптик-Телеком», оказывающее услуги связи на основании соответствующих лицензий.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "«Услуги связи» - деятельность по приему, обработке, хранению, передаче, доставке сообщений электросвязи.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "2. ПРЕДМЕТ ДОГОВОРА",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "2.1. Оператор обязуется оказывать Абоненту телематические услуги связи (далее - Услуги), а Абонент обязуется оплачивать Услуги на условиях и в порядке, предусмотренных настоящим Договором. Услуги оказываются круглосуточно, ежедневно, без перерывов, за исключением проведения необходимых профилактических и ремонтных работ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "2.2. Оператор оказывает Абоненту Услуги в соответствии с Федеральным законом «О связи», Правилами оказания телематических услуг связи, утвержденными Постановлением Правительства РФ, и условиями лицензий.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "2.3. Состав оказываемых по Договору Услуг включает в себя:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun("• предоставление доступа к сети Интернет по выбранному Абонентом тарифному плану «"),
            new TextRun({
              text: tariff.tariff_name,
              bold: true
            }),
            new TextRun("» со скоростью до "),
            new TextRun({
              text: `${tariff.speed_mbps}`,
              bold: true
            }),
            new TextRun(" Мбит/с;")
          ]
        }),
        new Paragraph({
          text: "• выделение лицевого счета для учета оказанных Услуг и поступивших платежей;",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "• предоставление возможности доступа к личному кабинету;",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "• техническую поддержку по вопросам пользования Услугами.",
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
          text: "3.1.1. Оказывать Абоненту Услуги в соответствии с законодательством РФ, лицензиями, настоящим Договором и Правилами оказания услуг.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.2. Обеспечивать качество предоставления Услуг согласно требованиям, установленным действующим законодательством РФ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.3. Вести учет потребления Услуг Абонентом с помощью своих учетных приборов.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.4. Своевременно зачислять авансовые платежи Абонента на его лицевой счет.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.5. Предоставлять Абоненту возможность доступа к личному кабинету на сайте Оператора, в котором отображается информация о потребленных Услугах и платежах.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.1.6. Обеспечивать конфиденциальность персональных данных Абонента, полученных при заключении и исполнении Договора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "3.2. Абонент обязуется:",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.1. Своевременно и в полном объеме производить оплату оказанных Оператором Услуг.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.2. Не использовать Услуги для противоправных действий, в том числе не осуществлять несанкционированный доступ к компьютерным системам, не распространять спам и вредоносное программное обеспечение.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.3. Регулярно проверять наличие уведомлений Оператора в личном кабинете и на сайте Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "3.2.4. Сообщать Оператору об изменении своих реквизитов и контактных данных.",
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
          text: "4.1.1. Единовременную плату за подключение к сети Оператора в размере " + contract.application.cost_application + " рублей;",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.1.2. Ежемесячную абонентскую плату согласно выбранному тарифному плану.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.2. Ежемесячная стоимость Услуг по настоящему Договору составляет " + total_cost + " рублей.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.3. Оплата единовременной платы за подключение производится Абонентом в момент подписания настоящего Договора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.4. Оплата Услуг производится Абонентом ежемесячно путем внесения авансового платежа до начала расчетного периода. Расчетным периодом является календарный месяц.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "4.5. Оператор вправе в одностороннем порядке изменять тарифы на Услуги, предварительно уведомив об этом Абонента не менее чем за 10 дней до введения новых тарифов через личный кабинет и путем размещения информации на сайте Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "5. ОТВЕТСТВЕННОСТЬ СТОРОН",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "5.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору Стороны несут ответственность в соответствии с действующим законодательством РФ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "5.2. Оператор не несет ответственности за содержание информации, передаваемой и получаемой Абонентом, за исключением случаев, предусмотренных законодательством РФ.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "5.3. Абонент самостоятельно обеспечивает конфиденциальность своих учетных данных и несет ответственность за все действия, совершенные с использованием его учетных данных.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "6. СРОК ДЕЙСТВИЯ И ПОРЯДОК РАСТОРЖЕНИЯ ДОГОВОРА",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "6.1. Договор вступает в силу с момента его подписания обеими Сторонами и действует неопределенный срок.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "6.2. Договор может быть расторгнут в любое время по соглашению Сторон.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "6.3. Абонент вправе в одностороннем порядке расторгнуть Договор при условии оплаты оказанных Услуг и письменного уведомления Оператора не менее чем за 30 дней до предполагаемой даты расторжения.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "6.4. Оператор вправе в одностороннем порядке расторгнуть Договор в случае нарушения Абонентом требований законодательства РФ, условий Договора и Правил оказания услуг.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "7. ПРОЧИЕ УСЛОВИЯ",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: "7.1. Все споры и разногласия решаются путем переговоров. В случае невозможности урегулирования споров путем переговоров, они передаются на рассмотрение в суд по месту нахождения Оператора.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "7.2. Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "8. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
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
            new TextRun(`${user.surname} ${user.name} ${user.patronymic}\n`),
            new TextRun(`Дата рождения: ${new Date(user.date_of_birth).toLocaleDateString()}\n`),
            new TextRun(`Паспорт: серия ${user.passport_series} номер ${user.passport_number}\n`),
            new TextRun(`Адрес регистрации: ${user.residential_address}\n`),
            new TextRun(`Телефон: ${user.phone_number}\n`),
            new TextRun(`Email: ${user.email || "не указан"}\n\n`),
            new TextRun("___________________ "),
            new TextRun({
              text: `${user.surname} ${user.name[0]}.${user.patronymic[0]}.`,
              bold: true
            })
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
    saveAs(blob, `Договор_ФЛ_${id_contract}.docx`);
  });
};