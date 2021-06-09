import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({ size }) => {
  return (
    <div
      className="spinner-grow text-primary"
      role="status"
      style={{ width: size + 'rem', height: size + 'rem' }}
    >
      <span className="visually-hidden">Загрузка...</span>
    </div>
  )
}

Spinner.defaultProps = {
  size: 2,
}

Spinner.propTypes = {
  size: PropTypes.number.isRequired,
}

export default Spinner
