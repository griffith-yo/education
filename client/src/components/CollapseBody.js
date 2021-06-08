import React from 'react'
import PropTypes from 'prop-types'

const CollapseBody = ({ id, children }) => {
  return (
    <div className="collapse w-100" id={`collapse${id}`}>
      <div className="card card-body">{children}</div>
    </div>
  )
}

CollapseBody.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default CollapseBody
