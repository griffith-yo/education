import React from 'react'
import PropTypes from 'prop-types'
import { X, Check } from 'react-feather'
import {
  Document,
  Page,
  View,
  Text,
  Font,
  StyleSheet,
  usePDF,
} from '@react-pdf/renderer'
import TimesNewRoman from '../styles/fonts/Times-New-Roman.ttf'
import { useEffect } from 'react'
import { useState } from 'react'
import * as fs from 'fs'

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
  },
})

const PdfDetailingList = ({ detailing }) => {
  const iconSize = 18
  const greenAnswer = 'list-group-item list-group-item-success'
  const redAnswer = 'list-group-item list-group-item-danger'
  const whiteAnswer = 'list-group-item'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text>Some text: какой-то текст</Text>
        </View>
      </Page>
    </Document>
  )
}

PdfDetailingList.propTypes = {
  detailing: PropTypes.object.isRequired,
}

export default PdfDetailingList
