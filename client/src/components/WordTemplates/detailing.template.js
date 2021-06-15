import {
  Document,
  Paragraph,
  TextRun,
  Header,
  Footer,
  FrameAnchorType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  ShadingType,
  UnderlineType,
  AlignmentType,
  convertMillimetersToTwip,
  HeadingLevel,
  LevelFormat,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  TextDirection,
  WidthType,
} from 'docx'
import { HEADER, FOOTER } from './blank.template'

export const detailingTemplate = (detailing) => {
  const resultString = detailing.passed ? 'Пройден' : 'Не пройден'
  const resultBackgroundColor = detailing.passed ? '#d1e7dd' : '#f8d7da'
  const resultTextColor = detailing.passed ? '#0f5132' : '#842029'

  return new Document({
    creator: 'EntryPoint',
    title: 'Detailing',
    description: 'Some detailing info about user',
    styles: {
      default: {
        heading1: {
          run: {
            size: 40,
            bold: true,
            color: resultTextColor,
          },
          paragraph: {
            spacing: {
              before: 120,
              after: 120,
              line: 320,
            },
            alignment: AlignmentType.CENTER,
            shading: {
              type: ShadingType.CLEAR,
              fill: resultBackgroundColor,
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                value: 'single',
                size: 6,
              },
            },
          },
        },
        listParagraph: {
          run: {
            color: '#FF0000',
          },
        },
      },
      paragraphStyles: [
        {
          id: 'aside',
          name: 'Aside',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 28,
          },
          paragraph: {
            spacing: {
              before: 100,
              after: 100,
              line: 300,
            },
            // indent: {
            //   left: convertInchesToTwip(0.5),
            // },
            // spacing: {
            //   line: 276,
            // },
          },
        },
        {
          id: 'tableHead',
          name: 'Table Head',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05,
            },
          },
        },
        {
          id: 'tableBody',
          name: 'Table Body',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            size: 28,
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05,
            },
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'my-crazy-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.LOWER_LETTER,
              text: '%1)',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    sections: [
      {
        headers: HEADER,
        footers: FOOTER,
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(20),
              right: convertMillimetersToTwip(10),
              bottom: convertMillimetersToTwip(40),
              left: convertMillimetersToTwip(20),
            },
          },
        },
        children: [
          new Paragraph({
            text: detailing.user,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Группа: ',
              }),
              new TextRun({
                text: detailing.group,
              }),
            ],
            style: 'aside',
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
            style: 'aside',
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
            style: 'aside',
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
            style: 'aside',
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
            style: 'aside',
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Номер', style: 'tableHead' }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Вопрос', style: 'tableHead' }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Ответ', style: 'tableHead' }),
                      // new Paragraph({}),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Результат', style: 'tableHead' }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                  }),
                ],
              }),
              ...detailing.questions.map(
                (question, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: (index + 1).toString(),
                            style: 'tableBody',
                          }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: question.questionName,
                            style: 'tableBody',
                          }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [
                          ...question.questionAnswers
                            .map((answer, index) =>
                              answer.correctness
                                ? new Paragraph({
                                    text: answer.answerName,
                                    style: 'tableBody',
                                  })
                                : ''
                            )
                            .filter(Boolean),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: question.success ? 'Верно' : 'Неверно',
                            style: 'tableBody',
                          }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ],
                  })
              ),
            ],
          }),
        ],
      },
    ],
  })
}
