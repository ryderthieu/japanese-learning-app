import apiClient from './config';

const aiService = {
    // Giải thích từ vựng
    explainVocabulary: async (word, level = 'N5') => {
        try {
            const requestData = { word, level };
            console.log('🚀 Gọi API explainVocabulary:', requestData);
            
            const response = await apiClient.post('/chat/explain-vocabulary', requestData);
            console.log('✅ Response explainVocabulary:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi gọi API giải thích từ vựng:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    // Giải thích ngữ pháp
    explainGrammar: async (rule, level = 'N5') => {
        try {
            const requestData = { grammar: rule, level };
            console.log('🚀 Gọi API explainGrammar:', requestData);
            
            const response = await apiClient.post('/chat/explain-grammar', requestData);
            console.log('✅ Response explainGrammar:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi gọi API giải thích ngữ pháp:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    // Tạo ví dụ cho từ vựng
    generateExamples: async (word, level = 'N5') => {
        try {
            const requestData = { word, level };
            console.log('🚀 Gọi API generateExamples:', requestData);
            
            const response = await apiClient.post('/chat/generate-examples', requestData);
            console.log('✅ Response generateExamples:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi tạo ví dụ:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    // Hỏi câu hỏi AI
    askQuestion: async (question, context = '') => {
        try {
            const requestData = { question, context };
            console.log('🚀 Gọi API askQuestion:', requestData);
            
            const response = await apiClient.post('/chat/ask-question', requestData);
            console.log('✅ Response askQuestion:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi hỏi AI:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    // Giải thích đáp án câu hỏi JLPT
    explainAnswer: async (questionData) => {
        try {
            const requestData = {
                questionText: questionData.questionText,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                userAnswer: questionData.userAnswer || null,
                questionType: questionData.type || questionData.section,
                level: questionData.level,
                section: questionData.section
            };
            console.log('🚀 Gọi API explainAnswer:', requestData);
            
            const response = await apiClient.post('/chat/explain-answer', requestData);
            console.log('✅ Response explainAnswer:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi giải thích đáp án:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    // APIs cho conversation practice
    startConversation: async (scenario, level, sessionId) => {
        try {
            const requestData = { scenario, level, sessionId };
            console.log('🚀 Gọi API startConversation:', requestData);
            
            const response = await apiClient.post('/chat/start-conversation', requestData);
            console.log('✅ Response startConversation:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi bắt đầu cuộc hội thoại:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    continueConversation: async (sessionId, userMessage, conversationHistory, scenario, level) => {
        try {
            const requestData = { sessionId, userMessage, conversationHistory, scenario, level };
            console.log('🚀 Gọi API continueConversation:', requestData);
            
            const response = await apiClient.post('/chat/continue-conversation', requestData);
            console.log('✅ Response continueConversation:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi tiếp tục cuộc hội thoại:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    },

    endConversation: async (sessionId, conversationHistory, scenario, level) => {
        try {
            const requestData = { sessionId, conversationHistory, scenario, level };
            console.log('🚀 Gọi API endConversation:', requestData);
            
            const response = await apiClient.post('/chat/end-conversation', requestData);
            console.log('✅ Response endConversation:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi khi kết thúc cuộc hội thoại:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    }
};

export default aiService; 