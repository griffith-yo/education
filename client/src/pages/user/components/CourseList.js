import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BookOpen, Play } from 'react-feather'

const CourseList = ({ getPaginatedData }) => {
  const iconSize = 26
  const greenBackground = { backgroundColor: '#d1e7dd' }

  if (!getPaginatedData().length) {
    return <p className="center">Доступы к курсам не предоставлены</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Номер группы</th>
          <th scope="col">Программа обучения</th>
          <th scope="col">Преподаватель</th>
          <th scope="col">Даты обучения</th>
          <th className="text-center" scope="col">
            Пройти обучение
          </th>
          <th className="text-center" scope="col">
            Пройти тест
          </th>
          <th className="text-center" scope="col">
            Результаты
          </th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((course) => {
          return (
            <tr key={course._id} style={course.passed ? greenBackground : null}>
              <td className="align-middle w-15">{course.group}</td>
              <td className="align-middle w-20">
                <div>{course.program}</div>
              </td>
              <td className="align-middle w-15">
                {course.teachers.map((teacher) => (
                  <div key={teacher.value}>{teacher.label}</div>
                ))}
              </td>
              <td className="align-middle w-15">
                с {course.dateStart}
                <br />
                по {course.dateEnd}
              </td>
              <td className="align-middle text-center w-15">
                <Link
                  to={`/program/${course.programID}`}
                  className="btn text-primary"
                >
                  <BookOpen size={iconSize} />
                </Link>
              </td>
              <td className="align-middle text-center w-10">
                {!(course.passed || course.attempt === course.attemptMax) ? (
                  <Link
                    to={`/quiz/${course.groupID}/${course.programID}`}
                    className="btn text-success"
                  >
                    <Play size={iconSize} />
                  </Link>
                ) : null}
              </td>
              <td className="align-middle text-center w-10">
                {course.attempt === 0
                  ? 'Нет результатов'
                  : course.passed
                  ? `Успешно ${course.attempt}/${course.attemptMax}`
                  : `Неуспешно ${course.attempt}/${course.attemptMax}`}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

CourseList.propTypes = {
  getPaginatedData: PropTypes.func.isRequired,
}

export default CourseList
