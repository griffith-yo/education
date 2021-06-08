const { Router } = require('express')
const User = require('../models/User')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Program = require('../models/Program')
const auth = require('../middleware/auth.middleware')
const fs = require('fs')
const config = require('config')
const router = Router()

router.get('/user/:_id', auth, async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params._id })
    res.status(200).json({ message: 'Пользователь удален' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/organization/:_id', auth, async (req, res) => {
  try {
    await Organization.deleteOne({ _id: req.params._id })
    res.status(200).json({ message: 'Организация удалена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/group/:_id', auth, async (req, res) => {
  try {
    await Group.deleteOne({ _id: req.params._id })
    res.status(200).json({ message: 'Группа удалена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/program/:_id', auth, async (req, res) => {
  try {
    const programId = req.params._id
    const program = await Program.findById(programId)

    await Program.deleteOne({ _id: programId })

    // Удаляем файлы программы обучения
    program.pdf.map((pdf) =>
      fs.unlinkSync(config.get('programPDFPath') + pdf.filename)
    )
    program.gallery.map((gallery) =>
      fs.unlinkSync(config.get('programGalleryPath') + gallery.filename)
    )

    res.status(200).json({ message: 'Программа удалена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/program/gallery/:_id/:filename', auth, async (req, res) => {
  try {
    // Массив для временного хранения галереи без удаленного объекта
    const program = await Program.findById({ _id: req.params._id })

    program.gallery = program.gallery.filter(
      (item) => item.filename !== req.params.filename
    )

    fs.unlinkSync(config.get('programGalleryPath') + req.params.filename)

    await program.save()

    res.status(200).json({ message: 'Картинка удалена' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

router.get('/program/pdf/:_id/:filename', auth, async (req, res) => {
  try {
    // Массив для временного хранения галереи без удаленного объекта
    const program = await Program.findById({ _id: req.params._id })

    program.pdf = program.pdf.filter(
      (item) => item.filename !== req.params.filename
    )

    fs.unlinkSync(config.get('programPDFPath') + req.params.filename)

    await program.save()

    res.status(200).json({ message: 'Файл удален' })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
