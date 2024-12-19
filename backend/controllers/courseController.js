const mongoose = require('mongoose');
const Course = require('../models/course');

const getAllCourses = async (req, res) => {
    try {
        const { level, type } = req.query;
        const query = {};

        if (level) query.level = level;
        if (type) query.type = type;
        const courses = await Course.find(query);  

        res.json(courses); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
              return res.status(400).json({ message: "Khóa học không hợp lệ" });
            }
        const course = await Course.findById(courseId).populate('lessons');
        console.log(course)
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getAllCourses, getCourseById };
