import React from 'react'
import PropTypes from 'prop-types'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import Jumbotron from './Jumbotron'
import FloatingInput from './FloatingInput'

const Section = ({
  _id,
  sectionTheme,
  sectionName,
  sectionBody,
  index,
  sectionInfoChangeHandler,
  sectionBodyChangeHandler,
  onClickHandler,
}) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <Jumbotron header={`Раздел ${index + 1}`}>
          <FloatingInput
            name="sectionTheme"
            placeholder="Тема"
            onChange={(e) => sectionInfoChangeHandler(e, index)}
            value={sectionTheme}
          />
          <FloatingInput
            name="sectionName"
            placeholder="Название раздела"
            onChange={(e) => sectionInfoChangeHandler(e, index)}
            value={sectionName}
          />
          <SunEditor
            lang="ru"
            name="sectionBody"
            height="800px"
            setDefaultStyle="font-family: 'Times New Roman', Times, serif; font-size: 18px;"
            onChange={(content) => sectionBodyChangeHandler(content, index)}
            defaultValue={sectionBody}
            placeholder="Введите содержимое раздела..."
            setOptions={{
              imageGalleryUrl: `/api/program/gallery/${_id}`,
              charCounter: true,
              font: [
                'Arial',
                'Calibri',
                'Comic Sans',
                'Courier',
                'Garamond',
                'Georgia',
                'Impact',
                'Lucida Console',
                'Palatino Linotype',
                'Segoe UI',
                'Tahoma',
                'Times New Roman',
                'Trebuchet MS',
              ],
              buttonList: [
                [
                  'undo',
                  'redo',
                  'fontSize',
                  'formatBlock',
                  'paragraphStyle',
                  'blockquote',
                  'bold',
                  'underline',
                  'italic',
                  'strike',
                  'subscript',
                  'superscript',
                  'fontColor',
                  'hiliteColor',
                  'textStyle',
                  'removeFormat',
                  'outdent',
                  'indent',
                  'align',
                  'horizontalRule',
                  'list',
                  'lineHeight',
                  'table',
                  'imageGallery',
                  'link',
                  'image',
                  'video',
                  'fullScreen',
                  'showBlocks',
                  'codeView',
                ],
              ],
            }}
          />
        </Jumbotron>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary w-100 shadow mb-4"
          onClick={(e) => onClickHandler(e, index)}
        >
          Добавить раздел
        </button>
      </div>
    </div>
  )
}

Section.propTypes = {
  _id: PropTypes.string,
  sectionTheme: PropTypes.string,
  sectionName: PropTypes.string,
  sectionBody: PropTypes.string,
  index: PropTypes.number,
  sectionInfoChangeHandler: PropTypes.func,
  sectionBodyChangeHandler: PropTypes.func,
  onClickHandler: PropTypes.func,
}

export default Section
