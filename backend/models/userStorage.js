const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userStorage = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    savedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }], 
    savedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('UserStorage', userStorage)