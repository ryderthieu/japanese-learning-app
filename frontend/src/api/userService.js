import apiClient from './config';

const userService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await apiClient.post('/user/login', credentials);
    return response.data;
  },

  // Đăng ký
  signup: async (userData) => {
    const response = await apiClient.post('/user/signup', userData);
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await apiClient.post('/user/forgot-password', { email });
    return response.data;
  },

  // Xác nhận OTP
  confirmOtp: async (otpData) => {
    const response = await apiClient.post('/user/cofirm-otp', otpData);
    return response.data;
  },

  // Đặt lại mật khẩu
  resetPassword: async (passwordData) => {
    const response = await apiClient.post('/user/reset-password', passwordData);
    return response.data;
  },

  // Đăng ký khóa học
  enrollCourse: async (courseData) => {
    const response = await apiClient.post('/user/enroll', courseData);
    return response.data;
  },

  // Thêm vào giỏ hàng
  addToCart: async (courseData) => {
    const response = await apiClient.post('/user/add-to-cart', courseData);
    return response.data;
  },

  // Lấy giỏ hàng
  getCart: async () => {
    const response = await apiClient.get('/user/get-cart');
    return response.data;
  },

  // Xóa khỏi giỏ hàng
  removeFromCart: async (courseData) => {
    const response = await apiClient.post('/user/remove-from-cart', courseData);
    return response.data;
  },

  // Thêm nhiều khóa học
  addCourses: async (coursesData) => {
    const response = await apiClient.post('/user/add-courses', coursesData);
    return response.data;
  },

  // Lấy khóa học của người dùng
  getUserCourses: async () => {
    const response = await apiClient.get('/user/get-user-courses');
    return response.data;
  },

  // Lấy bài học của khóa học
  getCourseLessons: async (courseId) => {
    const response = await apiClient.get(`/user/get-course-lessons/${courseId}`);
    return response.data;
  },

  // Thêm bài học đã hoàn thành
  addCompletedLesson: async (lessonId) => {
    const response = await apiClient.post(`/user/add-completed-lesson/${lessonId}`);
    return response.data;
  },

  // Lấy thông tin người dùng
  getUserInfo: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  // Lấy thông tin người dùng
  getUserProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUserProfile: async (userData) => {
    const response = await apiClient.put('/user/profile', userData);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/user/change-password', passwordData);
    return response.data;
  },

  // Lấy tiến độ học tập
  getLearningProgress: async () => {
    const response = await apiClient.get('/user/progress');
    return response.data;
  },

  // === JLPT Functions ===

  // Lấy thống kê JLPT
  getJLPTStats: async () => {
    const response = await apiClient.get('/user/jlpt/stats');
    return response.data;
  },

  // Cập nhật thông tin JLPT
  updateJLPTInfo: async (jlptData) => {
    const response = await apiClient.put('/user/jlpt/info', jlptData);
    return response.data;
  },

  // Lấy tiến độ học tập JLPT
  getStudyProgress: async () => {
    const response = await apiClient.get('/user/jlpt/progress');
    return response.data;
  },

  // Cập nhật cài đặt học tập
  updateStudySettings: async (settings) => {
    const response = await apiClient.put('/user/jlpt/settings', settings);
    return response.data;
  },

  // Lấy lịch sử làm bài thi
  getTestHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/user/jlpt/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Lấy thống kê theo section
  getSectionStats: async () => {
    const response = await apiClient.get('/user/jlpt/section-stats');
    return response.data;
  },

  // Lưu câu hỏi
  saveQuestion: async (questionId) => {
    const response = await apiClient.post('/user/save-question', { questionId });
    return response.data;
  },

  // Bỏ lưu câu hỏi
  unsaveQuestion: async (questionId) => {
    const response = await apiClient.delete(`/user/unsave-question/${questionId}`);
    return response.data;
  }
};

export default userService; 