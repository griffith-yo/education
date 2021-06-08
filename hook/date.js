const getDay = (data) => {
  return (data.getDate() < 10 ? '0' : '') + data.getDate()
}

const getMonth = (data) => {
  return (data.getMonth() < 10 ? '0' : '') + (data.getMonth() + 1)
}

const getFullYear = (data) => data.getFullYear()

module.exports = {
  getDay,
  getMonth,
  getFullYear,
}
