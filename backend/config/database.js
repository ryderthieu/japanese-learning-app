const mongoose = require('mongoose');
const PORT = process.env.PORT
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/japanese_learning');
        console.log('connect successfully!')
    } catch (error) {
        console.log('error!')
    }
}

module.exports = { connect }