const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()
const path = require('path')
const config = require('config')
const multer = require('multer')

// Set Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get('avatarPath'))
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname).toLowerCase()
    )
  },
})

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Можно загружать только изображения')
  }
}

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
}).single('avatar')

router.post('/', auth, (req, res) => {
  console.log('Обработка загрузки изображения')

  upload(req, res, (err) => {
    console.log(req.file)
    if (err) {
      console.log('first err', err)
      res.status(400).json({ message: err })
    } else {
      if (req.file === undefined) {
        console.log('Файл не выбран')
        res.status(400).json({ message: 'Файл не выбран' })
      } else {
        console.log('Файл загружен')
        res.status(200).json({
          message: 'Файл загружен',
          file: req.file.filename,
        })
      }
    }
  })
})

module.exports = router
