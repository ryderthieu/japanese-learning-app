const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route giải thích từ vựng
router.post('/explain-vocabulary', chatController.explainVocabulary);

// Route giải thích ngữ pháp  
router.post('/explain-grammar', chatController.explainGrammar);

// Route hỏi đáp tổng quát
router.post('/ask-question', chatController.askQuestion);

// Route tạo câu ví dụ
router.post('/generate-examples', chatController.generateExamples);

// Route giải thích đáp án của một câu hỏi
router.post('/explain-answer', chatController.explainAnswer);

// Route giải thích kết quả của cả bài test
router.post('/explain-test-results', chatController.explainTestResults);

// Route bắt đầu cuộc hội thoại luyện giao tiếp
router.post('/start-conversation', chatController.startConversation);

// Route tiếp tục cuộc hội thoại
router.post('/continue-conversation', chatController.continueConversation);

// Route kết thúc và đánh giá cuộc hội thoại
router.post('/end-conversation', chatController.endConversation);

module.exports = router; 