import React from 'react'
import PropTypes from 'prop-types'
import Jumbotron from '../../../components/Jumbotron'

const Question = ({ questionIndex, question, changeCheckboxHandler }) => {
  return (
    <>
      <Jumbotron header={question.questionName}>
        <div className="list-group">
          {question.questionAnswers.map((answer, answerIndex) => (
            <label key={answerIndex} className="list-group-item">
              <input
                className="form-check-input me-1"
                type="checkbox"
                onChange={(event) =>
                  changeCheckboxHandler(event, questionIndex, answerIndex)
                }
              />
              {answer.answerName}
            </label>
          ))}
        </div>
      </Jumbotron>
      {/* <button
        type="button"
        className="btn btn-outline-primary shadow mb-4"
        // onClick={(e) => onClickAddHandler(e, questionIndex)}
      >
        Ответить
      </button> */}
    </>
  )
}

Question.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  changeCheckboxHandler: PropTypes.func.isRequired,
}

export default Question
