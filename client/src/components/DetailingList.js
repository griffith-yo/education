import React from 'react'
import PropTypes from 'prop-types'
import { X, Check } from 'react-feather'

const DetailingList = ({ detailing }) => {
  const iconSize = 18
  const greenAnswer = 'list-group-item list-group-item-success'
  const redAnswer = 'list-group-item list-group-item-danger'
  const whiteAnswer = 'list-group-item'

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Номер</th>
          <th scope="col">Вопрос</th>
          <th scope="col">Результат</th>
          <th scope="col">Ответы</th>
        </tr>
      </thead>
      <tbody>
        {detailing.questions.map((question, qIndex) => {
          return (
            <tr key={question._id}>
              <td className="align-middle w-10">{qIndex + 1}</td>
              <td className="align-middle w-30">{question.questionName}</td>
              <td className="align-middle w-15">
                {question.success ? 'Верно' : 'Неверно'}
              </td>
              <td className="align-middle w-45">
                <ul className="list-group">
                  {question.questionAnswers.map((answer, aIndex) => (
                    <li
                      key={answer._id}
                      className={
                        answer.correctness
                          ? question.success
                            ? greenAnswer
                            : redAnswer
                          : whiteAnswer
                      }
                    >
                      {detailing.initialQuestions[qIndex].questionAnswers[
                        aIndex
                      ].correctness ? (
                        <Check className="text-success me-2" size={iconSize} />
                      ) : (
                        <X className="text-danger me-2" size={iconSize} />
                      )}

                      {answer.answerName}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

DetailingList.propTypes = {
  detailing: PropTypes.object.isRequired,
}

export default DetailingList
