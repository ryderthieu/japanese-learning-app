/**
 * Định nghĩa các loại câu hỏi JLPT
 * Dựa trên cấu trúc thực tế của kỳ thi JLPT
 */

const JLPT_SECTIONS = {
  MOJI_GOI: 'moji-goi',    // 文字・語彙 - Từ vựng và chữ viết
  BUNPOU: 'bunpou',        // 文法 - Ngữ pháp  
  DOKKAI: 'dokkai',        // 読解 - Đọc hiểu
  CHOUKAI: 'choukai'       // 聴解 - Nghe hiểu
};

const QUESTION_TYPES = {
  // === 文字・語彙 (Moji・Goi) - Từ vựng và chữ viết ===
  KANJI_HIRAGANA: {
    key: 'kanji-hiragana',
    name: '漢字読み - Đọc kanji',
    description: 'Chọn cách đọc hiragana đúng cho kanji được cho',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['漢字 → かんじ', '学校 → がっこう']
  },
  
  HIRAGANA_KANJI: {
    key: 'hiragana-kanji', 
    name: '表記 - Viết kanji',
    description: 'Chọn kanji đúng cho từ hiragana được cho',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['がっこう → 学校', 'でんわ → 電話']
  },
  
  WORD_FORMATION: {
    key: 'word-formation',
    name: '語形成 - Tạo từ',
    description: 'Chọn từ kanji phù hợp để kết hợp thành từ có nghĩa',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['学 + 生 = 学生', '電 + 話 = 電話']
  },
  
  CONTEXT_GRAMMAR: {
    key: 'context-grammar',
    name: '文脈規定 - Từ vựng theo ngữ cảnh',
    description: 'Chọn từ vựng phù hợp với ngữ cảnh của câu',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['空が＿＿＿です (青い/青く/青)', 'この本は＿＿＿です (面白い/面白く/面白)']
  },
  
  SYNONYMS: {
    key: 'synonyms',
    name: '言い換え類義 - Từ đồng nghĩa',
    description: 'Chọn từ đồng nghĩa hoặc cách diễn đạt tương đương',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['大きい = 大きな', '美しい = きれいな']
  },
  
  USAGE: {
    key: 'usage',
    name: '用法 - Cách sử dụng từ',
    description: 'Chọn cách sử dụng đúng của từ trong câu',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['「あげる」の正しい使い方', '「もらう」の正しい使い方']
  },
  
  // === 文法 (Bunpou) - Ngữ pháp ===
  GRAMMAR_SELECTION: {
    key: 'grammar-selection',
    name: '文法形式の判断 - Chọn ngữ pháp đúng',
    description: 'Chọn ngữ pháp phù hợp để hoàn thành câu',
    section: JLPT_SECTIONS.BUNPOU,
    examples: ['＿＿＿から、家に帰ります (雨が降っている/雨が降って/雨が降る)', '＿＿＿時、本を読みます (暇な/暇に/暇)']
  },
  
  SENTENCE_COMBINATION: {
    key: 'sentence-combination',
    name: '文の組み立て - Sắp xếp câu',
    description: 'Sắp xếp các từ thành câu hoàn chỉnh và đúng ngữ pháp',
    section: JLPT_SECTIONS.BUNPOU,
    examples: ['私 / は / 学生 / です → 私は学生です', '明日 / 学校 / に / 行きます → 明日学校に行きます']
  },
  
  TEXT_GRAMMAR: {
    key: 'text-grammar',
    name: '文章の文法 - Ngữ pháp trong đoạn văn',
    description: 'Chọn ngữ pháp phù hợp để điền vào đoạn văn',
    section: JLPT_SECTIONS.BUNPOU,
    examples: ['長文の中の空欄に適切な文法を入れる']
  },
  
  // === 読解 (Dokkai) - Đọc hiểu ===
  SHORT_READING: {
    key: 'short-reading',
    name: '内容理解（短文） - Đọc hiểu ngắn',
    description: 'Đọc hiểu đoạn văn ngắn và trả lời câu hỏi',
    section: JLPT_SECTIONS.DOKKAI,
    examples: ['100-200文字程度の短文を読んで内容を理解する']
  },
  
  MEDIUM_READING: {
    key: 'medium-reading',
    name: '内容理解（中文） - Đọc hiểu trung',
    description: 'Đọc hiểu đoạn văn trung bình và trả lời câu hỏi',
    section: JLPT_SECTIONS.DOKKAI,
    examples: ['400-500文字程度の中文を読んで内容を理解する']
  },
  
  LONG_READING: {
    key: 'long-reading',
    name: '内容理解（長文） - Đọc hiểu dài',
    description: 'Đọc hiểu đoạn văn dài và trả lời câu hỏi',
    section: JLPT_SECTIONS.DOKKAI,
    examples: ['800-1000文字程度の長文を読んで内容を理解する']
  },
  
  COMPARATIVE_READING: {
    key: 'comparative-reading',
    name: '統合理解 - So sánh đoạn văn',
    description: 'So sánh và phân tích nhiều đoạn văn khác nhau',
    section: JLPT_SECTIONS.DOKKAI,
    examples: ['複数の文章を比較して共通点や相違点を理解する']
  },
  
  INFORMATION_SEARCH: {
    key: 'information-search',
    name: '情報検索 - Tìm kiếm thông tin',
    description: 'Tìm kiếm thông tin cụ thể trong văn bản',
    section: JLPT_SECTIONS.DOKKAI,
    examples: ['広告や案内文から必要な情報を探す']
  },
  
  // === 聴解 (Choukai) - Nghe hiểu ===
  TASK_BASED_LISTENING: {
    key: 'task-based-listening',
    name: '課題理解 - Nghe hiểu nhiệm vụ',
    description: 'Nghe hiểu để thực hiện nhiệm vụ cụ thể',
    section: JLPT_SECTIONS.CHOUKAI,
    examples: ['会話を聞いて、次に何をするかを理解する']
  },
  
  POINT_UNDERSTANDING: {
    key: 'point-understanding',
    name: 'ポイント理解 - Nghe hiểu điểm chính',
    description: 'Nghe hiểu và nắm bắt điểm chính của cuộc hội thoại',
    section: JLPT_SECTIONS.CHOUKAI,
    examples: ['会話の要点を理解する']
  },
  
  VERBAL_EXPRESSIONS: {
    key: 'verbal-expressions',
    name: '発話表現 - Biểu hiện lời nói',
    description: 'Chọn cách nói phù hợp trong tình huống giao tiếp',
    section: JLPT_SECTIONS.CHOUKAI,
    examples: ['適切な挨拶や表現を選ぶ']
  },
  
  QUICK_RESPONSE: {
    key: 'quick-response',
    name: '即時応答 - Phản hồi nhanh',
    description: 'Phản hồi nhanh và phù hợp với câu nói được nghe',
    section: JLPT_SECTIONS.CHOUKAI,
    examples: ['短い質問や発言に対して適切に応答する']
  },
  
  COMPREHENSIVE_LISTENING: {
    key: 'comprehensive-listening',
    name: '統合理解 - Nghe hiểu tổng hợp',
    description: 'Nghe hiểu tổng hợp thông tin từ nhiều nguồn',
    section: JLPT_SECTIONS.CHOUKAI,
    examples: ['複数の情報源から総合的に情報を理解する']
  },
  
  // === その他 (Khác) ===
  VOCABULARY: {
    key: 'vocabulary',
    name: 'Từ vựng chung',
    description: 'Câu hỏi từ vựng chung không thuộc phân loại cụ thể',
    section: JLPT_SECTIONS.MOJI_GOI,
    examples: ['一般的な語彙問題']
  },
  
  MIXED: {
    key: 'mixed',
    name: 'Hỗn hợp',
    description: 'Câu hỏi kết hợp nhiều kỹ năng khác nhau',
    section: null,
    examples: ['複数のスキルを組み合わせた問題']
  }
};

// Hàm helper để lấy thông tin loại câu hỏi
const getQuestionTypeInfo = (typeKey) => {
  return Object.values(QUESTION_TYPES).find(type => type.key === typeKey);
};

// Hàm helper để lấy tất cả loại câu hỏi theo section
const getQuestionTypesBySection = (section) => {
  return Object.values(QUESTION_TYPES).filter(type => type.section === section);
};

// Hàm helper để lấy tất cả sections
const getAllSections = () => {
  return Object.values(JLPT_SECTIONS);
};

module.exports = {
  JLPT_SECTIONS,
  QUESTION_TYPES,
  getQuestionTypeInfo,
  getQuestionTypesBySection,
  getAllSections
}; 