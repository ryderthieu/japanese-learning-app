const mongoose = require('mongoose')
const Lesson = require('../models/lesson');
const Vocabulary = require('../models/vocabulary');
const Grammar = require('../models/grammar');

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

// Lấy chi tiết bài học kèm từ vựng/ngữ pháp
const getLessonDetail = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findById(lessonId)
            .populate('vocabulary')
            .populate('grammar');

        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { changeLessonStatus, getLessonDetail }