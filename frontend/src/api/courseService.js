import apiClient from './config';

const courseService = {
  // Lấy danh sách khóa học
  getAllCourses: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  // Lấy chi tiết một khóa học
  getCourseById: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },

  // Tạo khóa học mới
  createCourse: async (courseData) => {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  // Cập nhật khóa học
  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Xóa khóa học
  deleteCourse: async (courseId) => {
    const response = await apiClient.delete(`/courses/${courseId}`);
    return response.data;
  },

  // === JLPT Course Functions ===

  // Lấy khóa học theo JLPT level
  getCoursesByJLPTLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/courses/jlpt/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy khóa học theo JLPT section
  getCoursesByJLPTSection: async (section, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/section/${section}?${params.toString()}`);
    return response.data;
  },

  // Lấy khóa học theo JLPT type
  getCoursesByJLPTType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Tìm kiếm khóa học JLPT
  searchJLPTCourses: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/search?${params.toString()}`);
    return response.data;
  },

  // Lấy thống kê khóa học JLPT
  getJLPTCourseStats: async () => {
    const response = await apiClient.get('/courses/jlpt/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getJLPTCourseStatsByLevel: async (level) => {
    const response = await apiClient.get(`/courses/jlpt/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getJLPTCourseStatsBySection: async (section) => {
    const response = await apiClient.get(`/courses/jlpt/stats/section/${section}`);
    return response.data;
  },

  // Lấy khóa học đã đăng ký theo JLPT
  getEnrolledJLPTCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/enrolled?${params.toString()}`);
    return response.data;
  },

  // Lấy khóa học được đề xuất theo JLPT
  getRecommendedJLPTCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/recommended?${params.toString()}`);
    return response.data;
  },

  // Lấy tiến độ khóa học JLPT
  getJLPTCourseProgress: async (courseId) => {
    const response = await apiClient.get(`/courses/jlpt/${courseId}/progress`);
    return response.data;
  },

  // Cập nhật tiến độ khóa học JLPT
  updateJLPTCourseProgress: async (courseId, progressData) => {
    const response = await apiClient.put(`/courses/jlpt/${courseId}/progress`, progressData);
    return response.data;
  },

  // Lấy bài học của khóa học JLPT
  getJLPTCourseLessons: async (courseId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.section) params.append('section', filters.section);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/${courseId}/lessons?${params.toString()}`);
    return response.data;
  },

  // Lấy bài thi của khóa học JLPT
  getJLPTCourseTests: async (courseId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/courses/jlpt/${courseId}/tests?${params.toString()}`);
    return response.data;
  }
};

export default courseService; 