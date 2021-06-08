import React from 'react'
import PropTypes from 'prop-types'
import FloatingInput from './FloatingInput'

const Jumbotron = ({
  header,
  question,
  questionIndex,
  questionName,
  changeQuestionHandler,
  children,
}) => {
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <h4>{header}</h4>
      {question ? (
        <FloatingInput
          name="questionName"
          id={`Question-${questionIndex}`}
          placeholder="Введите текст вопроса"
          value={questionName}
          onChange={(e) => changeQuestionHandler(e, questionIndex)}
        />
      ) : (
        ''
      )}
      <hr />
      {children}
    </div>
  )
}

Jumbotron.defaultProps = {
  header: 'Название Jumbotron',
}

Jumbotron.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
  question: PropTypes.bool,
  questionIndex: PropTypes.number,
  questionName: PropTypes.string,
  changeQuestionHandler: PropTypes.func,
}

export default Jumbotron
