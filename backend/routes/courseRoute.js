const express = require('express')
const {addCourse, getAllCourses} = require('../controllers/courseController')

const router = express.Router()

router.post('/', addCourse)
router.get('/all', getAllCourses)
module.exports = router