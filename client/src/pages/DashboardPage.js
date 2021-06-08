import React, { useState, useCallback } from 'react'
import SidebarPageBody from '../components/SidebarPageBody'
import Jumbotron from '../components/Jumbotron'
import { Eye, HelpCircle } from 'react-feather'
import { Link } from 'react-router-dom'

export const DashboardPage = () => {
  const iconSize = 20
  const [data, setData] = useState({
    users: 0,
    organizations: 0,
    groups: 0,
    programs: 0,
    results: 0,
    edudirections: 0,
  })

  const dashboardInfo = useCallback((fetched) => {
    setData((prev) => fetched)
  }, [])

  return (
    <SidebarPageBody
      header="Домашняя страница"
      target="dashboard"
      dashboardInfo={dashboardInfo}
    >
      <div className="row">
        <div className="col-sm-6">
          <Jumbotron header="Добро пожаловать">
            <p>
              Для начала работы, вы можете{' '}
              <Link className="text-decoration-none" to="create/user">
                добавить пользователя
              </Link>
              .
            </p>
            <p>
              Затем привязать пользователя к организации{' '}
              <Link className="text-decoration-none" to="create/organization">
                создав ее
              </Link>
              .
            </p>
            <p>
              Следующим шагом является{' '}
              <Link className="text-decoration-none" to="create/program">
                создание программы обучения
              </Link>{' '}
              и комплекса вопросов к ней{' '}
              <span className="fst-italic">
                (прим. доступ к созданию комплекса вопросов в списке программ
                обучения по иконке{' '}
                <HelpCircle className="text-warning" size={iconSize} />{' '}
                открывается только после добавления самой программы обучения)
              </span>
            </p>
            <p>
              Для предоставления доступа пользователям к курсам Вам необходимо{' '}
              <Link className="text-decoration-none" to="create/group">
                создать группу
              </Link>
              , включить в нее необходимых пользователей и выставить корректный
              временной интервал. По истечению временного интервала доступ к
              программам обучения будет прекращен.
            </p>
            <p>
              Результаты тестирования пользователей вы можете просмотреть{' '}
              <Link className="text-decoration-none" to="result">
                тут
              </Link>
              . По иконке <Eye className="text-primary" size={iconSize} /> в
              списке результатов вы можете просмотреть детализацию ответов
              пользователя и распечатать в формате pdf.
            </p>
          </Jumbotron>
        </div>
        <div className="col-sm-6">
          <Jumbotron header="Информация о системе">
            Универсальная система дистанционного образования создана с помощью:
            ReactJS версии {React.version}
          </Jumbotron>
          <Jumbotron header="Статистика">
            Пользователей: {data.users} <br />
            Организаций: {data.organizations} <br />
            Групп: {data.groups} <br />
            Программ обучения: {data.programs} <br />
            Направлений обучения: {data.edudirections} <br />
            Результатов: {data.results} <br />
          </Jumbotron>
        </div>
      </div>
    </SidebarPageBody>
  )
}
