import {
  Document,
  Paragraph,
  TextRun,
  Header,
  ShadingType,
  UnderlineType,
} from 'docx'

export const detailingTemplate = (detailing) => {
  const resultString = detailing.passed ? 'Пройден' : 'Не пройден'
  const resultColor = detailing.passed ? '#d1e7dd' : '#dc3545'
  return new Document({
    sections: [
      {
        properties: {},
        headers: {
          first: new Header({
            // The first header
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: detailing.user,
                    bold: true,
                    allCaps: true,
                    break: 1,
                  }),
                ],
              }),
            ],
          }),
        },
        // children: [
        // new Paragraph({
        //   children: [
        //     new TextRun({
        //       text: detailing.user,
        //       bold: true,
        //       allCaps: true,
        //       break: 1,
        //     }),
        //   ],
        //   underline: {
        //     type: UnderlineType.DOUBLE,
        //     color: '990011',
        //   },
        //   shading: {
        //     type: ShadingType.SOLID,
        //     color: resultColor,
        //     // fill: resultColor,
        //   },
        // }),
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Группа: ',
              }),
              new TextRun({
                text: detailing.group,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Программа обучения: ',
              }),
              new TextRun({
                text: detailing.program,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Попытка: ',
              }),
              new TextRun({
                text: detailing.attempt,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Количество баллов: ',
              }),
              new TextRun({
                text: detailing.scores + '/' + detailing.scoresMax,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Результат: ',
              }),
              new TextRun({
                text: resultString,
              }),
            ],
          }),
        ],
      },
    ],
  })
}
