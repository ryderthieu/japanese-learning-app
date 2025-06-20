import apiClient from './config';

const grammarService = {
  // Lấy danh sách bài học ngữ pháp
  getLessons: async ({ level, lessonNumber = 1 } = {}) => {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (lessonNumber) params.append('lessonNumber', lessonNumber);
    
    const response = await apiClient.get(`/grammar/get-lesson?${params.toString()}`);
    return response.data;
  },

  // Lưu ngữ pháp
  saveGrammar: async (grammarData) => {
    const response = await apiClient.post('/grammar/save-grammar', { grammarId: grammarData.grammarId });
    return response.data;
  },

  // Lấy ngữ pháp đã lưu
  getSavedGrammar: async () => {
    const response = await apiClient.get('/grammar/get-saved-grammar');
    return response.data;
  },

  // === JLPT Grammar Functions ===

  // Lấy ngữ pháp theo JLPT level
  getGrammarByJLPTLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/grammar/jlpt/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy ngữ pháp theo JLPT section
  getGrammarByJLPTSection: async (section, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/section/${section}?${params.toString()}`);
    return response.data;
  },

  // Lấy ngữ pháp theo JLPT type
  getGrammarByJLPTType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Lấy ngữ pháp ngẫu nhiên theo JLPT
  getRandomJLPTGrammar: async (count = 10, filters = {}) => {
    const params = new URLSearchParams();
    params.append('count', count);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await apiClient.get(`/grammar/jlpt/random?${params.toString()}`);
    return response.data;
  },

  // Tìm kiếm ngữ pháp JLPT
  searchJLPTGrammar: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/search?${params.toString()}`);
    return response.data;
  },

  // Lấy thống kê ngữ pháp JLPT
  getJLPTGrammarStats: async () => {
    const response = await apiClient.get('/grammar/jlpt/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getJLPTGrammarStatsByLevel: async (level) => {
    const response = await apiClient.get(`/grammar/jlpt/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getJLPTGrammarStatsBySection: async (section) => {
    const response = await apiClient.get(`/grammar/jlpt/stats/section/${section}`);
    return response.data;
  },

  // Lấy ngữ pháp đã học theo JLPT
  getLearnedJLPTGrammar: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/learned?${params.toString()}`);
    return response.data;
  },

  // Đánh dấu ngữ pháp đã học
  markGrammarAsLearned: async (grammarId) => {
    const response = await apiClient.post(`/grammar/jlpt/learned/${grammarId}`);
    return response.data;
  },

  // Bỏ đánh dấu ngữ pháp đã học
  unmarkGrammarAsLearned: async (grammarId) => {
    const response = await apiClient.delete(`/grammar/jlpt/learned/${grammarId}`);
    return response.data;
  },

  // Lấy ngữ pháp khó theo JLPT
  getDifficultJLPTGrammar: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/difficult?${params.toString()}`);
    return response.data;
  },

  // Lấy cấu trúc ngữ pháp theo JLPT
  getGrammarStructures: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/structures?${params.toString()}`);
    return response.data;
  },

  // Lấy ví dụ ngữ pháp theo JLPT
  getGrammarExamples: async (grammarId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/grammar/jlpt/${grammarId}/examples?${params.toString()}`);
    return response.data;
  }
};

export default grammarService; 