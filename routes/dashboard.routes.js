const { Router } = require('express')
const User = require('../models/User')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Program = require('../models/Program')
const Result = require('../models/Result')
const Edudirection = require('../models/Edudirection')
const auth = require('../middleware/auth.middleware')
const { mapSelectedOrganizations } = require('../hook/map')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}).count()
    const organizations = await Organization.find({}).count()
    const groups = await Group.find({}).count()
    const programs = await Program.find({}).count()
    const results = await Result.find({})
    const realResults = results.filter((result) => result.attempt !== 0)
    const edudirections = await Edudirection.find({}).count()

    res.status(200).json({
      users,
      organizations,
      groups,
      programs,
      results: realResults.length,
      edudirections,
    })
  } catch (e) {
    res.status(500).json({ message: `Ошибка при запросе к базу данных: ${e}` })
  }
})

module.exports = router
