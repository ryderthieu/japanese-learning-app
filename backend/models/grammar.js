const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const grammar = new Schema({
    structure: { type: String, required: true },
    meaning: { type: String, required: true }, 
    example: [{
        sentences: {type: String},
        translation: {type: String}
    }],
});

module.exports = mongoose.model('Grammar', grammar)