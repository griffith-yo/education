import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Eye } from 'react-feather'

const ResultsList = ({ getPaginatedData }) => {
  const iconSize = 26

  if (!getPaginatedData().length) {
    return <p className="center">Результаты не найдены</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Группа</th>
          <th scope="col">ФИО</th>
          <th scope="col">Программа обучения</th>
          <th scope="col">Баллы</th>
          <th scope="col">Попытки</th>
          <th scope="col">Результат</th>
          <th className="text-center" scope="col">
            Детализация
          </th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((result) => {
          return (
            <tr key={result._id}>
              <td className="align-middle w-20">{result.group.label}</td>
              <td className="align-middle w-20">{result.user.label}</td>
              <td className="align-middle w-20">{result.program.label}</td>
              <td className="align-middle w-10">
                {result.scores}/{result.scoresMax}
              </td>
              <td className="align-middle w-10">
                {result.attempt}/{result.attemptMax}
              </td>
              <td className="align-middle w-10">
                {result.passed ? 'Пройден' : 'Не пройден'}
              </td>
              <td className="align-middle text-center w-10">
                <Link
                  to={`/result/${result.groupID}/${result.programID}/${result.userID}/${result.attempt}`}
                  className="btn text-primary"
                >
                  <Eye size={iconSize} />
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

ResultsList.propTypes = {
  getPaginatedData: PropTypes.func.isRequired,
}

export default ResultsList
