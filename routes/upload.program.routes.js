const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()
const path = require('path')
const Program = require('../models/Program')
const config = require('config')
const multer = require('multer')
const { getRandomBetween } = require('../hook/helpers')

// Set Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    if (file.fieldname === 'gallery') {
      cd(null, config.get('programGalleryPath'))
    } else if (file.fieldname === 'pdf') {
      cd(null, config.get('programPDFPath'))
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        getRandomBetween(10, 90) +
        path.extname(file.originalname).toLowerCase()
    )
  },
})

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf/
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
  limits: { fileSize: 20000000 }, // 2МБ
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

const cpUpload = upload.fields([
  { name: 'gallery', maxCount: 20 },
  { name: 'pdf', maxCount: 20 },
])

router.post('/', auth, (req, res) => {
  console.log('Обработка загрузки изображения')

  cpUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Случилась ошибка Multer при загрузке.
      console.log(err)
      res.status(400).json({ message: err })
    } else if (err) {
      // При загрузке произошла неизвестная ошибка.
      console.log(err)
      res.status(400).json({ message: err })
    }
    const files = req.files
    console.log(files)
    console.log('Файлы загружены')

    return res.status(201).json({
      files,
      message: 'Галерея пополнена',
    })
  })
})

router.post('/pathtodb', auth, async (req, res) => {
  try {
    // То, что приходит в фронтенд (Получаем из body эти значения)
    const { _id, gallery, pdf } = req.body

    // Поиск человека по login
    await Program.findByIdAndUpdate(_id, {
      gallery,
      pdf,
    })

    res.status(201).json({ message: 'Программа обучения обновлена' })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
