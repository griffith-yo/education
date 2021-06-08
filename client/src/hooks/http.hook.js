import { useState, useCallback } from 'react'

const storageName = 'userData'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}, file = false) => {
      setLoading(true)

      try {
        // Если передаем body (POST) и работаем не с файлом, то переводим JSON в строковый формат и добавляем Content-Type
        if (body && !file) {
          headers['Content-Type'] = 'application/json'
          body = JSON.stringify(body)
        }

        // Отправляем запрос на сервер и ждем
        const response = await fetch(url, { method, body, headers })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Что-то пошло не так')
        }
        setLoading(false)

        if (data.message) {
          setSuccess(data.message)
        }

        return data
      } catch (e) {
        if (e.message === 'Нет авторизации') {
          localStorage.removeItem(storageName)
          window.location.reload()
        }
        setLoading(false)
        setError(e.message)
        throw e
      }
    },
    []
  )

  const clearError = useCallback(() => setError(null), [])
  const clearSuccess = useCallback(() => setSuccess(null), [])

  return { loading, request, error, clearError, success, clearSuccess }
}
