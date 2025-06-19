const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const vocabulary = new Schema({
    word: {type: String, required: true},
    kanji: {type: String},
    romanji: {type: String},
    meaning: {type: String, required: true},
    kanjiMeaning: {type: String},
    level: {type: String, enum : ["N5", "N4", "N3", "N2", "N1"]},
    examples: [{
        sentences: {type: String},
        translation: {type: String}
    }],
    category: {type: String},
});

module.exports = mongoose.model('Vocabulary', vocabulary)
