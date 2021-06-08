import { useState } from 'react'

export const usePagination = ({ data, pageLimit, dataLimit }) => {
  const pages = Math.ceil(data.length / dataLimit)
  const [currentPage, setCurrentPage] = useState(1)

  function goToNextPage() {
    setCurrentPage((currentPage) => currentPage + 1)
  }

  function goToPreviousPage() {
    setCurrentPage((currentPage) => currentPage - 1)
  }

  // Обработка нажатия на текущую кнопку (считывает число кнопки)
  function changePage(event) {
    const pageNumber = Number(event.target.textContent)
    setCurrentPage(pageNumber)
  }

  // Вырезает из массива данные для текущей страницы
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit
    const endIndex = startIndex + dataLimit
    return data.slice(startIndex, endIndex)
  }

  // Делает промежуток показываемых страниц
  const getPaginationGroup = () => {
    if (pages >= pageLimit) {
      let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit
      return new Array(pageLimit).fill().map((_, idx) => start + idx + 1)
    } else {
      return new Array(pages).fill().map((_, idx) => idx + 1)
    }
  }

  return {
    pages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    changePage,
    getPaginatedData,
    getPaginationGroup,
  }
}
