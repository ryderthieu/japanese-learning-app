const mongoose = require('mongoose');
const Course = require('../models/course');

const getAllCourses = async (req, res) => {
    try {
        const { level, type } = req.query;
        const query = {};

        if (level) query.level = level;
        if (type) query.type = type;
        const courses = await Course.find(query).populate('lessons');  

        res.json(courses); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('lessons');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getAllCourses, getCourseById };
