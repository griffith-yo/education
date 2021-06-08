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

// router.post('/avatar', auth, (req, res) => {
//   upload(req, res, (err) => {
//     const file = req.file
//     const prevUrl = req.body.prevUrl.slice(21) //I use slice to cut the public part of the path, since mine is accessible from anywhere.
//     // if (!err) {
//     //   //here you could add some call to save the prevUrl "url of the file to called it later on your front"
//     //   return User.findOneAndUpdate(
//     //     { _id: req.decoded.userId },
//     //     { avatarUrl: avatarUrl },
//     //     (err, user) => {
//     if (!err) {
//       return console.log(err)
//     }
//     return res.json({
//       success: true,
//       message: 'File has been successfully uploaded',
//       avatarUrl: 'http://localhost:3231/uploads/' + file.filename,
//     })
//   })
//   //   }
//   // })

//   console.log(err)
// })

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
// })

// router.post('/avatar', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) return res.send(400).json({ message: 'Ошибка' })
//     console.log('Request ---', req.body)
//     console.log('Request file ---', req.file) //Here you get file.
//     /*Now do where ever you want to do*/
//     if (!err) return res.send(200).end()
//   })
// })

// router.post('/avatar', auth, (req, res) => {
//   console.log('Обработка загрузки изображения')

//   upload(req, res, (err) => {
//     console.log(req.file)
//     if (err) {
//       console.log('first err', err)
//       res.status(400).json({ message: err })
//     } else {
//       if (req.file === undefined) {
//         console.log('Файл не выбран')
//         res.status(400).json({ message: 'Файл не выбран' })
//       } else {
//         console.log('Файл загружен')
//         res.status(200).json({
//           message: 'Файл загружен',
//           file: `uploads/${req.file.filename}`,
//         })
//       }
//     }
//   })
// })

module.exports = router
