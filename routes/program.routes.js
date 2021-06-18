const { Router } = require('express')
const router = Router()
const Program = require('../models/Program')
const Edudirection = require('../models/Edudirection')
const auth = require('../middleware/auth.middleware')

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

router.post('/', auth, async (req, res) => {
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

    res.status(201).json(program._id)
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.put('/', auth, async (req, res) => {
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

    res.status(202).json({ message: 'Программа обучения обновлена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
