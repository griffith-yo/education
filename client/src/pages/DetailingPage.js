import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { useMessage } from '../hooks/message.hook'
import DetailingList from '../components/DetailingList'
import WordSaveButton from '../components/WordSaveButton'
import { detailingTemplate } from '../components/WordTemplates/detailing.template'

export const DetailingPage = () => {
  const userID = useParams().userID
  const groupID = useParams().groupID
  const programID = useParams().programID
  const attempt = useParams().attempt
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token } = useContext(AuthContext)
  const showToast = useMessage()
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)
  // Состояние полученных результатов
  const [detailing, setDetailing] = useState({
    attempt: 0,
    attemptMax: 5,
    group: '',
    user: '',
    program: '',
    scores: 0,
    scoresMax: 0,
    passingScore: 0,
    passed: false,
    initialQuestions: [
      { _id: '', questionName: 'Вопрос', questionAnswers: [] },
    ],
    questions: [
      {
        _id: '',
        questionName: 'Вопрос',
        questionAnswers: [],
        success: false,
      },
    ],
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
      const fetched = await request(
        `/api/result/${groupID}/${programID}/${userID}/${attempt}`,
        'GET',
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      setDetailing(fetched)
    } catch (e) {}
  }, [attempt, userID, groupID, programID, token, request])

  useEffect(() => {
    fetch()
  }, [fetch])

  if (loading) {
    return <Loader />
  }
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <span>
          <h1 className="h2">
            {/* <HtmlToDocx detailing={detailing} /> */}
            <WordSaveButton
              data={detailingTemplate(detailing)}
              filename={detailing.user}
            />
            {/* <PDFDownloadLink
              className="btn btn-outline-primary shadow"
              document={<PdfDetailingList detailing={detailing} />}
              fileName={detailing.user + '.pdf'}
            >
              {({ blob, url, loadingPdf, error }) =>
                loadingPdf ? <Spinner size={1} /> : <Save />
              }
            </PDFDownloadLink> */}
            &nbsp; Детализация
          </h1>
        </span>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <h4>{detailing.user}</h4>
          <hr />
          <p>Группа: {detailing.group}</p>
          <p>Программа обучения: {detailing.program}</p>
          <p>Попытка: {detailing.attempt}</p>
          <p>
            Колличество баллов: {detailing.scores} из {detailing.scoresMax}
          </p>
        </div>
        <DetailingList detailing={detailing} />
      </div>
    </main>
  )
}
