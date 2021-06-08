const { Router } = require('express')
const Program = require('../models/Program')
const auth = require('../middleware/auth.middleware')
const config = require('config')
const Edudirection = require('../models/Edudirection')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const programs = await Program.find({}).sort({ _id: -1 }).limit(1000)

    res.status(200).json(
      await Promise.all(
        programs.map(async (program) => {
          const edudirection = await Edudirection.findById(program.edudirection)
          return {
            _id: program._id,
            edudirection: edudirection
              ? edudirection.name
              : 'Направление удалено',
            name: program.name,
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
    const program = await Program.findById(req.params.id)
    const edudirection = await Edudirection.findById(program.edudirection)

    res.status(200).json({
      _id: program._id,
      edudirection: {
        label: edudirection ? edudirection.name : 'Направление удалено',
        value: edudirection ? edudirection._id : 'Направление удалено',
      },
      name: program.name,
      volume: program.volume,
      gallery: program.gallery,
      pdf: program.pdf,
      sections: program.sections,
      questions: program.questions,
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/edudirection/get', auth, async (req, res) => {
  try {
    const edudirection = await Edudirection.find({})

    res.status(200).json(
      edudirection.map((edudirection) => {
        return {
          value: edudirection._id.toString(),
          label: edudirection.name,
        }
      })
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/gallery/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)

    res.json({
      result: program.gallery.map((pic) => {
        return {
          src: '/program/gallery/' + pic.filename,
          name: pic.originalname,
          alt: 'Картинка',
          tag: 'gallery',
        }
      }),
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/:id/questions', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
    res.status(200).json(program.questions)
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.post('/questions/save', async (req, res) => {
  try {
    const { questions, _id } = req.body

    await Program.findByIdAndUpdate(_id, {
      questions,
    })
    res.status(200).json({ message: 'Вопросы обновлены' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/search/:value', auth, async (req, res) => {
  try {
    search = req.params.value

    const objEdudirection = {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    }

    const edudirections = await Edudirection.find(objEdudirection, '_id').sort({
      _id: -1,
    })

    const objProgram = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { edudirection: { $in: edudirections } },
      ],
    }

    const programs = await Program.find(objProgram).sort({ _id: -1 })

    res.status(200).json(
      await Promise.all(
        programs.map(async (program) => {
          const edudirection = await Edudirection.findById(program.edudirection)
          return {
            _id: program._id,
            edudirection: edudirection
              ? edudirection.name
              : 'Направление удалено',
            name: program.name,
          }
        })
      )
    )
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
