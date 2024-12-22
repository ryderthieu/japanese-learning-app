const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true }, 
      isCorrect: { type: Boolean, default: false },
    },
  ],
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] }, 
  type: { type: String, required: true, enum: ['kanji', 'grammar', 'listening', 'reading', 'vocabulary'] }, 
  explanation: { type: String }, 
  correctAnswer: { type: String }, 
}, { timestamps: true }); 

module.exports = mongoose.model('Question', questionSchema);
