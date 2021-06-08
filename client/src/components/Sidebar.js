import React from 'react'
import { NavLink } from 'react-router-dom'
import ToastComponent from '../components/Toast'
import { Home, Users, BookOpen, Box, FileText, Briefcase } from 'react-feather'

export const Sidebar = () => {
  const iconSize = 24
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
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
          {/* <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/questions"
              activeClassName="active"
            >
              <HelpCircle size={iconSize} />
              &nbsp; Вопросы
            </NavLink>
          </li> */}
          <li className="nav-item my-1">
            <NavLink className="nav-link" to="/result" activeClassName="active">
              <FileText size={iconSize} />
              &nbsp; Результаты
            </NavLink>
          </li>
        </ul>
      </div>
      <ToastComponent />
      <ToastComponent type="info" />
      <ToastComponent type="success" />
    </nav>
  )
}
