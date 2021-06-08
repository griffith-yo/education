import React from 'react'
import PropTypes from 'prop-types'

const SubmitButton = ({
  _id,
  createHandler,
  updateHandler,
  loading,
  onClick,
  width,
  login,
  questions,
}) => {
  let buttonContent = login
    ? 'Войти'
    : questions
    ? 'Сохранить'
    : _id
    ? 'Обновить'
    : 'Создать'

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
          onClick={onClick ? onClick : _id ? updateHandler : createHandler}
          disabled={loading}
        >
          {buttonContent}
        </button>
      </div>
    </div>
  )
}

SubmitButton.propTypes = {
  _id: PropTypes.string,
  createHandler: PropTypes.func,
  updateHandler: PropTypes.func,
  onClick: PropTypes.func,
  width: PropTypes.string,
  login: PropTypes.bool,
  questions: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
}

export default SubmitButton
