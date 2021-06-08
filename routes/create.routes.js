const { Router } = require('express')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')
const config = require('config')
const User = require('../models/User')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Result = require('../models/Result')
const Program = require('../models/Program')
const fs = require('fs')
const Edudirection = require('../models/Edudirection')
const router = Router()

// Обработка POST запроса
router.post(
  '/user',
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

router.post(
  '/organization',
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

router.post('/group', auth, async (req, res) => {
  try {
    // То, что приходит в фронтенд (Получаем из body эти значения)
    const {
      name,
      dateStart,
      dateEnd,
      selectedTeachers,
      selectedUsers,
      selectedPrograms,
    } = req.body
    const organizationsSet = new Set()

    // Поиск человека по login
    const candidate = await Group.findOne({ name })

    // Если такая группа есть, то прекращаем выполнение скрипта RETURN и выводим сообщение
    if (candidate) {
      return res
        .status(400)
        .json({ message: 'Группа с таким номером уже существует' })
    }

    const users = selectedUsers.map((user) => user.value)
    const teachers = selectedTeachers.map((teacher) => teacher.value)
    const programs = selectedPrograms.map((program) => program.value)

    // Создаем группу
    const group = new Group({
      name,
      dateStart,
      dateEnd,
      teachers,
      users,
      programs,
    })

    // Находим все организации пользователей и записываем информацию, связанную с ними
    await Promise.all(
      users.map(async (user) => {
        const userToFind = await User.findById(user)
        await Promise.all(
          userToFind.organizations.map(async (organization) => {
            organizationsSet.add(organization.toString())
            const organizationFind = await Organization.findById(organization)
            // Для извлечения только уникальных значений
            const groupsSet = new Set()
            // Преобразуем типы в строку
            organizationFind.groups.map((group) =>
              groupsSet.add(group.toString())
            )
            groupsSet.add(group._id.toString())
            return await Organization.updateOne(
              { _id: organization },
              { groups: [...groupsSet] }
            )
          })
        )
      })
    )

    // Сохраняем в БД
    group.organizations = [...organizationsSet]
    const groupSaved = await group.save()
    // Объвяляем дополнительные константы
    const groupID = groupSaved._id
    const results = []

    // Создаем результаты-пустышки для отображения в списке курсов у пользователя
    await Promise.all(
      groupSaved.users.map(
        async (user) =>
          await Promise.all(
            groupSaved.programs.map(async (program) => {
              const result = new Result({
                group: groupID,
                user: user,
                program: program,
                scores: 0,
                scoresMax: 0,
                passingScore: 0,
                passed: false,
                questions: [],
                attempt: 0,
                attemptMax: 5,
              })
              await result.save()

              // Добавляем в массив результатов ID коллекции result
              return results.push(result._id)
            })
          )
      )
    )

    // Обновляем группу, добавляя идентификаторы только чтозданных записей результатов
    await Group.findByIdAndUpdate(groupID, {
      results,
    })

    res.status(201).json({ message: 'Группа создана' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post('/program', auth, async (req, res) => {
  try {
    // То, что приходит в фронтенд (Получаем из body эти значения)
    const { edudirection, name, volume, gallery, pdf } = req.body

    // Поиск программы по названию
    const candidate = await Program.findOne({ name })

    // Если такая программа есть, то прекращаем выполнение скрипта RETURN и выводим сообщение
    if (candidate) {
      return res.status(400).json({
        message: 'Программа обучения с таким названием уже существует',
      })
    }

    const edudir = edudirection.__isNew__
      ? new Edudirection({
          name: edudirection.value,
        })
      : edudirection.value

    // Создаем пользователя
    const program = new Program({
      edudirection: edudirection.__isNew__ ? edudir._id : edudir,
      name,
      volume,
      gallery,
      pdf,
    })

    // Сохраняем в БД
    await program.save()

    if (edudirection.__isNew__) {
      edudir.programs.push(program._id)
      await edudir.save()
    } else {
      const existedEdudir = await Edudirection.findById(edudir)
      existedEdudir.programs = [...existedEdudir.programs, program._id]
      await existedEdudir.save()
    }

    res.status(201).json(program)
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
