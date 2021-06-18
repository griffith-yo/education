const { Router } = require('express')
const router = Router()
const path = require('path')
const config = require('config')
const multer = require('multer')
const Program = require('../models/Program')
const auth = require('../middleware/auth.middleware')
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
  cpUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Случилась ошибка Multer при загрузке.
      console.log(err)
      res.status(400).json({ message: err })
    } else if (err) {
      // При загрузке произошла неизвестная ошибка.
      console.log(err)
      res.status(400).json({ message: err })
    }
    const newGallery = req.files.gallery
    const newPdf = req.files.pdf

    const { _id } = req.body

    // Поиск человека по login
    const program = await Program.findById(_id)

    await Program.findByIdAndUpdate(_id, {
      gallery: newGallery
        ? [...program.gallery, ...newGallery]
        : program.gallery,
      pdf: newPdf ? [...program.pdf, ...newPdf] : program.pdf,
    })

    return res.status(201).json({ message: 'Галерея пополнена' })
  })
})

module.exports = router
