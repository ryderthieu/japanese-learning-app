const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const video = new Schema({
    code: {type: String, required: true},
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'}
});

module.exports = mongoose.model('Video', video)