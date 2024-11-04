const mongoose = require('mongoose')
const Lesson = require('../models/lesson');

const addLesson = async (req, res) => {
    try {
        const { _id, title, course } = req.body;

        const newLesson = new Lesson({
            _id,
            title,
            course
        });
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);  

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addLesson}