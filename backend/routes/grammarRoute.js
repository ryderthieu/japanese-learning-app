const express = require('express')
const {getLessons, saveGrammar, getSavedGrammar} = require('../controllers/grammarController')
const { authenticateJWT } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/save-grammar', authenticateJWT, saveGrammar)
router.get('/get-lesson', getLessons)
router.get('/get-saved-grammar', authenticateJWT, getSavedGrammar)
module.exports = router