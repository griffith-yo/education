import React from 'react'
import PropTypes from 'prop-types'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { Loader } from './Loader'
import { X } from 'react-feather'

const Gallery = ({ data, width, loading, window, deleteGalleryHandler }) => {
  function chunkArray(array, chunk) {
    const newArray = []
    for (let i = 0; i < array.length; i += chunk) {
      newArray.push(array.slice(i, i + chunk))
    }
    return newArray
  }

  // Создаем новый массив, который будет разбит на массивы по 4 элемента
  const chunk = chunkArray(data, width)
  const iconSize = 24
  // Выбираем ширину для картинок
  const col = Math.floor(12 / width)

  const onMouseEnter = (event) => {
    event.currentTarget.classList.remove('border-white')
    event.currentTarget.classList.add('border-dark')
    event.currentTarget.children[0].classList.remove('d-none')
  }
  const onMouseLeave = (event) => {
    event.currentTarget.classList.remove('border-dark')
    event.currentTarget.classList.add('border-white')
    event.currentTarget.children[0].classList.add('d-none')
  }

  if (loading) return <Loader />

  return (
    <div>
      {chunk.map((data, index) => {
        return (
          <div key={index} className="row">
            {data.map((item, dataIndex) => {
              return (
                <div
                  key={item.filename}
                  className={`col-md-${col} rounded border border-white border-3 p-1`}
                  onMouseEnter={deleteGalleryHandler && onMouseEnter}
                  onMouseLeave={deleteGalleryHandler && onMouseLeave}
                >
                  <button
                    type="button"
                    className="btn text-danger position-absolute d-none"
                    style={{ zIndex: 10 }}
                    onClick={() => {
                      deleteGalleryHandler(item.filename, window)
                    }}
                  >
                    <X size={iconSize} />
                  </button>
                  <figure className="figure">
                    {window === 'gallery' ? (
                      <img
                        src={`/program/${window}/${item.filename}`}
                        className="figure-img img-fluid rounded"
                        alt={item.filename}
                      />
                    ) : (
                      <button
                        className="btn"
                        data-bs-target={`#fileModal-${dataIndex}`}
                        data-bs-toggle="modal"
                        data-bs-dismiss="modal"
                      >
                        <Document file={`/program/pdf/${item.filename}`}>
                          <Page height={400} pageNumber={1} />
                        </Document>
                      </button>
                    )}
                    <figcaption className="figure-caption text-center">
                      {item.originalname}
                    </figcaption>
                  </figure>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

Gallery.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  window: PropTypes.string.isRequired,
  deleteGalleryHandler: PropTypes.func,
}

export default Gallery
