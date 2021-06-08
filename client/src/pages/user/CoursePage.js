import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'
import { Loader } from '../../components/Loader'
import { FileText } from 'react-feather'
import ModalComponent from '../../components/Modal'
import Jumbotron from '../../components/Jumbotron'
import SectionsList from './components/SectionsList'

export const CoursePage = () => {
  // Взяли из роутов, сами в ссылке передавали :id
  const _id = useParams()._id
  const showToast = useMessage()
  // Импортируем состояния и функции из useHttp()
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token } = useContext(AuthContext)
  // Состояние с данными о текстовых полях формы
  const [form, setForm] = useState({
    _id: '',
    edudirection: '',
    name: '',
    volume: '',
    gallery: [],
    pdf: [],
    sections: [{ _id: '', sectionTheme: '', sectionName: '' }],
  })
  const [currentSection, setCurrentSection] = useState({
    index: '',
    section: '',
  })
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)
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
  }, [_id, token, request])

  const onClickHandler = (event, index) => {
    setCurrentSection((prev) => {
      return { index, section: form.sections[index] }
    })
  }

  // Вывод информации об организации в зависимости от состояния на странице
  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    setCurrentSection((prev) => {
      return { index: 0, section: form.sections[0] }
    })
  }, [form])

  if (loading) return <Loader />

  return (
    <div className="row">
      <div
        className="col-md-3 ms-sm-auto col-lg-2 sidebar"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <SectionsList
          currentSection={currentSection}
          sections={form.sections}
          onClickHandler={onClickHandler}
        />
      </div>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">
            <button
              className="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalPDF"
            >
              <FileText />
            </button>
            &nbsp;
            {form.name}
          </h1>
        </div>
        <Jumbotron header={currentSection.section.sectionName}>
          <div
            dangerouslySetInnerHTML={{
              __html: currentSection.section.sectionBody,
            }}
            role="tabpanel"
          />
        </Jumbotron>
        <ModalComponent
          _id="modalPDF"
          loading={loading}
          data={form.pdf}
          window="pdf"
        />
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
    </div>
  )
}
