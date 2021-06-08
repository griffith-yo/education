import React from 'react'
import PropTypes from 'prop-types'
import { XOctagon } from 'react-feather'

const ToastComponent = ({ type }) => {
  const iconSize = 28

  let mainClassName =
    'toast align-items-center fixed-bottom mb-5 ms-2 text-white bg-danger toast-danger'
  let bodyClassName = 'toast-body toast-body-danger'

  if (type) {
    mainClassName = `toast align-items-center fixed-bottom mb-5 ms-2 text-white bg-${type} toast-${type}`
    bodyClassName = `toast-body toast-body-${type}`
  }

  return (
    <div
      className={mainClassName}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="m-auto ms-2">
          <XOctagon size={iconSize} />
        </div>
        <div className={bodyClassName}></div>
        <button
          type="button"
          className="btn-close me-2 m-auto btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Закрыть"
        ></button>
      </div>
    </div>
  )
}

ToastComponent.propTypes = {
  type: PropTypes.string,
}

export default ToastComponent
