const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  volume: { type: Number },
  edudirection: { type: Types.ObjectId, ref: 'Edudirection' },
  gallery: [{ type: Object }],
  pdf: [{ type: Object }],
  sections: [
    {
      sectionTheme: { type: String },
      sectionName: { type: String },
      sectionBody: { type: String },
    },
  ],
  questions: [
    {
      questionName: { type: String },
      questionAnswers: [
        {
          answerName: { type: String },
          correctness: { type: String },
        },
      ],
      sectionBody: { type: String },
    },
  ],
})

module.exports = model('Program', schema)
