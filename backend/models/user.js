const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthday: {type: Date, required: true},
}, {
    timestamps: true
});

module.exports = mongoose.model('User', user)