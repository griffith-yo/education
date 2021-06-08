import React from 'react'
import PropTypes from 'prop-types'
import FloatingInput from './FloatingInput'
import Jumbotron from './Jumbotron'

const Question = ({
  header,
  answers,
  questionName,
  changeAnswerHandler,
  changeQuestionHandler,
  onClickAddHandler,
  changeCheckboxHandler,
  questionIndex,
}) => {
  return (
    <>
      <Jumbotron
        header={header}
        question={true}
        questionName={questionName}
        changeQuestionHandler={changeQuestionHandler}
        questionIndex={questionIndex}
      >
        {answers.map((answer, index) => {
          let checked = answer.correctness ? 'checked' : ''
          return (
            <div
              className="form-check form-switch"
              key={answer._id ? answer._id : questionIndex + index}
            >
              <input
                className="form-check-input w-4 me-4 mt-3"
                name="correctness"
                type="checkbox"
                id={`checkbox-${questionIndex + '-' + index}`}
                checked={checked}
                onChange={(e) => changeCheckboxHandler(e, questionIndex, index)}
              />
              <label
                className="form-check-label w-95"
                htmlFor={`checkbox-${questionIndex + '-' + index}`}
              >
                <FloatingInput
                  name="answerName"
                  id={`answerName-${questionIndex + '-' + index}`}
                  placeholder={`Ответ ${index + 1}`}
                  onChange={(e) => changeAnswerHandler(e, questionIndex, index)}
                  value={answer.answerName}
                />
              </label>
            </div>
          )
        })}
      </Jumbotron>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary w-100 shadow mb-4"
        onClick={(e) => onClickAddHandler(e, questionIndex)}
      >
        Добавить вопрос
      </button>
    </>
  )
}

Question.propTypes = {
  header: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(PropTypes.object).isRequired,
  questionName: PropTypes.string.isRequired,
  changeAnswerHandler: PropTypes.func.isRequired,
  changeQuestionHandler: PropTypes.func.isRequired,
  onClickAddHandler: PropTypes.func.isRequired,
  changeCheckboxHandler: PropTypes.func.isRequired,
  questionIndex: PropTypes.number.isRequired,
}

export default Question
