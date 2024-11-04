const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const course = new Schema({
    _id: {type: Number, required: true, unique: true},
    title: {type: String},
    description: {type: String},
    thumbnail: {type: String},
    level: {type: String, enum : ['N5', 'N4', 'N3', 'N2', 'N1']},
});

module.exports = mongoose.model('Course', course)