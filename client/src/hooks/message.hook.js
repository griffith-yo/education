import { useCallback } from 'react'
import { Toast } from 'bootstrap'

export const useMessage = () => {
  return useCallback((text, type = 'danger') => {
    const showToast = () => {
      const toastElList = [].slice.call(
        document.querySelectorAll(`.toast-${type}`)
      )
      const toastList = toastElList.map(function (toastEl) {
        return new Toast(toastEl)
      })
      toastList.forEach((toast) => toast.show())
      const toastText = document.querySelector(`.toast-body-${type}`)
      toastText.innerHTML = text
    }
    return showToast()
  }, [])
}
