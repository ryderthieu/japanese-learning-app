const mongoose = require('mongoose')
const Lesson = require('../models/lesson');

const getLessonsInCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLessonsInCourse}