const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lesson = new Schema({
    title: {type: String, required: true},
    course: {type: Number, ref: 'Course'}
});

module.exports = mongoose.model('Lesson', lesson)