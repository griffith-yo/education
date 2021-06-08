import React from 'react'

export const Pagination = ({
  currentPage,
  goToPreviousPage,
  getPaginationGroup,
  changePage,
  goToNextPage,
  pages,
}) => {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            tabIndex="-1"
            aria-disabled="true"
            onClick={goToPreviousPage}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {getPaginationGroup().map((item, index) => (
          <li
            className={`page-item ${
              item > pages
                ? 'disabled d-none'
                : currentPage === item
                ? 'active'
                : ''
            }`}
            key={index}
          >
            <button className="page-link" onClick={changePage}>
              {item}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage >= pages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={goToNextPage}>
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
