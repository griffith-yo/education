const getRandomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const filter = (fields, value) =>
  result.filter((item) => fields.some((field) => item[field].includes(value)))

module.exports = {
  getRandomBetween,
  filter,
}
