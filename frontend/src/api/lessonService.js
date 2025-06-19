import apiClient from './config';

const lessonService = {
  // Thay đổi trạng thái bài học (đánh dấu đã học/chưa học)
  changeLessonStatus: async ({ lessonId, isCompleted }) => {
    const response = await apiClient.post('/lessons', { lessonId, isCompleted });
    return response.data;
  },

  // Lấy chi tiết bài học (bao gồm từ vựng, ngữ pháp)
  getLessonDetail: async (lessonId) => {
    const response = await apiClient.get(`/lessons/${lessonId}`);
    return response.data;
  },

  // === JLPT Lesson Functions ===

  // Lấy bài học theo JLPT level
  getLessonsByJLPTLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/lessons/jlpt/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy bài học theo JLPT section
  getLessonsByJLPTSection: async (section, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/section/${section}?${params.toString()}`);
    return response.data;
  },

  // Lấy bài học theo JLPT type
  getLessonsByJLPTType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Lấy bài học theo course và JLPT
  getLessonsByCourseAndJLPT: async (courseId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/course/${courseId}?${params.toString()}`);
    return response.data;
  },

  // Tìm kiếm bài học JLPT
  searchJLPTLessons: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/search?${params.toString()}`);
    return response.data;
  },

  // Lấy thống kê bài học JLPT
  getJLPTLessonStats: async () => {
    const response = await apiClient.get('/lessons/jlpt/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getJLPTLessonStatsByLevel: async (level) => {
    const response = await apiClient.get(`/lessons/jlpt/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getJLPTLessonStatsBySection: async (section) => {
    const response = await apiClient.get(`/lessons/jlpt/stats/section/${section}`);
    return response.data;
  },

  // Lấy bài học đã hoàn thành theo JLPT
  getCompletedJLPTLessons: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/completed?${params.toString()}`);
    return response.data;
  },

  // Lấy bài học chưa hoàn thành theo JLPT
  getIncompleteJLPTLessons: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/incomplete?${params.toString()}`);
    return response.data;
  },

  // Đánh dấu bài học đã hoàn thành
  markLessonAsCompleted: async (lessonId) => {
    const response = await apiClient.post(`/lessons/jlpt/completed/${lessonId}`);
    return response.data;
  },

  // Bỏ đánh dấu bài học đã hoàn thành
  unmarkLessonAsCompleted: async (lessonId) => {
    const response = await apiClient.delete(`/lessons/jlpt/completed/${lessonId}`);
    return response.data;
  },

  // Lấy tiến độ bài học JLPT
  getJLPTLessonProgress: async (lessonId) => {
    const response = await apiClient.get(`/lessons/jlpt/${lessonId}/progress`);
    return response.data;
  },

  // Cập nhật tiến độ bài học JLPT
  updateJLPTLessonProgress: async (lessonId, progressData) => {
    const response = await apiClient.put(`/lessons/jlpt/${lessonId}/progress`, progressData);
    return response.data;
  },

  // Lấy câu hỏi của bài học JLPT
  getJLPTLessonQuestions: async (lessonId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/${lessonId}/questions?${params.toString()}`);
    return response.data;
  },

  // Lấy bài thi của bài học JLPT
  getJLPTLessonTests: async (lessonId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/lessons/jlpt/${lessonId}/tests?${params.toString()}`);
    return response.data;
  }
};

export default lessonService; 