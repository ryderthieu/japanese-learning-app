const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true }, 
      isCorrect: { type: Boolean, default: false },
    },
  ],
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] }, 
  type: { 
    type: String, 
    required: true, 
    enum: [
      // 文字・語彙 (Moji・Goi) - Từ vựng và chữ viết
      'kanji-hiragana',           // 漢字読み - Đọc kanji
      'hiragana-kanji',           // 表記 - Viết kanji
      'word-formation',           // 語形成 - Tạo từ
      'context-grammar',          // 文脈規定 - Từ vựng theo ngữ cảnh
      'synonyms',                 // 言い換え類義 - Từ đồng nghĩa
      'usage',                    // 用法 - Cách sử dụng từ
      
      // 文法 (Bunpou) - Ngữ pháp
      'grammar-selection',        // 文法形式の判断 - Chọn ngữ pháp đúng
      'sentence-combination',     // 文の組み立て - Sắp xếp câu
      'text-grammar',            // 文章の文法 - Ngữ pháp trong đoạn văn
      
      // 読解 (Dokkai) - Đọc hiểu
      'short-reading',           // 内容理解（短文） - Đọc hiểu ngắn
      'medium-reading',          // 内容理解（中文） - Đọc hiểu trung
      'long-reading',            // 内容理解（長文） - Đọc hiểu dài
      'comparative-reading',     // 統合理解 - So sánh đoạn văn
      'information-search',      // 情報検索 - Tìm kiếm thông tin
      
      // 聴解 (Choukai) - Nghe hiểu
      'task-based-listening',    // 課題理解 - Nghe hiểu nhiệm vụ
      'point-understanding',     // ポイント理解 - Nghe hiểu điểm chính
      'verbal-expressions',      // 発話表現 - Biểu hiện lời nói
      'quick-response',          // 即時応答 - Phản hồi nhanh
      'comprehensive-listening', // 統合理解 - Nghe hiểu tổng hợp
      
      // その他 (Khác)
      'vocabulary',              // Từ vựng chung
      'mixed'                    // Hỗn hợp
    ] 
  }, 
  explanation: { type: String }, 
  correctAnswer: { type: String }, 
  // Thêm các trường mới cho JLPT
  section: { 
    type: String, 
    enum: ['moji-goi', 'bunpou', 'dokkai', 'choukai'],
    required: true 
  },
  subSection: { type: String }, // Phân mục con
  difficulty: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: 1 
  },
  timeLimit: { type: Number }, // Thời gian làm bài (giây)
  audioFile: { type: String }, // File âm thanh cho phần nghe
  readingPassage: { type: String }, // Đoạn văn cho phần đọc
  imageFile: { type: String }, // File hình ảnh (nếu có)
}, { timestamps: true }); 

module.exports = mongoose.model('Question', questionSchema);
