import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
import Jumbotron from '../components/Jumbotron'
import FloatingInput from '../components/FloatingInput'
import SubmitButton from '../components/SubmitButton'

export const UserPage = () => {
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
  // Состояние с данными о текстовых полях формы
  const [form, setForm] = useState({
    _id: '',
    email: '',
    login: '',
    password: '',
    password2: '',
    lastname: '',
    firstname: '',
    patronymic: '',
    post: '',
    privileges: '1',
    avatar: '',
    organizations: [{ value: '', label: '' }],
  })

  // Получение информации о пользователе, если мы изменяем его
  const getData = useCallback(async () => {
    try {
      const fetched = await request(`/api/user/${_id}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setForm((prev) => fetched)
    } catch (e) {}
  }, [_id, request, token])

  // Обработка информации для создания пользователя
  const actionHandler = useCallback(
    async (action) => {
      try {
        await request(
          '/api/user',
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

  // Обработка загрузки файла
  const fileHandler = useCallback(
    async (event) => {
      try {
        const fileData = new FormData()
        fileData.append('avatar', event.target.files[0])

        const fileAnswer = await request(
          '/api/upload/avatar',
          'POST',
          fileData,
          {
            Authorization: `Bearer ${token}`,
          },
          true
        )
        setForm((prev) => {
          return { ...prev, avatar: fileAnswer.file }
        })
        setSuccessForm((prev) => (prev = 'Фотография загружена'))
      } catch (e) {}
    },
    [token, request]
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

  // Вывод информации о пользователе в зависимости от состояния на странице
  useEffect(() => {
    if (_id) {
      getData()
    }
  }, [_id, getData])

  // После загрузки аватара - выводим его на страницу
  useEffect(() => {
    if (form.avatar !== null) {
      document.getElementById(
        'avatarPreview'
      ).src = `../uploads/avatar/${form.avatar}`
    } else {
      document.getElementById(
        'avatarPreview'
      ).src = `../uploads/avatar/${form.avatar}`
    }
  }, [form.avatar])

  // Обработчик input форм
  const changeHandler = (event) => {
    setForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {_id ? 'Обновление пользователя' : 'Создание пользователя'}
        </h1>
      </div>
      <form encType="multipart/form-data">
        <div className="row">
          <div className="col-sm-7">
            <Jumbotron header="Авторизационные данные">
              <div className="row">
                <div className="col-sm-6">
                  <FloatingInput
                    name="login"
                    id="login"
                    placeholder="Логин"
                    value={form.login}
                    onChange={changeHandler}
                    required="required"
                  />
                  <FloatingInput
                    name="email"
                    id="email"
                    placeholder="E-mail"
                    value={form.email}
                    onChange={changeHandler}
                    required="required"
                  />
                </div>
                <div className="col-sm-6">
                  <FloatingInput
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Пароль"
                    onChange={changeHandler}
                    required="required"
                  />
                  <FloatingInput
                    type="password"
                    name="password2"
                    id="password2"
                    placeholder="Повторите пароль"
                    onChange={changeHandler}
                    required="required"
                  />
                </div>
              </div>
            </Jumbotron>
            <Jumbotron header="Контактные данные">
              <FloatingInput
                name="lastname"
                id="lastname"
                placeholder="Фамилия"
                value={form.lastname}
                onChange={changeHandler}
                required="required"
              />
              <FloatingInput
                name="firstname"
                id="firstname"
                placeholder="Имя"
                value={form.firstname}
                onChange={changeHandler}
                required="required"
              />
              <FloatingInput
                name="patronymic"
                id="patronymic"
                placeholder="Отчество"
                value={form.patronymic}
                onChange={changeHandler}
                required="required"
              />
            </Jumbotron>
            <Jumbotron header="Дополнительная информация">
              <FloatingInput
                name="post"
                id="post"
                placeholder="Должность (профессия)"
                value={form.post}
                onChange={changeHandler}
                required="required"
              />
            </Jumbotron>
          </div>
          <div className="col-sm-5">
            <Jumbotron header="Фотография">
              <img id="avatarPreview" className="img-fluid" alt="Фотография" />
              <hr />
              <input
                type="file"
                className="form-control"
                name="avatar"
                id="avatar"
                accept=".jpg, .jpeg, .png"
                onChange={fileHandler}
              />
            </Jumbotron>
            <Jumbotron header="Права доступа">
              <select
                className="form-select"
                name="privileges"
                onChange={changeHandler}
                value={form.privileges}
              >
                <option value="1">Ученик</option>
                <option value="2">Доступ к разделу "Пользователи"</option>
                <option value="3">
                  Доступ к разделам "Программы обучения" и "Вопросы"
                </option>
                <option value="4">
                  Доступ к разделам "Пользователи", "Программы обучения",
                  "Вопросы" и "Списки"
                </option>
                <option value="5">
                  Доступ к разделам "Пользователи", "Группы" и "Списки"
                </option>
                <option value="10">Полный доступ</option>
              </select>
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
