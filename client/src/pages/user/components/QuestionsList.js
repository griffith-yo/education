import React from 'react'
import PropTypes from 'prop-types'

const QuestionsList = ({
  questions,
  currentQuestion,
  setCurrentQuestion,
  answeredQuestionsArr,
}) => {
  const submitColor = {
    backgroundColor: '#ffe69c',
    borderColor: '#ffe69c',
    color: '#000',
  }
  return (
    <div className="list-group" role="tablist">
      {questions.map((question, index) => {
        return (
          <button
            key={index}
            className={`list-group-item list-group-item-action rounded-0 ${
              currentQuestion === index ? 'active' : ''
            }`}
            data-bs-target="#quizCarousel"
            style={
              answeredQuestionsArr.includes(index) && currentQuestion !== index
                ? submitColor
                : null
            }
            data-bs-slide-to={index}
            role="tab"
            onClick={(event) => setCurrentQuestion((prev) => index)}
          >
            {'Вопрос ' + (index + 1) + '. ' + question.questionName}
          </button>
        )
      })}
    </div>
  )
}

QuestionsList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object),
  currentQuestion: PropTypes.number.isRequired,
  setCurrentQuestion: PropTypes.func.isRequired,
  answeredQuestionsArr: PropTypes.arrayOf(PropTypes.number),
}

export default QuestionsList
