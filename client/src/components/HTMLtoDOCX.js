import React from 'react'
import PropTypes from 'prop-types'
import HTMLtoDOCX from 'html-to-docx'
import { Save, X } from 'react-feather'
import { saveAs } from 'file-saver'
import Spinner from '../components/Spinner'

const HtmlToDocx = ({ detailing }) => {
  const iconSize = 18
  const greenAnswer = 'list-group-item list-group-item-success'
  const redAnswer = 'list-group-item list-group-item-danger'
  const whiteAnswer = 'list-group-item'

  const htmlString = () => `<div>
      <p><strong>${detailing.user}</strong></p>
      <p>Группа: ${detailing.group}</p>
      <p>Программа обучения: ${detailing.program}</p>
      <p>Попытка: ${detailing.attempt}</p>
      <p>Колличество баллов: ${detailing.scores} из ${detailing.scoresMax}</p>
      <table style="border: 0px; text-align: center;">
      <tr>
          <th>Country</th>
          <th>Capital</th>
      </tr>
      <tr>
          <td>India</td>
          <td>New Delhi</td>
      </tr>
      <tr>
          <td>United States of America</td>
          <td>Washington DC</td>
      </tr>
      </table>
    </div>`
  const generate = async () => {
    const fileBuffer = await HTMLtoDOCX(htmlString(), null, {
      orientation: 'portrait',
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    })
    saveAs(fileBuffer, detailing.user + '.docx')
  }
  return (
    <button
      className="btn btn-outline-primary shadow"
      type="button"
      onClick={generate}
    >
      <Save />
    </button>
  )
}

HtmlToDocx.propTypes = {
  detailing: PropTypes.object.isRequired,
}

export default HtmlToDocx
