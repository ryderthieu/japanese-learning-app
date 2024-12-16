const express = require('express')
const { getLessonsInCourse } = require('../controllers/lessonController')
const router = express.Router()

router.get('/:courseId', getLessonsInCourse)
module.exports = router