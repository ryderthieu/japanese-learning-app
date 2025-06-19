const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const grammar = new Schema({
    rule: { type: String, required: true },
    meaning: { type: String, required: true }, 
    examples: [{
        sentences: {type: String},
        translation: {type: String}
    }],
    level: {type: String, enum : ["N5", "N4", "N3", "N2", "N1"]},
});



module.exports = mongoose.model('Grammar', grammar)