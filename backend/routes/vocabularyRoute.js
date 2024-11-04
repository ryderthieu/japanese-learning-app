const express = require('express')
const { getVocabularyByLesson} = require('../controllers/vocabularyController')

const router = express.Router()

router.get('/lesson/:slug', getVocabularyByLesson)
module.exports = router