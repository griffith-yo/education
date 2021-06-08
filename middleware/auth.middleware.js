const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  // Серверный технический запрос, проверка на него
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    // Получаем токен из хедеров
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    // Проверка на наличие токена
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    // Раскодировка токена
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded
    next()
  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }
}
