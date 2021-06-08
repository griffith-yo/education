import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import Gallery from './Gallery'

const ModalComponent = ({
  pdf,
  from,
  lastname,
  firstname,
  patronymic,
  name,
  _id,
  data,
  loading,
  window,
  deleteGalleryHandler,
  deleteHandler,
}) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  let modalHeader = ''
  let modalBody = ''
  let modalID = ''
  let modalBodyClass = ''

  if (from) {
    switch (from) {
      case 'user':
        modalHeader = 'Удаление пользователя'
        modalBody = `Вы действительно хотите удалить: ${lastname} ${firstname} ${patronymic}?`
        modalID = `deleteModal${_id}`
        modalBodyClass = 'modal-dialog'
        break
      case 'organization':
        modalHeader = 'Удаление организации'
        modalBody = `Вы действительно хотите удалить: ${name}?`
        modalID = `deleteModal${_id}`
        modalBodyClass = 'modal-dialog'
        break
      case 'group':
        modalHeader = 'Удаление группы'
        modalBody = `Вы действительно хотите удалить: ${name}?`
        modalID = `deleteModal${_id}`
        modalBodyClass = 'modal-dialog'
        break
      case 'program':
        modalHeader = 'Удаление программы обучения'
        modalBody = `Вы действительно хотите удалить: ${name}?`
        modalID = `deleteModal${_id}`
        modalBodyClass = 'modal-dialog'
        break
      default:
        modalHeader = 'Заголовок'
        modalBody = 'Содержимое'
        modalID = '42'
        modalBodyClass = 'modal-dialog'
    }
  }

  if (data) {
    modalHeader = 'Список файлов'
    modalBody = (
      <Gallery
        data={data}
        loading={loading}
        window={window}
        deleteGalleryHandler={deleteGalleryHandler}
        width={3}
      />
    )
    modalID = _id
    modalBodyClass = 'modal-dialog modal-dialog-scrollable modal-xl'
  }

  if (pdf) {
    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages)
    }

    const onPrevPage = () => {
      setPageNumber((prev) => {
        if (prev <= 1) return prev
        return prev - 1
      })
    }
    const onNextPage = () => {
      setPageNumber((prev) => {
        if (prev >= numPages) return prev
        return prev + 1
      })
    }

    modalHeader = pdf.originalname
    modalBody = (
      <div className="row">
        <div className="d-flex justify-content-center">
          <Document
            file={`/program/pdf/${pdf.filename}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page height={1000} pageNumber={pageNumber} />
          </Document>
        </div>
        <div className="d-flex justify-content-center">
          <p>
            Страница {pageNumber} из {numPages}
          </p>
        </div>
        <div className="d-flex justify-content-center">
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              onClick={(e) => onPrevPage()}
            >
              Предыдущая
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={(e) => onNextPage()}
            >
              Следующая
            </button>
          </div>
        </div>
      </div>
    )
    modalID = _id
    modalBodyClass = 'modal-dialog modal-xl'
  }

  return (
    <div
      className="modal fade"
      id={modalID}
      tabIndex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div className={modalBodyClass}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ModalLabel">
              {modalHeader}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{modalBody}</div>
          <div className="modal-footer">
            {from ? (
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  deleteHandler(_id)
                }}
              >
                Удалить
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ModalComponent.propTypes = {
  pdf: PropTypes.object,
  from: PropTypes.string,
  lastname: PropTypes.string,
  firstname: PropTypes.string,
  patronymic: PropTypes.string,
  name: PropTypes.string,
  _id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  window: PropTypes.string,
  deleteGalleryHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
}

export default ModalComponent
