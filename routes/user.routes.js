const { Router } = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const { mapSelectedOrganizations } = require('../hook/map')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 }).limit(1000)

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

module.exports = router
