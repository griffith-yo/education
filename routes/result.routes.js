const { Router } = require('express')
const User = require('../models/User')
const Program = require('../models/Program')
const Group = require('../models/Group')
const Result = require('../models/Result')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const result = await Result.find({}).sort({ _id: -1 }).limit(1000)

    const resultFiltered = await Promise.all(
      result.map(async (result) => {
        const user = await User.findById(
          result.user,
          '_id lastname firstname patronymic'
        )
        const group = await Group.findById(result.group, '_id name')
        const program = await Program.findById(result.program, '_id name')

        if (result.attempt)
          return {
            _id: result._id,
            userID: result.user,
            programID: result.program,
            groupID: result.group,
            group: {
              value: group._id,
              label: group.name,
            },
            user: {
              value: user._id,
              label:
                user.lastname + ' ' + user.firstname + ' ' + user.patronymic,
            },
            program: {
              value: program._id,
              label: program.name,
            },
            scores: result.scores,
            scoresMax: result.scoresMax,
            passingScore: result.passingScore,
            passed: result.passed,
            attempt: result.attempt,
            attemptMax: result.attemptMax,
          }
        return
      })
    )

    // В ответе отсеиваем пустые элементы массива
    res.status(200).json(resultFiltered.filter((result) => result))
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/:groupID/:programID/:userID/:attempt', auth, async (req, res) => {
  try {
    const userID = req.params.userID
    const programID = req.params.programID
    const groupID = req.params.groupID
    const attempt = req.params.attempt

    const result = await Result.findOne({
      user: userID,
      program: programID,
      group: groupID,
      attempt,
    })
    const user = await User.findById(userID, 'lastname firstname patronymic')
    const group = await Group.findById(groupID, 'name')
    const program = await Program.findById(programID, 'name questions')

    res.json({
      group: group.name,
      user: user.lastname + ' ' + user.firstname + ' ' + user.patronymic,
      program: program.name,
      scores: result.scores,
      scoresMax: result.scoresMax,
      passingScore: result.passingScore,
      passed: result.passed,
      attempt: result.attempt,
      attemptMax: result.attemptMax,
      questions: result.questions,
      initialQuestions: program.questions,
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/search/:value', auth, async (req, res) => {
  try {
    search = req.params.value

    const objGroup = {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    }
    const objProgram = {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    }
    const objUser = {
      $or: [
        { lastname: { $regex: search, $options: 'i' } },
        { firstname: { $regex: search, $options: 'i' } },
        { patronymic: { $regex: search, $options: 'i' } },
      ],
    }

    const groups = await Group.find(objGroup, '_id').sort({ _id: -1 })
    const programs = await Program.find(objProgram, '_id').sort({ _id: -1 })
    const users = await User.find(objUser, '_id').sort({ _id: -1 })

    const objResult = {
      $or: [
        { user: { $in: users } },
        { group: { $in: groups } },
        { program: { $in: programs } },
      ],
    }

    const result = await Result.find(objResult).sort({ _id: -1 })

    const resultFiltered = await Promise.all(
      result.map(async (result) => {
        const user = await User.findById(
          result.user,
          '_id lastname firstname patronymic'
        )
        const group = await Group.findById(result.group, '_id name')
        const program = await Program.findById(result.program, '_id name')

        if (result.attempt)
          return {
            _id: result._id,
            userID: result.user,
            programID: result.program,
            groupID: result.group,
            group: {
              value: group._id,
              label: group.name,
            },
            user: {
              value: user._id,
              label:
                user.lastname + ' ' + user.firstname + ' ' + user.patronymic,
            },
            program: {
              value: program._id,
              label: program.name,
            },
            scores: result.scores,
            scoresMax: result.scoresMax,
            passingScore: result.passingScore,
            passed: result.passed,
            attempt: result.attempt,
            attemptMax: result.attemptMax,
          }
        return
      })
    )

    // В ответе отсеиваем пустые элементы массива
    res.status(200).json(resultFiltered.filter((result) => result))
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
