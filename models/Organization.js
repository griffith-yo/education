const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  fullName: { type: String },
  email: { type: String },
  users: [{ type: Types.ObjectId, ref: 'User' }],
  groups: [{ type: Types.ObjectId, ref: 'Group' }],
})

module.exports = model('Organization', schema)
