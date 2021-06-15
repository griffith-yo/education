const express = require('express')
const config = require('config')
const path = require('path')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))
app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/create', require('./routes/create.routes'))
app.use('/api/update', require('./routes/update.routes'))
app.use('/api/upload/avatar', require('./routes/upload.avatar.routes'))
app.use('/api/upload/program', require('./routes/upload.program.routes'))
app.use('/api/delete', require('./routes/delete.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/dashboard', require('./routes/dashboard.routes'))
app.use('/api/organization', require('./routes/organization.routes'))
app.use('/api/group', require('./routes/group.routes'))
app.use('/api/program', require('./routes/program.routes'))
app.use('/api/student', require('./routes/student.routes'))
app.use('/api/result', require('./routes/result.routes'))
app.use(
  '/avatar',
  express.static(path.join(__dirname, 'client', 'public', 'uploads', 'avatar'))
)
app.use(
  '/program',
  express.static(path.join(__dirname, 'client', 'public', 'uploads', 'program'))
)

// Задаем папки по умолчанию
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  // А на любые другие запросы отправлять на файл index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log('Start'))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
