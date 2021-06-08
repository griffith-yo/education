import React from 'react'

export const Loader = () => (
  <div className="d-flex justify-content-center pt-5">
    <div
      className="spinner-border"
      style={{ width: '3rem', height: '3rem' }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)
