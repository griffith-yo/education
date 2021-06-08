import React from 'react'
import PropTypes from 'prop-types'
import Question from './Question'

const QuizCarousel = ({
  questions,
  changeCheckboxHandler,
  answeredQuestionsArr,
  onSubmitHandler,
}) => {
  return (
    <div className="w-75 mx-auto mt-5">
      <div id="quizCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {questions.map((question, index) => (
            <div
              key={question._id}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
              data-bs-interval="3600000"
            >
              <Question
                questionIndex={index}
                question={question}
                changeCheckboxHandler={changeCheckboxHandler}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary w-20"
          type="button"
          disabled={
            answeredQuestionsArr.length >= questions.length ? false : true
          }
          onClick={onSubmitHandler}
        >
          Ответить
        </button>
      </div>
    </div>
  )
}

QuizCarousel.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeCheckboxHandler: PropTypes.func.isRequired,
  answeredQuestionsArr: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
}

export default QuizCarousel
