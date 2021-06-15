import {
  Document,
  Paragraph,
  TextRun,
  ShadingType,
  ImageRun,
  Header,
  Footer,
  FrameAnchorType,
  VerticalPositionAlign,
  HorizontalPositionAlign,
  convertMillimetersToTwip,
} from 'docx'
import header from '../../img/header.png'
import footer from '../../img/footer2.png'

const mainColor = '#002344'
const secondaryColor = '#2cd283'
const shadowSecondaryColor = '#19966d'

export const HEADER = {
  default: new Header({
    children: [
      new Paragraph({
        shading: {
          type: ShadingType.CLEAR,
          fill: mainColor,
        },
        frame: {
          position: {
            x: -convertMillimetersToTwip(20),
            y: -convertMillimetersToTwip(20),
          },
          width: convertMillimetersToTwip(210),
          height: convertMillimetersToTwip(10),
          anchor: {
            horizontal: FrameAnchorType.MARGIN,
            vertical: FrameAnchorType.MARGIN,
          },
          alignment: {
            x: HorizontalPositionAlign.CENTER,
            y: VerticalPositionAlign.TOP,
          },
        },
      }),
    ],
  }),
}

export const FOOTER = {
  default: new Footer({
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: footer,
            transformation: {
              width: 800,
              height: 120,
            },
          }),
        ],
        shading: {
          type: ShadingType.CLEAR,
          fill: secondaryColor,
        },
        frame: {
          position: {
            x: -convertMillimetersToTwip(20),
            y: convertMillimetersToTwip(277),
          },
          width: convertMillimetersToTwip(210),
          height: convertMillimetersToTwip(30),
          anchor: {
            horizontal: FrameAnchorType.MARGIN,
            vertical: FrameAnchorType.MARGIN,
          },
          alignment: {
            x: HorizontalPositionAlign.CENTER,
            y: VerticalPositionAlign.TOP,
          },
        },
      }),
    ],
  }),
}
