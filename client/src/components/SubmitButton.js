import React from 'react'
import PropTypes from 'prop-types'

const SubmitButton = ({ text, loading, onClick, width }) => {
  let buttonContent = text

  if (loading) {
    buttonContent = (
      <>
        <span
          className="spinner-grow spinner-grow-sm"
          style={{ width: '1.2rem', height: '1.2rem' }}
          role="status"
          aria-hidden="true"
        ></span>
        &nbsp;Загрузка...
      </>
    )
  }

  return (
    <div className="row">
      <div className={`${width ? width : 'col-sm-2'} mx-auto`}>
        <button
          className="btn btn-primary btn-lg w-100 shadow"
          type="button"
          onClick={onClick}
          disabled={loading}
        >
          {buttonContent}
        </button>
      </div>
    </div>
  )
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.string,
  loading: PropTypes.bool.isRequired,
}

export default SubmitButton
