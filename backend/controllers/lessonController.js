const mongoose = require('mongoose')
const Lesson = require('../models/lesson');

const changeLessonStatus = async (req, res) => {
    try {
        const {lessonId, isCompleted} = req.body
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học' })
        }
        lesson.isCompleted = isCompleted
        await lesson.save()
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { changeLessonStatus}