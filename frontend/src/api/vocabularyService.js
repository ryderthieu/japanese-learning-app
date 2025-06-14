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
  }
};

export default vocabularyService; 