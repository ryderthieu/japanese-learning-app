const mongoose = require('mongoose');
const Course = require('../models/course');

// Lấy tất cả khóa học
const getAllCourses = async (req, res) => {
    try {
        const { level, type, difficulty, page = 1, limit = 10, search } = req.query;
        const query = {};

        if (level) query.level = level;
        if (type) query.type = type;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const courses = await Course.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('lessons');

        const total = await Course.countDocuments(query);

        res.json({
            courses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy khóa học theo ID
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
              return res.status(400).json({ message: "Khóa học không hợp lệ" });
            }
        const course = await Course.findById(courseId).populate('lessons');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo khóa học mới
const createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const course = new Course(courseData);
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật khóa học
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Khóa học không hợp lệ" });
        }
        const course = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa khóa học
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Khóa học không hợp lệ" });
        }
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
