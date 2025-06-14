import apiClient from './config';

const lessonService = {
  // Thay đổi trạng thái bài học
  changeLessonStatus: async (lessonData) => {
    const response = await apiClient.post('/lessons', lessonData);
    return response.data;
  }
};

export default lessonService; 