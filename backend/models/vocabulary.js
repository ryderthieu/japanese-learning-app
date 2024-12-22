const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const vocabulary = new Schema({
    word: {type: String, required: true},
    kanji: {type: String},
    romanji: {type: String},
    meaning: {type: String, required: true},
    kanjiMeaning: {type: String},
    example: [{
        sentences: {type: String},
        translation: {type: String}
    }],
    type: {type: String},
    lesson: {type: Number, ref: 'Lesson'}
});

module.exports = mongoose.model('Vocabulary', vocabulary)