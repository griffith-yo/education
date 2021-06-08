const { Router } = require('express')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Program = require('../models/Program')
const Result = require('../models/Result')
const Edudirection = require('../models/Edudirection')
const router = Router()

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

      res.status(200).json({ message: 'Пользователь обновлен' })
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
            userFind.organizations = userFind.organizations.filter(
              (organization) => organization.toString() !== _id
            )
            await userFind.save()
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

      res.status(200).json({ message: 'Организация обновлена' })
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
      _id,
      name,
      dateStart,
      dateEnd,
      selectedPrograms,
      selectedTeachers,
      selectedUsers,
    } = req.body
    const organizationsSet = new Set()

    // Поиск уже созданных результатов-пустышек. Если добавлен пользователь, которого не было - создаем новую пустышку
    await Promise.all(
      selectedUsers.map(async (user) => {
        // Параллельно обновляем организации к группе, оставляя уникальные элементы
        const userToFind = await User.findById(user.value)

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
            groupsSet.add(_id)
            return await Organization.updateOne(
              { _id: organization },
              { groups: [...groupsSet] }
            )
          })
        )

        selectedPrograms.map(async (program) => {
          const existedResult = await Result.find({
            group: _id,
            user: user.value,
            program: program.value,
          })

          // Если есть, то не заносим новые
          if (existedResult.length) return

          const result = new Result({
            group: _id,
            user: user.value,
            program: program.value,
            scores: 0,
            scoresMax: 0,
            passingScore: 0,
            passed: false,
            questions: [],
            attempt: 0,
            attemptMax: 5,
          })

          return await result.save()
        })
        return
      })
    )

    // Обновляем группу
    await Group.findByIdAndUpdate(_id, {
      name,
      dateStart,
      dateEnd,
      programs: selectedPrograms.map((program) => program.value),
      teachers: selectedTeachers.map((teacher) => teacher.value),
      users: selectedUsers.map((user) => user.value),
      organizations: [...organizationsSet],
    })

    res.status(200).json({ message: 'Группа обновлена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post('/program', auth, async (req, res) => {
  try {
    const { _id, edudirection, name, volume, gallery, pdf, sections } = req.body

    const edudir = edudirection.__isNew__
      ? new Edudirection({
          name: edudirection.value,
        })
      : edudirection.value

    // Находим программу для идентификации предыдущего направления обучения
    const program = await Program.findById(_id)

    // Убираем из предыдущего направления индентификатор программы обучения
    const prevEdudir = await Edudirection.findById(program.edudirection)
    if (prevEdudir) {
      prevEdudir.programs = prevEdudir.programs.filter(
        (programId) => programId.toString() !== program._id.toString()
      )
      await prevEdudir.save()
    }

    // Обновляем программу
    await Program.findByIdAndUpdate(_id, {
      edudirection: edudirection.__isNew__ ? edudir._id : edudir,
      name,
      volume,
      gallery,
      pdf,
      sections,
    })

    if (edudirection.__isNew__) {
      edudir.programs.push(program._id)
      await edudir.save()
    } else {
      const existedEdudir = await Edudirection.findById(edudir)
      if (!existedEdudir.programs.includes(program._id)) {
        existedEdudir.programs.push(program._id)
        await existedEdudir.save()
      }
    }

    res.status(200).json({ message: 'Программа обучения обновлена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
