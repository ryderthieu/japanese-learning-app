const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionTypes,
    getRandomQuestions,
    getQuestionStats
} = require('../controllers/questionController');

// Middleware xác thực (cần thêm sau)
// const requireAuth = require('../middleware/requireAuth');

// Public routes
router.get('/types', getQuestionTypes);
router.get('/stats', getQuestionStats);
router.get('/random', getRandomQuestions);
router.get('/:id', getQuestion);
router.get('/', getQuestions);

// Protected routes (cần xác thực)
// router.use(requireAuth);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router; 