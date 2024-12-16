const express = require('express')
const { changeLessonStatus } = require('../controllers/lessonController')
const { authenticateJWT } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authenticateJWT, changeLessonStatus)
module.exports = router