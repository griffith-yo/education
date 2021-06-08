const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  group: { type: Types.ObjectId, ref: 'Group' },
  user: { type: Types.ObjectId, ref: 'User' },
  program: { type: Types.ObjectId, ref: 'Program' },
  scores: { type: Number },
  scoresMax: { type: Number },
  passingScore: { type: Number },
  passed: { type: Boolean },
  attempt: { type: Number, default: 0 },
  attemptMax: { type: Number, default: 5 },
  questions: { type: Array },
})

module.exports = model('Result', schema)
