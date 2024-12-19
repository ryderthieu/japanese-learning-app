const express = require('express')
const { searchVocabulary} = require('../controllers/vocabularyController')

const router = express.Router()

router.get('/search', searchVocabulary);
module.exports = router