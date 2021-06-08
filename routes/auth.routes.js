const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// Обработка POST запроса
// /api/auth/register
router.post(
  '/register',
  [
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })
      }

      // То, что приходит в фронтенд (Получаем из body эти значения)
      const { login, password } = req.body

      // Поиск человека по email
      const candidate = await User.findOne({ login })

      // Если такой пользователь есть, то прекращаем выполнение скрипта RETURN и выводим сообщение
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' })
      }

      // Ждем шифрования пароля
      const hashedPassword = await bcrypt.hash(password, 12)
      // Создаем пользователя
      const user = new User({ login, password: hashedPassword })
      // Сохраняем в БД
      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })
    } catch (e) {
      res
        .status(500)
        .json({ message: `Ошибка при запросе к базу данных: ${e}` })
    }
  }
)

// Обработка POST запроса
// /api/auth/login
router.post(
  '/login',
  [
    check('login', 'Введите логин').exists(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему',
        })
      }

      const { login, password } = req.body

      const user = await User.findOne({ login })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова' })
      }

      // Вычисляем время от текущего состояния до конца дня и делаем валидным токен до конца дня (значение в ms, т.е. часы = ms/1000/60/60)
      const start = new Date()
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const expiresIn = end - start

      // Формирование токена (1 - объект, который записывает значения в токен, 2 - секретная строка, 3 - время жизни токена)
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: expiresIn,
      })

      // Отвечаем по умолчанию со статусом 200
      res.json({
        token,
        userId: user.id,
        name: user.lastname + ' ' + user.firstname,
        privileges: user.privileges,
      })
    } catch (e) {
      res
        .status(500)
        .json({ message: `Ошибка при запросе к базу данных: ${e}` })
    }
  }
)

module.exports = router
