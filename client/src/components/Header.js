import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    auth.logout()
    history.push('/')
  }

  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3" to="/">
        EntryPoint
      </Link>
      <button
        className="navbar-toggler position-absolute d-md-none collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      {/* {auth.privileges !== '1' ? (
        <input
          className="form-control form-control-dark w-100"
          type="text"
          placeholder="Поиск"
          aria-label="Поиск"
        />
      ) : null} */}
      <div className="nav-item dropdown text-nowrap d-none d-md-block d-lg-block d-xl-block">
        <button
          className="btn btn-dark dropdown-toggle text-light"
          data-bs-toggle="dropdown"
          type="button"
          aria-expanded="false"
        >
          {auth.username}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <Link className="dropdown-item" to="/">
              Главная
            </Link>
            <Link className="dropdown-item" to="#" onClick={logoutHandler}>
              Выход
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
