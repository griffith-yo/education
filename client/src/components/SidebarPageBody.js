import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from './Loader'
import { useMessage } from '../hooks/message.hook'
import ProgramsList from './ProgramsList'
import UsersList from './UsersList'
import GroupsList from './GroupsList'
import OrganizationsList from './OrganizationsList'
import ResultsList from './ResultsList'
import FloatingInput from './FloatingInput'
import { Plus } from 'react-feather'
import { Pagination } from './Pagination'
import { usePagination } from '../hooks/pagination.hook'

const SidebarPageBody = ({ header, target, dashboardInfo, children }) => {
  const showToast = useMessage()
  const [data, setData] = useState([])
  const [deleted, setDeleted] = useState([])
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token } = useContext(AuthContext)
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Обработка всплывающих окон
  useEffect(() => {
    if (error !== null) {
      showToast(error, 'danger')
      clearError()
    }
    if (info !== null) {
      showToast(info, 'danger')
      setInfo(null)
    }
    if (success !== null && success !== undefined) {
      showToast(success, 'success')
      clearSuccess()
    }
  }, [error, info, success, clearError, clearSuccess, showToast])

  const dataLimit = 10
  const pageLimit = 3

  const {
    pages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    changePage,
    getPaginatedData,
    getPaginationGroup,
  } = usePagination({
    data,
    pageLimit,
    dataLimit,
  })

  const fetch = useCallback(async () => {
    try {
      const fetched = await request(`/api/${target}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setData((prev) => fetched)
    } catch (e) {}
  }, [token, request, target])

  const deleteHandler = useCallback(
    async (_id) => {
      try {
        const del = await request(`/api/delete/${target}/${_id}`, 'GET', null, {
          Authorization: `Bearer ${token}`,
        })
        setDeleted((prev) => del)
      } catch (e) {}
    },
    [token, request, target]
  )

  const fetchSearch = useCallback(
    async (value) => {
      try {
        const fetched = await request(
          `/api/${target}/search/${value}`,
          'GET',
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        )
        setData((prev) => fetched)
      } catch (e) {}
    },
    [token, request, target]
  )

  const onChangeSearchHandler = (event) => {
    if (event.target.value) fetchSearch(event.target.value)
    else fetch()
  }

  let bodyTable = <></>
  switch (target) {
    case 'user':
      bodyTable = (
        <UsersList
          getPaginatedData={getPaginatedData}
          deleteHandler={deleteHandler}
        />
      )
      break
    case 'organization':
      bodyTable = (
        <OrganizationsList
          getPaginatedData={getPaginatedData}
          deleteHandler={deleteHandler}
        />
      )
      break
    case 'group':
      bodyTable = (
        <GroupsList
          getPaginatedData={getPaginatedData}
          deleteHandler={deleteHandler}
        />
      )
      break
    case 'program':
      bodyTable = (
        <ProgramsList
          getPaginatedData={getPaginatedData}
          deleteHandler={deleteHandler}
        />
      )
      break
    case 'result':
      bodyTable = <ResultsList getPaginatedData={getPaginatedData} />
      break
    default:
      bodyTable = <></>
      break
  }

  // После запроса передаем в родительский объект информацию
  useEffect(() => {
    if (dashboardInfo) dashboardInfo(data)
  }, [data, dashboardInfo])

  // Хук эффекта запускается при входе на страницу и изменении состояния deleted
  useEffect(() => {
    fetch()
  }, [fetch, deleted])

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {target !== 'result' && target !== 'dashboard' && (
            <Link
              to={`/create/${target}`}
              className="btn btn-outline-primary shadow-sm me-3"
            >
              <Plus />
            </Link>
          )}
          {header}
        </h1>
      </div>
      {children}
      {target !== 'dashboard' && (
        <>
          <FloatingInput
            id="resultSearch"
            name="resultSearch"
            placeholder="Введите информацию для поиска"
            onChange={onChangeSearchHandler}
          />
          {!loading ? (
            <>
              {bodyTable}
              {data.length ? (
                <Pagination
                  currentPage={currentPage}
                  goToPreviousPage={goToPreviousPage}
                  getPaginationGroup={getPaginationGroup}
                  changePage={changePage}
                  goToNextPage={goToNextPage}
                  pages={pages}
                />
              ) : (
                ''
              )}
            </>
          ) : (
            <Loader />
          )}
        </>
      )}
    </main>
  )
}

SidebarPageBody.propTypes = {
  header: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  dashboardInfo: PropTypes.func,
  children: PropTypes.node,
}

export default SidebarPageBody
