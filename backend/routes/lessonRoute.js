const express = require('express')
const { addLesson } = require('../controllers/lessonController')
const router = express.Router()

router.post('/', addLesson)
module.exports = router