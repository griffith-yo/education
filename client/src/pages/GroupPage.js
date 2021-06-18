import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
import Jumbotron from '../components/Jumbotron'
import FloatingInput from '../components/FloatingInput'
import ReactSelect from '../components/ReactSelect'
import SubmitButton from '../components/SubmitButton'

export const GroupPage = () => {
  const _id = useParams()._id
  const showToast = useMessage()
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token } = useContext(AuthContext)
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)
  // Состояние с данными формы
  const [form, setForm] = useState({
    _id: '',
    name: '',
    dateStart: '',
    dateEnd: '',
    selectedPrograms: [],
    selectedTeachers: [],
    selectedUsers: [],
    optionsUsers: [],
    optionsPrograms: [],
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

  // Получение информации о группе, если мы изменяем ее
  const getData = useCallback(async () => {
    try {
      const fetched = await request(`/api/group/${_id}`, 'GET', null, {
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
          optionsUsers: fetched.map((user) => {
            return {
              value: user._id,
              label: `${user.lastname} ${user.firstname} ${user.patronymic}`,
            }
          }),
        }
      })
    } catch (e) {}
  }, [token, request])

  // Получение информации о всех программах обучения системы для options списка
  const fetchPrograms = useCallback(async () => {
    try {
      const fetched = await request('/api/program/', 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setForm((prev) => {
        return {
          ...prev,
          optionsPrograms: fetched.map((program) => {
            return {
              value: program._id,
              label: program.name,
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
          '/api/group',
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

  // Вывод информации об организации в зависимости от состояния на странице
  useEffect(() => {
    if (_id) {
      getData()
    } else {
      fetchUsers()
      fetchPrograms()
    }
  }, [_id, getData, fetchUsers, fetchPrograms])

  // Изменение состояния в зависимости от изменения текстовых полей формы
  const changeHandler = (event) => {
    setForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  // Изменение состояния в зависимости от изменения полей списка программ обучения
  const changeSelectProgramHandler = (arr) => {
    setForm((prev) => {
      return { ...prev, selectedPrograms: arr }
    })
  }

  // Изменение состояния в зависимости от изменения полей списка учеников
  const changeSelectUsersHandler = (arr) => {
    setForm((prev) => {
      return { ...prev, selectedUsers: arr }
    })
  }

  // Изменение состояния в зависимости от изменения полей списка преподавателей
  const changeSelectTeacherHandler = (arr) => {
    setForm((prev) => {
      return { ...prev, selectedTeachers: arr }
    })
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">{_id ? 'Обновление группы' : 'Создание группы'}</h1>
      </div>
      <form encType="multipart/form-data">
        <div className="row">
          <div className="col-sm-6">
            <Jumbotron header="Основная информация">
              <FloatingInput
                name="name"
                placeholder="Номер группы"
                value={form.name}
                onChange={changeHandler}
                required="required"
              />
            </Jumbotron>
            <Jumbotron header="Даты обучения">
              <FloatingInput
                type="date"
                name="dateStart"
                placeholder="Дата начала обучения"
                value={form.dateStart}
                onChange={changeHandler}
                required="required"
              />
              <FloatingInput
                type="date"
                name="dateEnd"
                placeholder="Дата окончания обучения"
                value={form.dateEnd}
                onChange={changeHandler}
                required="required"
              />
            </Jumbotron>
          </div>
          <div className="col-sm-6">
            <Jumbotron header="Программа обучения">
              <ReactSelect
                onChange={changeSelectProgramHandler}
                options={form.optionsPrograms}
                name="selectedProgram"
                id="selectedProgram"
                value={form.selectedPrograms}
                label="Выберите программу"
                isMulti={true}
              />
            </Jumbotron>
            <Jumbotron header="Ученики">
              <ReactSelect
                onChange={changeSelectUsersHandler}
                options={form.optionsUsers}
                name="selectedUsers"
                id="selectedUsers"
                value={form.selectedUsers}
                label="Выберите пользователей"
                isMulti={true}
              />
            </Jumbotron>
            <Jumbotron header="Учитель">
              <ReactSelect
                onChange={changeSelectTeacherHandler}
                options={form.optionsUsers}
                name="selectedTeacher"
                id="selectedTeacher"
                value={form.selectedTeachers}
                label="Выберите преподавателя"
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
