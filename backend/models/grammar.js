const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const grammar = new Schema({
    structure: { type: String, required: true },
    meaning: { type: String, required: true }, 
    examples: [{ type: String }],
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'}
});

module.exports = mongoose.model('Grammar', grammar)