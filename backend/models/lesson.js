const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lesson = new Schema({
    _id: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    course: {type: Number, ref: 'Course'}
});

module.exports = mongoose.model('Lesson', lesson)