const express = require('express')
const { changeLessonStatus, getLessonDetail } = require('../controllers/lessonController')
const { authenticateJWT } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authenticateJWT, changeLessonStatus)
// Lấy chi tiết bài học kèm từ vựng/ngữ pháp
router.get('/:lessonId', getLessonDetail)

module.exports = router