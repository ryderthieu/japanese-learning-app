const mongoose = require('mongoose');

// Định nghĩa schema chính cho bài thi
const TestSchema = new mongoose.Schema({
  level: { type: String, required: true, enum: ['N1', 'N2', 'N3', 'N4', 'N5'] }, 
  description: { type: String }, 
  sections: [
    {
      name: { type: String, required: true, enum: ['Từ vựng', 'Ngữ pháp', 'Nghe hiểu'] }, 
      subsections: [
        {
          title: { type: String, required: true }, 
          description: { type: String }, 
          questions: [
            {
              content: { type: String, required: true }, // Nội dung câu hỏi
              questionType: { type: String, required: true, enum: ['Trắc nghiệm', 'Điền từ', 'Nghe'] }, 
              format: { type: mongoose.Schema.Types.Mixed, required: true },
              explanation: { type: String }, 
            },
          ],
        },
      ],
    },
  ],
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
