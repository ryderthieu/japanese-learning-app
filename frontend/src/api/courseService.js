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
  }
};

export default courseService; 