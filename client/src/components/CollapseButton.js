import React from 'react'
import PropTypes from 'prop-types'

const CollapseButton = ({ id, length, text }) => {
  return (
    <button
      className="btn btn-outline-primary w-100 mt-3 mb-3"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={`#collapse${id}`}
      aria-expanded="false"
      aria-controls={`#collapse${id}`}
    >
      {text} ({length})
    </button>
  )
}

CollapseButton.propTypes = {
  id: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
}

export default CollapseButton
