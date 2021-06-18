import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import Question from '../components/Question'
import { useMessage } from '../hooks/message.hook'
import SubmitButton from '../components/SubmitButton'

export const QuestionsPage = () => {
  // Взяли из роутов, сами в ссылке передавали :id
  const _id = useParams()._id
  const emptyQuestion = {
    questionName: '',
    questionAnswers: [
      { answerName: '', correctness: '' },
      { answerName: '', correctness: '' },
      { answerName: '', correctness: '' },
      { answerName: '', correctness: '' },
    ],
  }
  const [programInfo, setProgramInfo] = useState({
    _id: '',
    name: '',
  })
  const [questions, setQuestions] = useState([emptyQuestion])
  const showToast = useMessage()
  const { loading, request, error, clearError, success, clearSuccess } =
    useHttp()
  // Состояние предупреждения при заполнении форм
  const [info, setInfo] = useState(null)
  // Состояние успеха при заполнении форм
  const [successForm, setSuccessForm] = useState(null)
  const { token } = useContext(AuthContext)

  const fetchQuestions = useCallback(async () => {
    try {
      const fetched = await request(`/api/program/${_id}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setProgramInfo((prev) => {
        return { _id, name: fetched.name }
      })
      setQuestions((prev) => {
        if (!fetched.questions.length) {
          return [...prev]
        } else {
          return [...fetched.questions]
        }
      })
    } catch (e) {}
  }, [token, request, _id])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const changeAnswerHandler = (event, questionIndex, answerIndex) => {
    setQuestions((prev) => {
      prev[questionIndex].questionAnswers[answerIndex] = {
        ...prev[questionIndex].questionAnswers[answerIndex],
        [event.target.name]: event.target.value,
      }
      return [...prev]
    })
  }

  const changeCheckboxHandler = (event, questionIndex, answerIndex) => {
    setQuestions((prev) => {
      prev[questionIndex].questionAnswers[answerIndex].correctness = event
        .target.checked
        ? 'checked'
        : ''
      return [...prev]
    })
  }

  const changeQuestionHandler = (event, questionIndex) => {
    setQuestions((prev) => {
      prev[questionIndex] = {
        ...prev[questionIndex],
        [event.target.name]: event.target.value,
      }
      return [...prev]
    })
  }

  const saveQuestions = useCallback(async () => {
    try {
      await request(
        '/api/program/questions/save',
        'POST',
        { questions, _id: programInfo._id },
        {
          Authorization: `Bearer ${token}`,
        }
      )
    } catch (e) {}
  }, [request, token, questions, programInfo._id])

  const onClickAddHandler = (event, index) => {
    setQuestions((prev) => {
      return [
        ...prev.slice(0, index + 1),
        emptyQuestion,
        ...prev.slice(index + 1),
      ]
    })
  }

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

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Вопросы к програме обучения "{programInfo.name}"</h1>
      </div>
      <form encType="multipart/form-data">
        {questions.map((question, index) => {
          return (
            <div key={question._id ? question._id : index}>
              <Question
                questionIndex={index}
                header={`Вопрос ${index + 1}`}
                answers={question.questionAnswers}
                questionName={question.questionName}
                changeCheckboxHandler={changeCheckboxHandler}
                changeQuestionHandler={changeQuestionHandler}
                changeAnswerHandler={changeAnswerHandler}
                onClickAddHandler={onClickAddHandler}
              />
            </div>
          )
        })}
        <SubmitButton
          text={'Сохранить'}
          onClick={saveQuestions}
          loading={loading}
        />
      </form>
    </main>
  )
}
