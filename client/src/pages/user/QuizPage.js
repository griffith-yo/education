import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'
import { Loader } from '../../components/Loader'
import QuizCarousel from './components/QuizCarousel'
import QuestionsList from './components/QuestionsList'
import ToastComponent from '../../components/Toast'

export const QuizPage = () => {
  // Взяли из роутов, сами в ссылке передавали :id
  const programID = useParams().programID
  const groupID = useParams().groupID
  const showToast = useMessage()
  // Импортируем состояния и функции из useHttp()
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  const { token, userId } = useContext(AuthContext)
  // Состояние с данными о программе обучения группы и вопросами к ней (для первоначальной загрузки)
  const [programInfo, setProgramInfo] = useState({
    _id: '',
    edudirection: '',
    name: '',
    volume: '',
    gallery: [],
    pdf: [],
    questions: [
      {
        _id: '',
        questionName: '',
        questionAnswers: [{ answerName: '', correntness: '' }],
      },
    ],
  })
  // Состояние с результатами, которые ввел пользователь
  const [result, setResult] = useState([
    { qustionName: '', questionAnswers: [{ answerName: '', correctness: '' }] },
  ])
  let history = useHistory()
  // Массив из вопросов, на которые были даны хоть какие-то ответы
  const [answeredQuestionsArr, setAnsweredQuestionsArr] = useState([])
  // Состояние, отображабщее выведенный вопрос
  const [currentQuestion, setCurrentQuestion] = useState(0)
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

  // Функция, получающая информацию с бекенда
  const getData = useCallback(async () => {
    try {
      const fetched = await request(`/api/program/${programID}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setProgramInfo((prev) => fetched)
    } catch (e) {}
  }, [programID, token, request])

  // Обработка кнопки - "Ответить"
  const onSubmitHandler = useCallback(async () => {
    try {
      await request(
        `/api/student/submit`,
        'Post',
        {
          resultQuestions: result,
          programID,
          groupID,
        },
        {
          Authorization: `Bearer ${token}`,
          UserID: userId,
        }
      )
      history.push('/home')
    } catch (e) {}
  }, [programID, history, groupID, token, request, result, userId])

  useEffect(() => {
    getData()
  }, [getData])

  // Заносим, первоначально, полученную информацию с бекенда в состояние с результатом тестов
  useEffect(() => {
    setResult((prev) => {
      return [
        ...programInfo.questions.map((question) => {
          question.questionAnswers.map((answer) => {
            answer.correctness = ''
            return answer
          })
          return question
        }),
      ]
    })
  }, [programInfo])

  // Обработка нажатия пользователем на ответ
  const changeCheckboxHandler = (event, questionIndex, answerIndex) => {
    setResult((prev) => {
      prev[questionIndex].questionAnswers[answerIndex].correctness = event
        .target.checked
        ? 'checked'
        : ''
      return [...prev]
    })
  }

  // После изменения массива с результатами - делаем проверку на включение кнопки отправки данных
  useEffect(() => {
    setAnsweredQuestionsArr((prev) => {
      let answeredQuestions = []
      let answered = false

      result.map((question, questionIndex) => {
        question.questionAnswers.map((answer) => {
          if (answer.correctness === 'checked' && !answered) {
            answeredQuestions.push(questionIndex)
            answered = true
          }
          return null
        })
        answered = false
        return null
      })
      return answeredQuestions
    })
  }, [result])

  if (loading) return <Loader />

  return (
    <div className="row">
      <div
        className="col-md-3 ms-sm-auto col-lg-2 sidebar"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <QuestionsList
          questions={programInfo.questions}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          answeredQuestionsArr={answeredQuestionsArr}
        />
        <ToastComponent />
        <ToastComponent type="info" />
        <ToastComponent type="success" />
      </div>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">
            Тестирование для программы обучения "{programInfo.name}"
          </h1>
        </div>
        <QuizCarousel
          questions={programInfo.questions}
          changeCheckboxHandler={changeCheckboxHandler}
          setCurrentQuestion={setCurrentQuestion}
          result={result}
          answeredQuestionsArr={answeredQuestionsArr}
          onSubmitHandler={onSubmitHandler}
        />
      </main>
    </div>
  )
}
