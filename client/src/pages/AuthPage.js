import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook'
import ToastComponent from '../components/Toast'
import SubmitButton from '../components/SubmitButton'
import logo from '../img/logo.jpg'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const { loading, request, error, clearError } = useHttp()
  const showToast = useMessage()
  const [form, setForm] = useState({
    login: '',
    password: '',
  })

  useEffect(() => {
    if (error !== null) {
      showToast(error)
      clearError()
    }
  }, [showToast, clearError, error])

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      await request('/api/auth/register', 'POST', { ...form })
    } catch (e) {}
  }

  const actionHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form })
      auth.login(data.token, data.userId, data.name, data.privileges)
    } catch (e) {}
  }

  return (
    <main className="form-signin">
      <img className="mb-4" src={logo} alt="" />
      <h1 className="h3 mb-3 fw-normal">Авторизация</h1>
      <div className="form-floating">
        <input
          className="form-control"
          placeholder="Логин"
          id="login"
          type="text"
          name="login"
          value={form.login}
          onChange={changeHandler}
        />
        <label htmlFor="login">Логин</label>
      </div>
      <div className="form-floating">
        <input
          className="form-control"
          placeholder="Пароль"
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={changeHandler}
        />
        <label htmlFor="password">Пароль</label>
      </div>
      <SubmitButton
        text={'Войти'}
        onClick={actionHandler}
        width={'w-100'}
        loading={loading}
      />
      <button
        className="w-100 btn btn-lg btn-secondary mb-3"
        type="submit"
        onClick={registerHandler}
        disabled={loading}
      >
        Регистрация
      </button>
      <p className="mb-3 text-muted">
        &copy; EntryPoint 2020 – {new Date().getFullYear()}
      </p>
      <ToastComponent />
    </main>
  )
}
