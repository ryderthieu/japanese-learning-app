import apiClient from './config';

const questionService = {
  // Lấy tất cả câu hỏi
  getAllQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/questions?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi theo ID
  getQuestionById: async (id) => {
    const response = await apiClient.get(`/questions/${id}`);
    return response.data;
  },

  // Tạo câu hỏi mới
  createQuestion: async (questionData) => {
    const response = await apiClient.post('/questions', questionData);
    return response.data;
  },

  // Cập nhật câu hỏi
  updateQuestion: async (id, questionData) => {
    const response = await apiClient.put(`/questions/${id}`, questionData);
    return response.data;
  },

  // Xóa câu hỏi
  deleteQuestion: async (id) => {
    const response = await apiClient.delete(`/questions/${id}`);
    return response.data;
  },

  // Lấy câu hỏi theo level
  getQuestionsByLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/level/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi theo section
  getQuestionsBySection: async (section, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/section/${section}?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi theo type
  getQuestionsByType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi ngẫu nhiên
  getRandomQuestions: async (count = 10, filters = {}) => {
    const params = new URLSearchParams();
    params.append('count', count);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await apiClient.get(`/questions/random?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi theo độ khó
  getQuestionsByDifficulty: async (difficulty, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/difficulty/${difficulty}?${params.toString()}`);
    return response.data;
  },

  // Lấy câu hỏi theo bài thi
  getQuestionsByTest: async (testId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/test/${testId}?${params.toString()}`);
    return response.data;
  },

  // Tìm kiếm câu hỏi
  searchQuestions: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/questions/search?${params.toString()}`);
    return response.data;
  },

  // Lấy thống kê câu hỏi
  getQuestionStats: async () => {
    const response = await apiClient.get('/questions/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getStatsByLevel: async (level) => {
    const response = await apiClient.get(`/questions/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getStatsBySection: async (section) => {
    const response = await apiClient.get(`/questions/stats/section/${section}`);
    return response.data;
  },

  // Import câu hỏi từ file
  importQuestions: async (fileData) => {
    const response = await apiClient.post('/questions/import', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Export câu hỏi
  exportQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.format) params.append('format', filters.format);
    
    const response = await apiClient.get(`/questions/export?${params.toString()}`);
    return response.data;
  }
};

export default questionService; 