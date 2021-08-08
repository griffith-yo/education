const { Router } = require('express')
const User = require('../models/User')
const Group = require('../models/Group')
const Program = require('../models/Program')
const Result = require('../models/Result')
const auth = require('../middleware/auth.middleware')
const { mapSelectedUsers, mapSelectedPrograms } = require('../hook/map')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const userID = req.headers.userid
    // Массив для хранения курсов для вывода пользователю
    const courseArr = []
    // Массив для хранения существующих результатов одинаковых попыток
    const existedResult = []

    // Находим все результаты авторизованного ученика
    const result = await Result.find({ user: userID })
      .sort({ _id: -1 })
      .limit(1000)
    console.log(result)
    // Перебираем найденный массив результатов с конца
    await Promise.all(
      result.map(async (result, index) => {
        // Выбираем первый результат с конца для отображения актуальной попытки
        if (
          existedResult.includes(
            JSON.stringify({
              user: userID,
              group: result.group,
              program: result.program,
            })
          )
        )
          return
        else
          existedResult.push(
            JSON.stringify({
              user: userID,
              group: result.group,
              program: result.program,
            })
          )

        // Находим группу по результату
        const group = await Group.findById(result.group)

        // // Находим преподавателя по группе
        // const teachers = await Promise.all(
        //   group.teachers.map(async (user) => {
        //     const teacher = await User.findById(user.value)
        //     return (
        //       teacher.lastname +
        //       ' ' +
        //       teacher.firstname +
        //       ' ' +
        //       teacher.patronymic
        //     )
        //   })
        // )

        // Находим программу по группе
        const program = await Program.findById(result.program)
        console.log(1)
        console.log(group.dateEnd)
        const currentDate = new Date()
        const minDate = new Date(group.dateStart)
        const maxDate = new Date(group.dateEnd)

        // Проверяем на соответствие текущей даты - промежуку дат доступа и заполняем результирующий массив
        if (
          currentDate > minDate &&
          currentDate < maxDate &&
          group &&
          program
        ) {
          courseArr.push({
            _id: result._id,
            group: group.name,
            teachers: await mapSelectedUsers(group.teachers),
            program: program.name,
            dateStart: group.dateStart.toLocaleDateString(),
            dateEnd: group.dateEnd.toLocaleDateString(),
            passed: result.passed,
            attempt: result.attempt,
            attemptMax: result.attemptMax,
            groupID: result.group,
            programID: result.program,
          })
        }
        return
      })
    )

    res.json(courseArr)
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post('/submit', auth, async (req, res) => {
  try {
    const { resultQuestions, programID, groupID } = req.body
    const userID = req.headers.userid

    const program = await Program.findById(programID)

    let scores = 0
    let passed = false
    const scoresMax = program.questions.length
    const passingScore = Math.ceil(scoresMax * 0.8)

    // Вычисляем расхождения массивов. Если массив изначальный и результирующий сопадают, то добавляем балл
    const questions = resultQuestions.map((question, qIndex) => {
      const answerCount = program.questions[qIndex].questionAnswers.length
      const coincidences = question.questionAnswers.filter((rAnswer, rIndex) =>
        program.questions[qIndex].questionAnswers.some(
          (iAnswer) =>
            rAnswer.correctness === iAnswer.correctness &&
            rAnswer.answerName === iAnswer.answerName
        )
      ).length
      if (answerCount === coincidences) {
        scores++
        return { ...question, success: true }
      } else {
        return { ...question, success: false }
      }
    })

    // Устанавливаем результат теста
    if (scores >= passingScore) passed = true

    // Устанавливаем актуальную попытку прохождения теста
    const resultFind = await Result.find(
      { user: userID, group: groupID, program: programID },
      'attempt attemptMax teachers'
    )

    const attempts = resultFind.map((data) => data.attempt)
    const attemptMax = resultFind.map((data) => data.attemptMax)

    const result = new Result({
      group: groupID,
      user: userID,
      program: programID,
      scores,
      scoresMax,
      passingScore,
      passed,
      questions,
      attempt: attempts.pop() + 1,
      attemptMax: attemptMax[0],
    })

    // Обновляем группу - заносим ID нового результата
    const group = await Group.findById(groupID)
    group.results.push(result._id)

    await group.save()
    await result.save()

    if (passed)
      res.status(201).json({ message: 'Тестирование пройдено успешно' })
    else res.status(201).json({ message: 'Тестирование не пройдено' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
