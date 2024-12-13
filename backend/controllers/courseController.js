const mongoose = require('mongoose')
const Course = require('../models/course')

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        res.json(courses)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addCourse = async (req, res) => {
    try {
        const { _id, title, description, thumbnail, level } = req.body;

        const newCourse = new Course({
            title,
            description,
            thumbnail,
            level
        });
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);  

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {getAllCourses, addCourse}