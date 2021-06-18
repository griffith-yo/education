import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
import Jumbotron from '../components/Jumbotron'
import FloatingInput from '../components/FloatingInput'
import ModalComponent from '../components/Modal'
import Section from '../components/Section'
import ReactCreatableSelect from '../components/ReactCreatableSelect'
import SubmitButton from '../components/SubmitButton'

export const ProgramPage = () => {
  // Взяли из роутов, сами в ссылке передавали :id
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
    edudirection: '',
    name: '',
    volume: '',
    gallery: [],
    pdf: [],
    sections: [{ _id: '', sectionTheme: '', sectionName: '', sectionBody: '' }],
  })
  const [edudir, setEdudir] = useState([])
  const fileData = useMemo(() => new FormData(), [])
  const history = useHistory()

  const getEdudir = useCallback(async () => {
    try {
      const fetched = await request(
        '/api/program/edudirection/get',
        'GET',
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      if (!fetched) setInfo('Направлений обучения не обнаружено')
      else setEdudir((prev) => fetched)
    } catch (e) {}
  }, [request, token])

  const getData = useCallback(async () => {
    try {
      const fetched = await request(`/api/program/${_id}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setForm((prev) => {
        return {
          ...fetched,
          sections: fetched.sections.length
            ? fetched.sections
            : [{ sectionTheme: '', sectionName: '', sectionBody: '' }],
        }
      })
    } catch (e) {}
  }, [_id, request, token])

  const actionHandler = useCallback(
    async (action) => {
      try {
        const response = await request(
          '/api/program',
          action,
          { ...form },
          {
            Authorization: `Bearer ${token}`,
          }
        )
        if (action === 'POST') history.push(`/program/${response}`)
      } catch (e) {}
    },
    [form, request, token, history]
  )

  const fileHandler = useCallback(
    async (event) => {
      try {
        for (let i = 0; i < event.target.files.length; i++) {
          fileData.append(event.target.name, event.target.files[i])
        }
        fileData.append('_id', _id)

        await request(
          `/api/upload/program/`,
          'POST',
          fileData,
          {
            Authorization: `Bearer ${token}`,
          },
          true
        )
        await getData()
      } catch (e) {}
    },
    [request, token, fileData, getData, _id]
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
  }, [error, info, success, successForm, clearError, showToast, clearSuccess])

  // Вывод информации об организации в зависимости от состояния на странице
  useEffect(() => {
    getEdudir()
    if (_id) {
      getData()
    }
  }, [_id, getData, getEdudir])

  const changeHandler = (event) => {
    setForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  const sectionInfoChangeHandler = (event, index) => {
    setForm((prev) => {
      prev.sections[index] = {
        ...prev.sections[index],
        [event.target.name]: event.target.value,
      }
      return { ...prev, sections: [...prev.sections] }
    })
  }

  const sectionBodyChangeHandler = (content, index) => {
    setForm((prev) => {
      prev.sections[index] = { ...prev.sections[index], sectionBody: content }
      return { ...prev, sections: [...prev.sections] }
    })
  }

  const onClickHandler = (event, index) => {
    setForm((prev) => {
      let arr = [
        ...prev.sections.slice(0, index + 1),
        {
          sectionTheme: '',
          sectionName: '',
          sectionBody: '',
        },
        ...prev.sections.slice(index + 1),
      ]
      return { ...prev, sections: arr }
    })
  }

  const deleteGalleryHandler = useCallback(
    async (filename, window) => {
      try {
        await request(
          `/api/delete/program/${window}/${_id}/${filename}`,
          'DELETE',
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        )
        await getData()
      } catch (e) {}
    },
    [token, request, _id, getData]
  )

  // Изменение состояния в зависимости от изменения полей списка
  const changeSelectHandler = (value) => {
    setForm((prev) => {
      return { ...prev, edudirection: value }
    })
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {_id
            ? 'Обновление программы обучения'
            : 'Создание программы обучения'}
        </h1>
      </div>
      <form encType="multipart/form-data">
        <Jumbotron header="Основная информация">
          <ReactCreatableSelect
            onChange={changeSelectHandler}
            options={edudir}
            name="edudirection"
            id="edudirection"
            value={form.edudirection}
            label="Выберите направление обучения"
          />
          <FloatingInput
            name="name"
            placeholder="Наименование программы обучения"
            onChange={changeHandler}
            value={form.name}
          />
          <FloatingInput
            name="volume"
            placeholder="Объем программы обучения"
            onChange={changeHandler}
            value={form.volume}
          />
        </Jumbotron>
        {form._id ? (
          <div className="row">
            <div className="col-sm-6">
              <Jumbotron header="Галерея картинок">
                <input
                  type="file"
                  className="form-control"
                  name="gallery"
                  id="gallery"
                  accept=".jpg, .jpeg, .png"
                  onChange={fileHandler}
                  multiple="multiple"
                />
                <button
                  type="button"
                  className="btn text-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalGallery"
                >
                  Количество картинок в галерее: {form.gallery.length}
                </button>
                <ModalComponent
                  _id="modalGallery"
                  loading={loading}
                  data={form.gallery}
                  window="gallery"
                  deleteGalleryHandler={deleteGalleryHandler}
                />
              </Jumbotron>
            </div>
            <div className="col-sm-6">
              <Jumbotron header="Дополнительные материалы">
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  id="pdf"
                  accept=".pdf"
                  onChange={fileHandler}
                  multiple="multiple"
                />
                <button
                  type="button"
                  className="btn text-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPDF"
                >
                  Количество файлов: {form.pdf.length}
                </button>
                <ModalComponent
                  _id="modalPDF"
                  loading={loading}
                  data={form.pdf}
                  window="pdf"
                  deleteGalleryHandler={deleteGalleryHandler}
                />
              </Jumbotron>
            </div>
          </div>
        ) : (
          ''
        )}

        {form._id
          ? form.sections.map((section, index) => (
              <Section
                key={section.sectionBody}
                sectionTheme={section.sectionTheme}
                sectionName={section.sectionName}
                sectionBody={section.sectionBody}
                index={index}
                _id={_id}
                sectionBodyChangeHandler={sectionBodyChangeHandler}
                sectionInfoChangeHandler={sectionInfoChangeHandler}
                onClickHandler={onClickHandler}
              />
            ))
          : ''}
        <SubmitButton
          text={_id ? 'Обновить' : 'Создать'}
          onClick={() => actionHandler(_id ? 'PUT' : 'POST')}
          loading={loading}
        />
      </form>
      {form.pdf.map((pdf, index) => (
        <div key={pdf.filename}>
          <ModalComponent
            _id={`fileModal-${index}`}
            loading={loading}
            pdf={pdf}
          />
        </div>
      ))}
    </main>
  )
}
