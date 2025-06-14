import apiClient from './config';

const grammarService = {
  // Lấy danh sách bài học ngữ pháp
  getLessons: async () => {
    const response = await apiClient.get('/grammar/get-lesson');
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
  }
};

export default grammarService; 