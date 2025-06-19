const express = require('express')
const {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCoursesByJLPTLevel, getCoursesByJLPTSection, getCoursesByJLPTType, searchJLPTCourses, getJLPTCourseStats, getJLPTCourseStatsByLevel, getJLPTCourseStatsBySection, getEnrolledJLPTCourses, getRecommendedJLPTCourses, getJLPTCourseProgress, updateJLPTCourseProgress, getJLPTCourseLessons, getJLPTCourseTests} = require('../controllers/courseController')
const { authenticateJWT } = require('../middleware/authMiddleware')

const router = express.Router()

// Basic CRUD routes
router.get('/', getAllCourses)
router.get('/:courseId', getCourseById)
router.post('/', authenticateJWT, createCourse)
router.put('/:courseId', authenticateJWT, updateCourse)
router.delete('/:courseId', authenticateJWT, deleteCourse)

module.exports = router