import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Loader } from '../../components/Loader'
import CourseList from './components/CourseList'
import ToastComponent from '../../components/Toast'
import { useMessage } from '../../hooks/message.hook'
import { Pagination } from '../../components/Pagination'
import { usePagination } from '../../hooks/pagination.hook'

const DATA_LIMIT = 10
const PAGE_LIMIT = 3

export const HomePage = () => {
  const [courses, setCourses] = useState([])
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token, userId } = useContext(AuthContext)
  const showToast = useMessage()
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)

  const {
    pages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    changePage,
    getPaginatedData,
    getPaginationGroup,
  } = usePagination({
    data: courses,
    PAGE_LIMIT,
    DATA_LIMIT,
  })

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
    if (successForm !== null) {
      showToast(successForm, 'success')
      setSuccessForm(null)
    }
  }, [error, info, success, successForm, clearError, clearSuccess, showToast])

  const fetch = useCallback(async () => {
    try {
      const fetched = await request('/api/student', 'GET', null, {
        Authorization: `Bearer ${token}`,
        UserID: userId,
      })
      setCourses((prev) => fetched)
    } catch (e) {}
  }, [token, request, userId])

  // Хук эффекта запускается при входе на страницу и изменении состояния deleted
  useEffect(() => {
    fetch()
  }, [fetch])

  if (loading) {
    return <Loader />
  }

  return (
    <main className="container">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Доступные курсы</h1>
      </div>
      {!loading && <CourseList getPaginatedData={getPaginatedData} />}
      <Pagination
        currentPage={currentPage}
        goToPreviousPage={goToPreviousPage}
        getPaginationGroup={getPaginationGroup}
        changePage={changePage}
        goToNextPage={goToNextPage}
        pages={pages}
      />
      <ToastComponent />
      <ToastComponent type="info" />
      <ToastComponent type="success" />
    </main>
  )
}
