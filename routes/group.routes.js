const { Router } = require('express')
const router = Router()
const Group = require('../models/Group')
const User = require('../models/User')
const Program = require('../models/Program')
const Organization = require('../models/Organization')
const Result = require('../models/Result')
const auth = require('../middleware/auth.middleware')
const {
  mapSelectedUsers,
  mapSelectedUsersWithResult,
  mapSelectedPrograms,
  mapSelectedProgramsAndEdudir,
  mapUsers,
  mapPrograms,
} = require('../hook/map')
const { getDay, getMonth, getFullYear } = require('../hook/date')

router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({}).sort({ _id: -1 }).limit(1000)

    res.json(
      await Promise.all(
        groups.map(async (group) => {
          return {
            _id: group._id,
            name: group.name,
            result: await mapSelectedUsersWithResult(
              group.users,
              group.programs,
              group._id
            ),
            dateStart:
              group.dateStart.toLocaleDateString() || 'Дата не была введена',
            dateEnd:
              group.dateEnd.toLocaleDateString() || 'Дата не была введена',
            selectedUsers: await mapSelectedUsers(group.users),
            selectedTeachers: await mapSelectedUsers(group.teachers),
            selectedPrograms: await mapSelectedProgramsAndEdudir(
              group.programs
            ),
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
    const group = await Group.findById(req.params.id)
    const users = await User.find({})
    const programs = await Program.find({})

    res.json({
      _id: group._id,
      name: group.name,
      dateStart:
        getFullYear(group.dateStart) +
        '-' +
        getMonth(group.dateStart) +
        '-' +
        getDay(group.dateStart),
      dateEnd:
        getFullYear(group.dateEnd) +
        '-' +
        getMonth(group.dateEnd) +
        '-' +
        getDay(group.dateEnd),
      optionsTeacher: mapUsers(users),
      optionsUsers: mapUsers(users),
      optionsPrograms: mapPrograms(programs),
      selectedUsers: await mapSelectedUsers(group.users),
      selectedTeachers: await mapSelectedUsers(group.teachers),
      selectedPrograms: await mapSelectedPrograms(group.programs),
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/search/:value', auth, async (req, res) => {
  try {
    search = req.params.value

    const obj = {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    }

    const groups = await Group.find(obj).sort({ _id: -1 })

    res.status(200).json(
      await Promise.all(
        await Promise.all(
          groups.map(async (group) => {
            return {
              _id: group._id,
              name: group.name,
              result: await mapSelectedUsersWithResult(
                group.users,
                group.programs,
                group._id
              ),
              dateStart: group.dateStart.toLocaleDateString(),
              dateEnd: group.dateEnd.toLocaleDateString(),
              selectedUsers: await mapSelectedUsers(group.users),
              selectedTeachers: await mapSelectedUsers(group.teachers),
              selectedPrograms: await mapSelectedProgramsAndEdudir(
                group.programs
              ),
            }
          })
        )
      )
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post('/', auth, async (req, res) => {
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

router.put('/', auth, async (req, res) => {
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

    res.status(202).json({ message: 'Группа обновлена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
