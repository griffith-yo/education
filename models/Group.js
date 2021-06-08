const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  programs: [{ type: Types.ObjectId, ref: 'Program' }],
  users: [{ type: Types.ObjectId, ref: 'User' }],
  organizations: [{ type: Types.ObjectId, ref: 'Organization' }],
  teachers: [{ type: Types.ObjectId, ref: 'User' }],
  results: [{ type: Types.ObjectId, ref: 'Result' }],
})

module.exports = model('Group', schema)
