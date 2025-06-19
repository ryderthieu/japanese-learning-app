const express = require('express')
const { 
    searchVocabulary, 
    getLessons, 
    saveVocabulary, 
    getSavedVocabulary
} = require('../controllers/vocabularyController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router()

// Basic routes
router.get('/search', searchVocabulary);
router.get('/get-lesson', getLessons)
router.post('/save-vocabulary', authenticateJWT, saveVocabulary)
router.get('/get-saved-vocabulary', authenticateJWT, getSavedVocabulary)


module.exports = router