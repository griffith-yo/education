const { Router } = require('express')
const router = Router()
const { check, validationResult } = require('express-validator')
const Organization = require('../models/Organization')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
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
            groups: await mapSelectedGroups(organization.groups),
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

router.post(
  '/',
  auth,
  [check('email', 'Некорректный email').isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный e-mail',
        })
      }

      // То, что приходит в фронтенд (Получаем из body эти значения)
      const { email, name, selected } = req.body

      // Поиск человека по login
      const candidate = await Organization.findOne({ name })

      // Если такой пользователь есть, то прекращаем выполнение скрипта RETURN и выводим сообщение
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Организация с таким наименованием уже существует' })
      }

      // Видообразуем объекты в массиве из объектов, оставляя в каждом поле value
      const users = selected.map((user) => user.value)

      // Создаем пользователя
      const organization = new Organization({
        email,
        name,
        users,
      })

      // Сохраняем в БД
      await organization.save()

      // Заполняем запись пользователей организацией, которую создаем
      await Promise.all(
        users.map(async (user) => {
          const userToUpdate = await User.findById(user)
          if (!userToUpdate.organizations.includes(organization._id)) {
            userToUpdate.organizations.push(organization._id)
            return await userToUpdate.save()
          }
        })
      )

      res.status(201).json({ message: 'Организация создана' })
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
  [check('email', 'Некорректный email').isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный e-mail',
        })
      }

      // То, что приходит в фронтенд (Получаем из body эти значения)
      const { _id, email, name, selected } = req.body
      // Видеообразуем объекты в массиве из объектов, оставляя в каждом поле value
      const users = selected.map((user) => user.value)

      // Вычисляю удаленных пользователей из организации и если они есть, то убираем данную организацию у них
      const organization = await Organization.findById(_id)
      const removedUsers = organization.users.filter(
        (user) => !users.includes(user.toString())
      )
      if (removedUsers.length)
        await Promise.all(
          removedUsers.map(async (user) => {
            const userFind = await User.findById(user)
            if (userFind) {
              userFind.organizations = userFind.organizations.filter(
                (organization) => organization.toString() !== _id
              )
              await userFind.save()
            }
          })
        )

      // Заполняем запись пользователей организацией, которую создаем
      await Promise.all(
        users.map(async (user) => {
          const userToUpdate = await User.findById(user)
          if (!userToUpdate.organizations.includes(_id)) {
            userToUpdate.organizations.push(_id)
            return await userToUpdate.save()
          }
        })
      )

      await Organization.findByIdAndUpdate(_id, {
        email,
        name,
        users,
      })

      res.status(202).json({ message: 'Организация обновлена' })
    } catch (e) {
      res
        .status(500)
        .json({ message: `Ошибка при запросе к базу данных: ${e}` })
    }
  }
)

module.exports = router
