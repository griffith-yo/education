import React from 'react'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'
import { Packer } from 'docx'
import { Save } from 'react-feather'

const WordSaveButton = ({ data, filename }) => {
  const generate = () =>
    Packer.toBlob(data).then((blob) => {
      console.log(blob)
      saveAs(blob, filename + 'docx')
      console.log('Document created successfully')
    })
  return (
    <button
      className="btn btn-outline-primary shadow"
      type="button"
      onClick={generate}
    >
      <Save />
    </button>
  )
}

WordSaveButton.propTypes = {
  data: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
}

export default WordSaveButton
