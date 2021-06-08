import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { X, Edit } from 'react-feather'
import ModalComponent from './Modal'
import CollapseButton from './CollapseButton'
import CollapseBody from './CollapseBody'
import Dropdown from './Dropdown'

const GroupsList = ({ deleteHandler, getPaginatedData }) => {
  const iconSize = 26

  if (!getPaginatedData().length) {
    return <p className="center">Групп не найдено</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Номер группы</th>
          <th scope="col">Программа обучения</th>
          <th className="align-middle text-center" scope="col">
            Ученики
          </th>
          <th scope="col">Преподаватель</th>
          <th scope="col">Даты обучения</th>
          <th className="text-center" scope="col">
            Изменить
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((group) => {
          return (
            <tr key={group._id}>
              <td className="align-middle w-10">{group.name}</td>
              <td className="align-middle w-25">
                {group.selectedPrograms.map((value, index) => {
                  const result = group.result.filter(
                    (res) => res.programId === value.value
                  )
                  console.log(value.value, result)
                  {
                    /* {value.labelEdudirection} */
                  }
                  return (
                    <div key={value.value}>
                      <Dropdown text={value.label} items={result} />
                    </div>
                  )
                })}
              </td>
              <td className="align-middle w-25">
                <CollapseButton
                  id={group._id}
                  length={group.selectedUsers.length}
                  text={'Раскрыть список'}
                />
                <CollapseBody id={group._id}>
                  {group.selectedUsers.map((value, index) => {
                    return (
                      <div key={value.value}>
                        {index + 1}.&nbsp;
                        <Link
                          className="text-decoration-none"
                          to={`/user/${value.value}`}
                        >
                          {value.label}
                        </Link>
                      </div>
                    )
                  })}
                </CollapseBody>
              </td>
              <td className="align-middle w-20">
                {group.selectedTeachers.map((value, index) => {
                  return (
                    <div key={value.value}>
                      {index + 1}.&nbsp;{value.label}
                    </div>
                  )
                })}
              </td>
              <td className="align-middle w-10">
                с {group.dateStart}
                <br />
                по {group.dateEnd}
              </td>
              <td className="align-middle text-center w-5">
                <Link to={`/group/${group._id}`} className="btn text-primary">
                  <Edit size={iconSize} />
                </Link>
              </td>
              <td className="align-middle text-center w-5">
                <button
                  className="btn text-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal${group._id}`}
                >
                  <X size={iconSize} />
                </button>
                <ModalComponent
                  _id={group._id}
                  from="group"
                  name={group.name}
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

GroupsList.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  getPaginatedData: PropTypes.func.isRequired,
}

export default GroupsList
