const { Router } = require('express')
const router = Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Organization = require('../models/Organization')
const auth = require('../middleware/auth.middleware')
const { mapSelectedOrganizations } = require('../hook/map')

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 }).limit(1000)

    res.status(200).json(
      await Promise.all(
        users.map(async (user) => {
          return {
            ...user._doc,
            organizations: await mapSelectedOrganizations(user.organizations),
          }
        })
      )
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/search/:value', auth, async (req, res) => {
  try {
    search = req.params.value

    const obj = {
      $or: [
        { lastname: { $regex: search, $options: 'i' } },
        { firstname: { $regex: search, $options: 'i' } },
        { patronymic: { $regex: search, $options: 'i' } },
        { login: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { post: { $regex: search, $options: 'i' } },
      ],
    }

    const users = await User.find(obj).sort({ _id: -1 })

    res.status(200).json(
      await Promise.all(
        users.map(async (user) => {
          return {
            ...user._doc,
            organizations: user.organizations.length
              ? await mapSelectedOrganizations(user.organizations)
              : 'Организаций нет',
          }
        })
      )
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post(
  '/',
  auth,
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 8 символов').isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректная длина пароля или e-mail',
        })
      }

      // То, что приходит в фронтенд (Получаем из body эти значения)
      const {
        login,
        email,
        password,
        password2,
        firstname,
        lastname,
        patronymic,
        post,
        privileges,
        avatar,
      } = req.body

      if (password !== password2) {
        return res.status(400).json({
          message: 'Введеные пароли не совпадают',
        })
      }

      // Поиск человека по login
      const candidate = await User.findOne({ login })

      // Если такой пользователь есть, то прекращаем выполнение скрипта RETURN и выводим сообщение
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Пользователь с таким логином уже существует' })
      }

      // Ждем шифрования пароля
      const hashedPassword = await bcrypt.hash(password, 12)
      // Создаем пользователя
      const user = new User({
        login,
        email,
        password: hashedPassword,
        lastname,
        firstname,
        patronymic,
        shortname: lastname + ' ' + firstname,
        fullname: lastname + ' ' + firstname + ' ' + patronymic,
        post,
        privileges,
        avatar,
      })
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

router.put(
  '/',
  auth,
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 8 символов').isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректная длина пароля или e-mail',
        })
      }

      // То, что приходит в фронтенд (Получаем из body эти значения)
      const {
        _id,
        login,
        email,
        password,
        password2,
        firstname,
        lastname,
        patronymic,
        post,
        privileges,
        avatar,
      } = req.body

      if (password !== password2) {
        return res.status(400).json({
          message: 'Введеные пароли не совпадают',
        })
      }

      // Ждем шифрования пароля
      const hashedPassword = await bcrypt.hash(password, 12)

      await User.findByIdAndUpdate(_id, {
        login,
        email,
        password: hashedPassword,
        firstname,
        lastname,
        patronymic,
        shortname: lastname + ' ' + firstname,
        fullname: lastname + ' ' + firstname + ' ' + patronymic,
        post,
        privileges,
        avatar,
      })

      res.status(202).json({ message: 'Пользователь обновлен' })
    } catch (e) {
      res
        .status(500)
        .json({ message: `Ошибка при запросе к базу данных: ${e}` })
    }
  }
)

module.exports = router
