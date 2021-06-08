import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = ({ text, items }) => {
  return (
    <div className="btn-group dropdown">
      <button
        type="button"
        className="btn btn--secondary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {text}
      </button>
      {items.map((item, index) => (
        <ul key={item.userId ? item.userId : index} className="dropdown-menu">
          {item.userId}
        </ul>
      ))}
    </div>
  )
}

Dropdown.propTypes = {
  text: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Dropdown
