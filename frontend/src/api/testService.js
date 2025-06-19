import apiClient from './config';

const testService = {
  // Lấy tất cả bài thi
  getAllTests: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiClient.get(`/tests?${params.toString()}`);
    return response.data;
  },

  // Lấy bài thi theo ID
  getTestById: async (id) => {
    try {
      console.log('Calling getTestById API for id:', id);
      const response = await apiClient.get(`/tests/${id}`);
      console.log('getTestById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getTestById:', error.response?.data || error.message);
      throw error;
    }
  },

  // Tạo bài thi mới
  createTest: async (testData) => {
    const response = await apiClient.post('/tests', testData);
    return response.data;
  },

  // Cập nhật bài thi
  updateTest: async (id, testData) => {
    const response = await apiClient.put(`/tests/${id}`, testData);
    return response.data;
  },

  // Xóa bài thi
  deleteTest: async (id) => {
    const response = await apiClient.delete(`/tests/${id}`);
    return response.data;
  },

  // Lấy bài thi theo level
  getTestsByLevel: async (level, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/tests/level/${level}?${params.toString()}`);
    return response.data;
  },

  // Lấy bài thi theo type
  getTestsByType: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/tests/type/${type}?${params.toString()}`);
    return response.data;
  },

  // Tạo bài thi từ template
  createTestFromTemplate: async (templateData) => {
    const response = await apiClient.post('/tests/template', templateData);
    return response.data;
  },

  // Lấy template bài thi
  getTestTemplates: async (level) => {
    const response = await apiClient.get(`/tests/templates${level ? `?level=${level}` : ''}`);
    return response.data;
  },

  // Bắt đầu làm bài thi
  startTest: async (testId) => {
    const response = await apiClient.post(`/tests/${testId}/start`);
    return response.data;
  },

  // Nộp bài thi
  submitTest: async (testId, submitData) => {
    const response = await apiClient.post(`/tests/${testId}/submit`, submitData);
    return response.data;
  },

  // Lưu tiến độ bài thi
  saveTestProgress: async (testId, progress) => {
    const response = await apiClient.post(`/tests/${testId}/progress`, progress);
    return response.data;
  },

  // Lấy kết quả bài thi
  getTestResult: async (testId) => {
    const response = await apiClient.get(`/tests/${testId}/result`);
    return response.data;
  },

  // Lấy phân tích chi tiết bài thi
  getTestAnalysis: async (testId) => {
    const response = await apiClient.get(`/tests/${testId}/analysis`);
    return response.data;
  },

  // Lấy câu hỏi của bài thi
  getTestQuestions: async (testId) => {
    const response = await apiClient.get(`/tests/${testId}/questions`);
    return response.data;
  },

  // Lấy thống kê bài thi
  getTestStats: async () => {
    const response = await apiClient.get('/tests/stats');
    return response.data;
  },

  // Lấy thống kê theo level
  getTestStatsByLevel: async (level) => {
    const response = await apiClient.get(`/tests/stats/level/${level}`);
    return response.data;
  },

  // Lấy thống kê theo type
  getTestStatsByType: async (type) => {
    const response = await apiClient.get(`/tests/stats/type/${type}`);
    return response.data;
  },

  // Tìm kiếm bài thi
  searchTests: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.level) params.append('level', filters.level);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/tests/search?${params.toString()}`);
    return response.data;
  },

  // Lấy bài thi đang làm
  getActiveTest: async () => {
    const response = await apiClient.get('/tests/active');
    return response.data;
  },

  // Dừng bài thi
  pauseTest: async (testId) => {
    const response = await apiClient.post(`/tests/${testId}/pause`);
    return response.data;
  },

  // Tiếp tục bài thi
  resumeTest: async (testId) => {
    const response = await apiClient.post(`/tests/${testId}/resume`);
    return response.data;
  },

  // Lấy thời gian còn lại
  getRemainingTime: async (testId) => {
    const response = await apiClient.get(`/tests/${testId}/time`);
    return response.data;
  },

  // Lấy lịch sử bài thi của user
  getUserTestHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/tests/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Lấy bài thi đã hoàn thành
  getCompletedTests: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/tests/completed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Lấy bài thi chưa hoàn thành
  getIncompleteTests: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/tests/incomplete?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Xóa lịch sử bài thi
  deleteTestHistory: async (testId) => {
    const response = await apiClient.delete(`/tests/history/${testId}`);
    return response.data;
  },

  // Export kết quả bài thi
  exportTestResult: async (testId, format = 'pdf') => {
    const response = await apiClient.get(`/tests/${testId}/export?format=${format}`);
    return response.data;
  },

  // Lấy lịch sử bài thi với filter
  getTestHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.filter) queryParams.append('filter', params.filter);
    
    const response = await apiClient.get(`/tests/history?${queryParams.toString()}`);
    return response.data;
  }
};

export default testService; 