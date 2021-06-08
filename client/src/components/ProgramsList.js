import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { X, Edit, HelpCircle } from 'react-feather'
import ModalComponent from './Modal'

const ProgramsList = ({ deleteHandler, getPaginatedData }) => {
  const iconSize = 26

  if (!getPaginatedData().length) {
    return <p className="center">Программ обучения не найдено</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Образовательное направление</th>
          <th scope="col">Название программы обучения</th>
          <th className="text-center" scope="col">
            Вопросы
          </th>
          <th className="text-center" scope="col">
            Изменить
          </th>
          <th className="text-center" scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((program) => {
          return (
            <tr key={program._id}>
              <td className="align-middle w-30">{program.edudirection}</td>
              <td className="align-middle w-55">{program.name}</td>
              <td className="align-middle text-center w-10">
                <Link
                  to={`/questions/${program._id}`}
                  className="btn text-warning"
                >
                  <HelpCircle size={iconSize} />
                </Link>
              </td>
              <td className="text-center align-middle w-10">
                <Link
                  to={`/program/${program._id}`}
                  className="btn text-primary"
                >
                  <Edit size={iconSize} />
                </Link>
              </td>
              <td className="text-center align-middle w-5">
                <button
                  className="btn text-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal${program._id}`}
                >
                  <X size={iconSize} />
                </button>
                <ModalComponent
                  _id={program._id}
                  from="program"
                  name={program.name}
                  deleteHandler={deleteHandler}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

ProgramsList.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  getPaginatedData: PropTypes.func.isRequired,
}

export default ProgramsList
