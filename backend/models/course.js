const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const course = new Schema({
    title: {type: String},
    description: {type: String},
    thumbnail: {type: String},
    level: {type: String, enum : ['N5', 'N4', 'N3', 'N2', 'N1']},
    price: {type: Number},
    lessons: [{type: Schema.Types.ObjectId, ref: 'Lesson'}],
});

module.exports = mongoose.model('Course', course)