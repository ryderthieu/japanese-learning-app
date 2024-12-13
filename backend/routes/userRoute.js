const express = require('express')
const {login, signup, forgotPassword, resetPassword} = require('../controllers/userController')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router