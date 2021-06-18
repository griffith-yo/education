import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
import Jumbotron from '../components/Jumbotron'
import { Loader } from '../components/Loader'
import FloatingInput from '../components/FloatingInput'
import ReactSelect from '../components/ReactSelect'
import SubmitButton from '../components/SubmitButton'

export const OrganizationPage = () => {
  // Взяли из роутов, сами в ссылке передавали :_id
  const _id = useParams()._id
  const showToast = useMessage()
  // Импортируем состояния и функции из useHttp()
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token } = useContext(AuthContext)
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)
  // Состояние списка пользователей для select
  // const [options, setOptions] = useState([])
  // Состояние с данными о текстовых полях формы
  const [form, setForm] = useState({
    _id: '',
    name: '',
    email: '',
    selected: [],
    options: [],
  })

  // Получение информации об организации, если мы изменяем ее
  const getData = useCallback(async () => {
    try {
      const fetched = await request(`/api/organization/${_id}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setForm(fetched)
    } catch (e) {}
  }, [_id, request, token])

  // Получение информации о всех пользователях системы для options списка
  const fetchUsers = useCallback(async () => {
    try {
      const fetched = await request('/api/user/', 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setForm((prev) => {
        return {
          ...prev,
          options: fetched.map((user) => {
            return {
              value: user._id,
              label: `${user.lastname} ${user.firstname} ${user.patronymic}`,
            }
          }),
        }
      })
    } catch (e) {}
  }, [token, request])

  const actionHandler = useCallback(
    async (action) => {
      try {
        await request(
          '/api/organization',
          action,
          { ...form },
          {
            Authorization: `Bearer ${token}`,
          }
        )
      } catch (e) {}
    },
    [form, request, token]
  )

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

  // Вывод информации об организации в зависимости от состояния на странице
  useEffect(() => {
    if (_id) {
      getData()
    } else {
      fetchUsers()
    }
  }, [_id, getData, fetchUsers])

  // Изменение состояния в зависимости от изменения полей формы
  const changeHandler = (event) => {
    setForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  // Изменение состояния в зависимости от изменения полей списка
  const changeSelectHandler = (valueArray) => {
    setForm((prev) => {
      return { ...prev, selected: valueArray }
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {_id ? 'Обновление организации' : 'Создание организации'}
        </h1>
      </div>
      <form encType="multipart/form-data">
        <div className="row">
          <div className="col-sm-5">
            <Jumbotron header="Контактные данные">
              <FloatingInput
                name="name"
                placeholder="Наименование организации"
                value={form.name}
                onChange={changeHandler}
                required="required"
              />

              <FloatingInput
                name="email"
                placeholder="E-mail"
                onChange={changeHandler}
                value={form.email}
              />
            </Jumbotron>
          </div>
          <div className="col-sm-7">
            <Jumbotron header="Сотрудники">
              <ReactSelect
                onChange={changeSelectHandler}
                options={form.options}
                name="selected"
                id="selected"
                value={form.selected}
                label="Выберите пользователей"
                isMulti={true}
              />
            </Jumbotron>
          </div>
        </div>
        <SubmitButton
          text={_id ? 'Обновить' : 'Создать'}
          onClick={() => actionHandler(_id ? 'PUT' : 'POST')}
          loading={loading}
        />
      </form>
    </main>
  )
}
