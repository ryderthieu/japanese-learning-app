import apiClient from './config';

const vocabularyService = {
  // Tìm kiếm từ vựng
  searchVocabulary: async (searchParams) => {
    const response = await apiClient.get('/vocabulary/search', { params: searchParams });
    return response.data;
  },

  // Lấy danh sách bài học từ vựng
  getLessons: async (params) => {
    const response = await apiClient.get('/vocabulary/get-lesson', { params });
    return response.data;
  },

  // Lưu từ vựng
  saveVocabulary: async (vocabularyData) => {
    const response = await apiClient.post('/vocabulary/save-vocabulary', { vocabularyId: vocabularyData.vocabularyId });
    return response.data;
  },

  // Lấy từ vựng đã lưu
  getSavedVocabulary: async () => {
    const response = await apiClient.get('/vocabulary/get-saved-vocabulary');
    return response.data;
  },

  // Lấy danh sách từ vựng
  getAllVocabularies: async () => {
    const response = await apiClient.get('/vocabulary');
    return response.data;
  },

  // Lấy từ vựng theo ID
  getVocabularyById: async (vocabularyId) => {
    const response = await apiClient.get(`/vocabulary/${vocabularyId}`);
    return response.data;
  },

  // Lấy từ vựng theo bài học
  getVocabulariesByLesson: async (lessonId) => {
    const response = await apiClient.get(`/vocabulary/lesson/${lessonId}`);
    return response.data;
  },

  // Tạo từ vựng mới
  createVocabulary: async (vocabularyData) => {
    const response = await apiClient.post('/vocabulary', vocabularyData);
    return response.data;
  },

  // Cập nhật từ vựng
  updateVocabulary: async (vocabularyId, vocabularyData) => {
    const response = await apiClient.put(`/vocabulary/${vocabularyId}`, vocabularyData);
    return response.data;
  },

  // Xóa từ vựng
  deleteVocabulary: async (vocabularyId) => {
    const response = await apiClient.delete(`/vocabulary/${vocabularyId}`);
    return response.data;
  },

  // === JLPT Vocabulary Functions ===

  // Lấy từ vựng theo JLPT level
  getVocabularyByJLPTLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/vocabulary/jlpt/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy từ vựng theo JLPT section
  getVocabularyByJLPTSection: async (section, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/vocabulary/jlpt/section/${section}?${params.toString()}`);
    return response.data;
  },

  // Lấy từ vựng theo JLPT type
  getVocabularyByJLPTType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/vocabulary/jlpt/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Lấy từ vựng ngẫu nhiên theo JLPT
  getRandomJLPTVocabulary: async (count = 10, filters = {}) => {
    const params = new URLSearchParams();
    params.append('count', count);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await apiClient.get(`/vocabulary/jlpt/random?${params.toString()}`);
    return response.data;
  },

  // Tìm kiếm từ vựng JLPT
  searchJLPTVocabulary: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/vocabulary/jlpt/search?${params.toString()}`);
    return response.data;
  },

  // Lấy thống kê từ vựng JLPT
  getJLPTVocabularyStats: async () => {
    const response = await apiClient.get('/vocabulary/jlpt/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getJLPTVocabularyStatsByLevel: async (level) => {
    const response = await apiClient.get(`/vocabulary/jlpt/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getJLPTVocabularyStatsBySection: async (section) => {
    const response = await apiClient.get(`/vocabulary/jlpt/stats/section/${section}`);
    return response.data;
  },

  // Lấy từ vựng đã học theo JLPT
  getLearnedJLPTVocabulary: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/vocabulary/jlpt/learned?${params.toString()}`);
    return response.data;
  },

  // Đánh dấu từ vựng đã học
  markVocabularyAsLearned: async (vocabularyId) => {
    const response = await apiClient.post(`/vocabulary/jlpt/learned/${vocabularyId}`);
    return response.data;
  },

  // Bỏ đánh dấu từ vựng đã học
  unmarkVocabularyAsLearned: async (vocabularyId) => {
    const response = await apiClient.delete(`/vocabulary/jlpt/learned/${vocabularyId}`);
    return response.data;
  },

  // Lấy từ vựng khó theo JLPT
  getDifficultJLPTVocabulary: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/vocabulary/jlpt/difficult?${params.toString()}`);
    return response.data;
  }
};

export default vocabularyService; 