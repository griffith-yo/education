const { Router } = require('express')
const Organization = require('../models/Organization')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()
const { mapSelectedUsers, mapUsers, mapSelectedGroups } = require('../hook/map')

router.get('/', auth, async (req, res) => {
  try {
    const organizations = await Organization.find({})
      .sort({ _id: -1 })
      .limit(1000)

    res.json(
      await Promise.all(
        organizations.map(async (organization) => {
          return {
            _id: organization._id,
            name: organization.name,
            email: organization.email,
            groups: organization.groups.length
              ? await mapSelectedGroups(organization.groups)
              : 'Групп нет',
            users: await mapSelectedUsers(organization.users),
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
    const organization = await Organization.findById(req.params.id)
    const users = await User.find({})

    res.json({
      _id: organization._id,
      name: organization.name,
      email: organization.email,
      options: mapUsers(users),
      selected: await mapSelectedUsers(organization.users),
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/search/:value', auth, async (req, res) => {
  try {
    search = req.params.value

    const obj = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }

    const organizations = await Organization.find(obj).sort({ _id: -1 })
    res.status(200).json(
      await Promise.all(
        await Promise.all(
          organizations.map(async (organization) => {
            return {
              _id: organization._id,
              name: organization.name,
              email: organization.email,
              groups: organization.groups.length
                ? await mapSelectedGroups(organization.groups)
                : 'Групп нет',
              users: await mapSelectedUsers(organization.users),
            }
          })
        )
      )
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
