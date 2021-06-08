const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, require: true },
  lastname: { type: String },
  firstname: { type: String },
  patronymic: { type: String },
  shortname: { type: String },
  fullname: { type: String },
  post: { type: String },
  privileges: { type: String },
  avatar: { type: String, default: '' },
  organizations: [{ type: Types.ObjectId, ref: 'Organization' }],
})

module.exports = model('User', schema)
