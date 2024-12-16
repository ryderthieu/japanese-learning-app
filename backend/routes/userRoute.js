const express = require('express')
const {login, signup, forgotPassword, resetPassword, enrollCourse} = require('../controllers/userController')
const { authenticateJWT } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/enroll', authenticateJWT, enrollCourse)

module.exports = router