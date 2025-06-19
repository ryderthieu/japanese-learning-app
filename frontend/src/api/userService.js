import apiClient from './config';

const userService = {
  // Auth APIs
  login: async (email, password) => {
    const response = await apiClient.post('/user/login', { email, password });
    return response.data;
  },

  signup: async (email, password, fullName) => {
    const response = await apiClient.post('/user/signup', { email, password, fullName });
    return response.data;
  },

  // Password Reset APIs
  forgotPassword: async (email) => {
    const response = await apiClient.post('/user/forgot-password', { email });
    return response.data;
  },

  confirmOtp: async (data) => {
    const response = await apiClient.post('/user/cofirm-otp', data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post('/user/reset-password', data);
    return response.data;
  },

  // User Info APIs
  getUserInfo: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.post('/user/update-profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.post('/user/change-password', data);
    return response.data;
  },

  // Course APIs
  enrollCourse: async (courseData) => {
    const response = await apiClient.post('/user/enroll', courseData);
    return response.data;
  },

  addToCart: async (courseData) => {
    const response = await apiClient.post('/user/add-to-cart', courseData);
    return response.data;
  },

  getCart: async () => {
    const response = await apiClient.get('/user/get-cart');
    return response.data;
  },

  removeFromCart: async (courseData) => {
    const response = await apiClient.post('/user/remove-from-cart', courseData);
    return response.data;
  },

  addCourses: async (coursesData) => {
    const response = await apiClient.post('/user/add-courses', coursesData);
    return response.data;
  },

  getUserCourses: async () => {
    const response = await apiClient.get('/user/get-user-courses');
    return response.data;
  },

  getCourseLessons: async (courseId) => {
    const response = await apiClient.get(`/user/get-course-lessons/${courseId}`);
    return response.data;
  },

  addCompletedLesson: async (lessonId) => {
    const response = await apiClient.post(`/user/add-completed-lesson/${lessonId}`);
    return response.data;
  },

  // Question APIs
  saveQuestion: async (questionId) => {
    const response = await apiClient.post('/user/save-question', { questionId });
    return response.data;
  },

  unsaveQuestion: async (questionId) => {
    const response = await apiClient.delete(`/user/unsave-question/${questionId}`);
    return response.data;
  },

  // JLPT APIs
  getJLPTStats: async () => {
    const response = await apiClient.get('/user/jlpt/stats');
    return response.data;
  },

  updateJLPTInfo: async (jlptData) => {
    const response = await apiClient.put('/user/jlpt/info', jlptData);
    return response.data;
  },

  getStudyProgress: async () => {
    const response = await apiClient.get('/user/jlpt/progress');
    return response.data;
  },

  getStudySettings: async () => {
    const response = await apiClient.get('/user/jlpt/settings');
    return response.data;
  },

  updateStudySettings: async (settings) => {
    const response = await apiClient.put('/user/jlpt/settings', settings);
    return response.data;
  },

  getTestHistory: async (page = 1, limit = 10) => {
    try {
      console.log('Calling getTestHistory API:', { page, limit });
      const response = await apiClient.get(`/user/jlpt/history?page=${page}&limit=${limit}`);
      console.log('getTestHistory response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getTestHistory:', error.response?.data || error.message);
      throw error;
    }
  },

  getSectionStats: async () => {
    const response = await apiClient.get('/user/jlpt/section-stats');
    return response.data;
  }
};

export default userService; 