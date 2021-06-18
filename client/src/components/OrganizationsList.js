import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { X, Edit } from 'react-feather'
import ModalComponent from './Modal'

const OrganizationsList = ({ deleteHandler, getPaginatedData }) => {
  const iconSize = 26

  if (!getPaginatedData().length) {
    return <p className="center">Организаций не найдено</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Наименование организации</th>
          <th scope="col">E-mail</th>
          <th scope="col">Сотрудники</th>
          <th scope="col">Группы</th>
          <th className="text-center" scope="col">
            Изменить
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {getPaginatedData().map((organization) => {
          return (
            <tr key={organization._id}>
              <td className="align-middle w-35">{organization.name}</td>
              <td className="align-middle w-10">{organization.email}</td>
              <td className="align-middle w-25">
                {organization.users.map((user, index) => {
                  return (
                    <div key={user.value}>
                      <Link
                        className="text-decoration-none"
                        to={`/group/${user.value}`}
                      >
                        {user.label}
                      </Link>
                    </div>
                  )
                })}
              </td>
              <td className="align-middle w-20">
                {organization.groups.length
                  ? organization.groups.map((group, index) => {
                      return (
                        <div key={group.value}>
                          <Link
                            className="text-decoration-none"
                            to={`/group/${group.value}`}
                          >
                            {group.label}
                          </Link>
                        </div>
                      )
                    })
                  : 'Групп нет'}
              </td>
              <td className="align-middle text-center w-5">
                <Link
                  to={`/organization/${organization._id}`}
                  className="btn text-primary"
                >
                  <Edit size={iconSize} />
                </Link>
              </td>
              <td className="align-middle text-center w-5">
                <button
                  className="btn text-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal${organization._id}`}
                >
                  <X size={iconSize} />
                </button>
                <ModalComponent
                  _id={organization._id}
                  from="organization"
                  name={organization.name}
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

OrganizationsList.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  getPaginatedData: PropTypes.func.isRequired,
}

export default OrganizationsList
