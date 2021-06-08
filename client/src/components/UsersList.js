import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { X, Edit } from 'react-feather'
import ModalComponent from './Modal'

const UsersList = ({ deleteHandler, getPaginatedData }) => {
  const iconSize = 26

  if (!getPaginatedData().length) {
    return <p className="center">Пользователей не найдено</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">ФИО</th>
          <th scope="col">Логин</th>
          <th scope="col">E-mail</th>
          <th scope="col">Должность</th>
          <th scope="col">Организации</th>
          <th className="text-center" scope="col">
            Изменить
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((user) => {
          return (
            <tr key={user._id}>
              <td className="align-middle w-25">
                {user.lastname}&nbsp;{user.firstname}&nbsp;{user.patronymic}
              </td>
              <td className="align-middle w-10">{user.login}</td>
              <td className="align-middle w-15">{user.email}</td>
              <td className="align-middle w-20">{user.post}</td>
              <td className="align-middle w-20">
                {user.organizations.constructor === Array
                  ? user.organizations.map((organization, index) => (
                      <div key={organization.value}>
                        <Link
                          className="text-decoration-none"
                          to={`/organization/${organization.value}`}
                        >
                          {organization.label}
                        </Link>
                      </div>
                    ))
                  : user.organizations}
              </td>
              <td className="align-middle text-center w-5">
                <Link to={`/user/${user._id}`} className="btn text-primary">
                  <Edit size={iconSize} />
                </Link>
              </td>
              <td className="align-middle w-5">
                <button
                  className="btn text-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal${user._id}`}
                >
                  <X size={iconSize} />
                </button>
                <ModalComponent
                  _id={user._id}
                  from="user"
                  firstname={user.firstname}
                  lastname={user.lastname}
                  patronymic={user.patronymic}
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

UsersList.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  getPaginatedData: PropTypes.func.isRequired,
}

export default UsersList
