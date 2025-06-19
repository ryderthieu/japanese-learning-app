const express = require('express');
const router = express.Router();
const {
    getTests,
    getTest,
    createTest,
    createTestFromTemplate,
    updateTest,
    deleteTest,
    addQuestionToTest,
    getTestQuestions,
    startTest,
    submitTest,
    getTestStats
} = require('../controllers/testController');

// Middleware xác thực (cần thêm sau)
const { authenticateJWT } = require("../middleware/authMiddleware");

// Public routes
router.get('/stats/:testId', getTestStats);
router.get('/level/:level', getTests);
router.get('/:id', getTest);
router.get('/', getTests);

// Protected routes (cần xác thực)
router.use(authenticateJWT);

// Quản lý bài thi
router.post('/', createTest);
router.post('/template', createTestFromTemplate);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

// Quản lý câu hỏi trong bài thi
router.post('/questions', addQuestionToTest);
router.get('/:testId/questions/:sectionName?', getTestQuestions);

// Làm bài thi
router.post('/:testId/start', startTest);
router.post('/:testId/submit', submitTest);

module.exports = router; 