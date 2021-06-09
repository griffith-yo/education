import React, { useContext } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import {
  Home,
  Users,
  BookOpen,
  Box,
  FileText,
  Briefcase,
  LogOut,
} from 'react-feather'
import ToastComponent from '../components/Toast'
import { AuthContext } from '../context/AuthContext'

export const Sidebar = () => {
  const iconSize = 24
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    auth.logout()
    history.push('/')
  }

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-secondary sidebar collapse"
    >
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item my-1">
            <NavLink
              className="nav-link"
              to="/dashboard"
              activeClassName="active"
            >
              <Home size={iconSize} />
              &nbsp;Домашняя страница
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" to="/users" activeClassName="active">
              <Users size={iconSize} />
              &nbsp; Пользователи
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink
              className="nav-link"
              to="/organizations"
              activeClassName="active"
            >
              <Briefcase size={iconSize} />
              &nbsp; Организации
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" to="/groups" activeClassName="active">
              <Box size={iconSize} />
              &nbsp; Группы
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink
              className="nav-link"
              to="/programs"
              activeClassName="active"
            >
              <BookOpen size={iconSize} />
              &nbsp; Программы обучения
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" to="/result" activeClassName="active">
              <FileText size={iconSize} />
              &nbsp; Результаты
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <Link
              className="nav-link d-md-none"
              to="#"
              activeClassName="active"
              onClick={logoutHandler}
            >
              <LogOut size={iconSize} />
              &nbsp; Выход
            </Link>
          </li>
        </ul>
      </div>
      <ToastComponent />
      <ToastComponent type="info" />
      <ToastComponent type="success" />
    </nav>
  )
}
