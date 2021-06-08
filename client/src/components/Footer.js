import React from 'react'

export const Footer = () => {
  const date = new Date()

  return (
    <>
      <div style={{ marginTop: '100px' }} />
      <footer
        className="fixed-bottom"
        style={{
          left: '0',
          bottom: '0',
          padding: '10px',
          background: '#212529',
          color: '#fff',
          width: '100%',
        }}
      >
        &copy; EntryPoint 2020 - {date.getFullYear()}
      </footer>
    </>
  )
}
