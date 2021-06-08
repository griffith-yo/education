const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  programs: [{ type: Types.ObjectId, ref: 'Program' }],
})

module.exports = model('Edudirection', schema)
