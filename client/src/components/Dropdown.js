import React from 'react'
import PropTypes from 'prop-types'
import { Check, HelpCircle, X } from 'react-feather'
import { Link } from 'react-router-dom'

const Dropdown = ({ text, group, items }) => {
  const ICON_SIZE = 20
  return (
    <div className="btn-group dropend">
      <button
        type="button"
        className="btn btn--secondary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {text}
      </button>
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li key={item.userId ? item.userId : index}>
            {!item.attempt ? (
              <span className="dropdown-item">
                <HelpCircle className="text-warning" size={ICON_SIZE} /> &nbsp;
                {item.name}
              </span>
            ) : item.passed ? (
              <Link
                className="dropdown-item"
                to={`/result/${group}/${item.programId}/${item.userId}/${item.attempt}`}
              >
                <Check className="text-success" size={ICON_SIZE} />
                &nbsp;{item.name}
              </Link>
            ) : (
              <Link
                className="dropdown-item"
                to={`/result/${group}/${item.programId}/${item.userId}/${item.attempt}`}
              >
                <X className="text-danger" size={ICON_SIZE} />
                &nbsp;{item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

Dropdown.propTypes = {
  text: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Dropdown
