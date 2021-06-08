import React from 'react'
import PropTypes from 'prop-types'

const Page = ({ children }) => {
  const pageStyle = {
    width: '210mm',
    // height: '297mm',
  }
  return (
    <div className="d-flex justify-content-center">
      <div className="border border-dark shadow" style={pageStyle}>
        {children}
      </div>
    </div>
  )
}

Page.propTypes = {
  children: PropTypes.element,
}

export default Page
