const { JLPT_SECTIONS, QUESTION_TYPES, getQuestionTypesBySection } = require('./questionTypes');

/**
 * Template cấu trúc bài thi JLPT theo từng cấp độ
 * Dựa trên cấu trúc thực tế của kỳ thi JLPT
 */

const JLPT_TEST_TEMPLATES = {
  N5: {
    title: 'JLPT N5 Mock Test',
    description: 'Bài thi thử JLPT N5 - Cấp độ cơ bản',
    level: 'N5',
    totalTime: 105, // 105 phút
    passingScore: 80, // 80/180 điểm
    maxScore: 180,
    sections: [
      {
        name: 'moji-goi',
        title: '文字・語彙 (Từ vựng và chữ viết)',
        description: 'Phần thi từ vựng và chữ viết - 25 phút',
        timeLimit: 25,
        subSections: [
          {
            name: 'kanji-reading',
            title: '漢字読み - Đọc kanji',
            description: 'Chọn cách đọc hiragana đúng cho kanji',
            questionTypes: ['kanji-hiragana'],
            questionCount: 12
          },
          {
            name: 'kanji-writing',
            title: '表記 - Viết kanji',
            description: 'Chọn kanji đúng cho từ hiragana',
            questionTypes: ['hiragana-kanji'],
            questionCount: 8
          },
          {
            name: 'word-formation',
            title: '語形成 - Tạo từ',
            description: 'Chọn từ kanji phù hợp để kết hợp',
            questionTypes: ['word-formation'],
            questionCount: 5
          },
          {
            name: 'context-grammar',
            title: '文脈規定 - Từ vựng theo ngữ cảnh',
            description: 'Chọn từ vựng phù hợp với ngữ cảnh',
            questionTypes: ['context-grammar'],
            questionCount: 5
          },
          {
            name: 'synonyms',
            title: '言い換え類義 - Từ đồng nghĩa',
            description: 'Chọn từ đồng nghĩa hoặc cách diễn đạt tương đương',
            questionTypes: ['synonyms'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'bunpou',
        title: '文法 (Ngữ pháp)',
        description: 'Phần thi ngữ pháp - 50 phút',
        timeLimit: 50,
        subSections: [
          {
            name: 'grammar-selection',
            title: '文法形式の判断 - Chọn ngữ pháp đúng',
            description: 'Chọn ngữ pháp phù hợp để hoàn thành câu',
            questionTypes: ['grammar-selection'],
            questionCount: 16
          },
          {
            name: 'sentence-combination',
            title: '文の組み立て - Sắp xếp câu',
            description: 'Sắp xếp các từ thành câu hoàn chỉnh',
            questionTypes: ['sentence-combination'],
            questionCount: 5
          },
          {
            name: 'text-grammar',
            title: '文章の文法 - Ngữ pháp trong đoạn văn',
            description: 'Chọn ngữ pháp phù hợp để điền vào đoạn văn',
            questionTypes: ['text-grammar'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'dokkai',
        title: '読解 (Đọc hiểu)',
        description: 'Phần thi đọc hiểu - 30 phút',
        timeLimit: 30,
        subSections: [
          {
            name: 'short-reading',
            title: '内容理解（短文） - Đọc hiểu ngắn',
            description: 'Đọc hiểu đoạn văn ngắn',
            questionTypes: ['short-reading'],
            questionCount: 3
          },
          {
            name: 'medium-reading',
            title: '内容理解（中文） - Đọc hiểu trung',
            description: 'Đọc hiểu đoạn văn trung bình',
            questionTypes: ['medium-reading'],
            questionCount: 2
          },
          {
            name: 'information-search',
            title: '情報検索 - Tìm kiếm thông tin',
            description: 'Tìm kiếm thông tin trong văn bản',
            questionTypes: ['information-search'],
            questionCount: 1
          }
        ]
      }
    ]
  },

  N4: {
    title: 'JLPT N4 Mock Test',
    description: 'Bài thi thử JLPT N4 - Cấp độ sơ cấp',
    level: 'N4',
    totalTime: 125, // 125 phút
    passingScore: 90, // 90/180 điểm
    maxScore: 180,
    sections: [
      {
        name: 'moji-goi',
        title: '文字・語彙 (Từ vựng và chữ viết)',
        description: 'Phần thi từ vựng và chữ viết - 30 phút',
        timeLimit: 30,
        subSections: [
          {
            name: 'kanji-reading',
            title: '漢字読み - Đọc kanji',
            questionTypes: ['kanji-hiragana'],
            questionCount: 9
          },
          {
            name: 'kanji-writing',
            title: '表記 - Viết kanji',
            questionTypes: ['hiragana-kanji'],
            questionCount: 6
          },
          {
            name: 'word-formation',
            title: '語形成 - Tạo từ',
            questionTypes: ['word-formation'],
            questionCount: 5
          },
          {
            name: 'context-grammar',
            title: '文脈規定 - Từ vựng theo ngữ cảnh',
            questionTypes: ['context-grammar'],
            questionCount: 7
          },
          {
            name: 'synonyms',
            title: '言い換え類義 - Từ đồng nghĩa',
            questionTypes: ['synonyms'],
            questionCount: 5
          },
          {
            name: 'usage',
            title: '用法 - Cách sử dụng từ',
            questionTypes: ['usage'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'bunpou',
        title: '文法 (Ngữ pháp)',
        description: 'Phần thi ngữ pháp - 60 phút',
        timeLimit: 60,
        subSections: [
          {
            name: 'grammar-selection',
            title: '文法形式の判断 - Chọn ngữ pháp đúng',
            questionTypes: ['grammar-selection'],
            questionCount: 15
          },
          {
            name: 'sentence-combination',
            title: '文の組み立て - Sắp xếp câu',
            questionTypes: ['sentence-combination'],
            questionCount: 5
          },
          {
            name: 'text-grammar',
            title: '文章の文法 - Ngữ pháp trong đoạn văn',
            questionTypes: ['text-grammar'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'dokkai',
        title: '読解 (Đọc hiểu)',
        description: 'Phần thi đọc hiểu - 35 phút',
        timeLimit: 35,
        subSections: [
          {
            name: 'short-reading',
            title: '内容理解（短文） - Đọc hiểu ngắn',
            questionTypes: ['short-reading'],
            questionCount: 4
          },
          {
            name: 'medium-reading',
            title: '内容理解（中文） - Đọc hiểu trung',
            questionTypes: ['medium-reading'],
            questionCount: 4
          },
          {
            name: 'information-search',
            title: '情報検索 - Tìm kiếm thông tin',
            questionTypes: ['information-search'],
            questionCount: 2
          }
        ]
      }
    ]
  },

  N3: {
    title: 'JLPT N3 Mock Test',
    description: 'Bài thi thử JLPT N3 - Cấp độ trung cấp',
    level: 'N3',
    totalTime: 140, // 140 phút
    passingScore: 95, // 95/180 điểm
    maxScore: 180,
    sections: [
      {
        name: 'moji-goi',
        title: '文字・語彙 (Từ vựng và chữ viết)',
        description: 'Phần thi từ vựng và chữ viết - 30 phút',
        timeLimit: 30,
        subSections: [
          {
            name: 'kanji-reading',
            title: '漢字読み - Đọc kanji',
            questionTypes: ['kanji-hiragana'],
            questionCount: 8
          },
          {
            name: 'kanji-writing',
            title: '表記 - Viết kanji',
            questionTypes: ['hiragana-kanji'],
            questionCount: 6
          },
          {
            name: 'word-formation',
            title: '語形成 - Tạo từ',
            questionTypes: ['word-formation'],
            questionCount: 11
          },
          {
            name: 'context-grammar',
            title: '文脈規定 - Từ vựng theo ngữ cảnh',
            questionTypes: ['context-grammar'],
            questionCount: 5
          },
          {
            name: 'synonyms',
            title: '言い換え類義 - Từ đồng nghĩa',
            questionTypes: ['synonyms'],
            questionCount: 5
          },
          {
            name: 'usage',
            title: '用法 - Cách sử dụng từ',
            questionTypes: ['usage'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'bunpou',
        title: '文法 (Ngữ pháp)',
        description: 'Phần thi ngữ pháp - 70 phút',
        timeLimit: 70,
        subSections: [
          {
            name: 'grammar-selection',
            title: '文法形式の判断 - Chọn ngữ pháp đúng',
            questionTypes: ['grammar-selection'],
            questionCount: 13
          },
          {
            name: 'sentence-combination',
            title: '文の組み立て - Sắp xếp câu',
            questionTypes: ['sentence-combination'],
            questionCount: 5
          },
          {
            name: 'text-grammar',
            title: '文章の文法 - Ngữ pháp trong đoạn văn',
            questionTypes: ['text-grammar'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'dokkai',
        title: '読解 (Đọc hiểu)',
        description: 'Phần thi đọc hiểu - 40 phút',
        timeLimit: 40,
        subSections: [
          {
            name: 'short-reading',
            title: '内容理解（短文） - Đọc hiểu ngắn',
            questionTypes: ['short-reading'],
            questionCount: 4
          },
          {
            name: 'medium-reading',
            title: '内容理解（中文） - Đọc hiểu trung',
            questionTypes: ['medium-reading'],
            questionCount: 6
          },
          {
            name: 'long-reading',
            title: '内容理解（長文） - Đọc hiểu dài',
            questionTypes: ['long-reading'],
            questionCount: 4
          },
          {
            name: 'information-search',
            title: '情報検索 - Tìm kiếm thông tin',
            questionTypes: ['information-search'],
            questionCount: 2
          }
        ]
      }
    ]
  },

  N2: {
    title: 'JLPT N2 Mock Test',
    description: 'Bài thi thử JLPT N2 - Cấp độ trung cao cấp',
    level: 'N2',
    totalTime: 155, // 155 phút
    passingScore: 90, // 90/180 điểm
    maxScore: 180,
    sections: [
      {
        name: 'moji-goi',
        title: '文字・語彙 (Từ vựng và chữ viết)',
        description: 'Phần thi từ vựng và chữ viết - 25 phút',
        timeLimit: 25,
        subSections: [
          {
            name: 'kanji-reading',
            title: '漢字読み - Đọc kanji',
            questionTypes: ['kanji-hiragana'],
            questionCount: 5
          },
          {
            name: 'kanji-writing',
            title: '表記 - Viết kanji',
            questionTypes: ['hiragana-kanji'],
            questionCount: 5
          },
          {
            name: 'word-formation',
            title: '語形成 - Tạo từ',
            questionTypes: ['word-formation'],
            questionCount: 5
          },
          {
            name: 'context-grammar',
            title: '文脈規定 - Từ vựng theo ngữ cảnh',
            questionTypes: ['context-grammar'],
            questionCount: 7
          },
          {
            name: 'synonyms',
            title: '言い換え類義 - Từ đồng nghĩa',
            questionTypes: ['synonyms'],
            questionCount: 5
          },
          {
            name: 'usage',
            title: '用法 - Cách sử dụng từ',
            questionTypes: ['usage'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'bunpou',
        title: '文法 (Ngữ pháp)',
        description: 'Phần thi ngữ pháp - 40 phút',
        timeLimit: 40,
        subSections: [
          {
            name: 'grammar-selection',
            title: '文法形式の判断 - Chọn ngữ pháp đúng',
            questionTypes: ['grammar-selection'],
            questionCount: 12
          },
          {
            name: 'sentence-combination',
            title: '文の組み立て - Sắp xếp câu',
            questionTypes: ['sentence-combination'],
            questionCount: 5
          },
          {
            name: 'text-grammar',
            title: '文章の文法 - Ngữ pháp trong đoạn văn',
            questionTypes: ['text-grammar'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'dokkai',
        title: '読解 (Đọc hiểu)',
        description: 'Phần thi đọc hiểu - 50 phút',
        timeLimit: 50,
        subSections: [
          {
            name: 'short-reading',
            title: '内容理解（短文） - Đọc hiểu ngắn',
            questionTypes: ['short-reading'],
            questionCount: 5
          },
          {
            name: 'medium-reading',
            title: '内容理解（中文） - Đọc hiểu trung',
            questionTypes: ['medium-reading'],
            questionCount: 9
          },
          {
            name: 'long-reading',
            title: '内容理解（長文） - Đọc hiểu dài',
            questionTypes: ['long-reading'],
            questionCount: 3
          },
          {
            name: 'comparative-reading',
            title: '統合理解 - So sánh đoạn văn',
            questionTypes: ['comparative-reading'],
            questionCount: 2
          },
          {
            name: 'information-search',
            title: '情報検索 - Tìm kiếm thông tin',
            questionTypes: ['information-search'],
            questionCount: 2
          }
        ]
      }
    ]
  },

  N1: {
    title: 'JLPT N1 Mock Test',
    description: 'Bài thi thử JLPT N1 - Cấp độ cao cấp',
    level: 'N1',
    totalTime: 170, // 170 phút
    passingScore: 100, // 100/180 điểm
    maxScore: 180,
    sections: [
      {
        name: 'moji-goi',
        title: '文字・語彙 (Từ vựng và chữ viết)',
        description: 'Phần thi từ vựng và chữ viết - 30 phút',
        timeLimit: 30,
        subSections: [
          {
            name: 'kanji-reading',
            title: '漢字読み - Đọc kanji',
            questionTypes: ['kanji-hiragana'],
            questionCount: 6
          },
          {
            name: 'kanji-writing',
            title: '表記 - Viết kanji',
            questionTypes: ['hiragana-kanji'],
            questionCount: 6
          },
          {
            name: 'word-formation',
            title: '語形成 - Tạo từ',
            questionTypes: ['word-formation'],
            questionCount: 7
          },
          {
            name: 'context-grammar',
            title: '文脈規定 - Từ vựng theo ngữ cảnh',
            questionTypes: ['context-grammar'],
            questionCount: 6
          },
          {
            name: 'synonyms',
            title: '言い換え類義 - Từ đồng nghĩa',
            questionTypes: ['synonyms'],
            questionCount: 6
          },
          {
            name: 'usage',
            title: '用法 - Cách sử dụng từ',
            questionTypes: ['usage'],
            questionCount: 6
          }
        ]
      },
      {
        name: 'bunpou',
        title: '文法 (Ngữ pháp)',
        description: 'Phần thi ngữ pháp - 40 phút',
        timeLimit: 40,
        subSections: [
          {
            name: 'grammar-selection',
            title: '文法形式の判断 - Chọn ngữ pháp đúng',
            questionTypes: ['grammar-selection'],
            questionCount: 10
          },
          {
            name: 'sentence-combination',
            title: '文の組み立て - Sắp xếp câu',
            questionTypes: ['sentence-combination'],
            questionCount: 5
          },
          {
            name: 'text-grammar',
            title: '文章の文法 - Ngữ pháp trong đoạn văn',
            questionTypes: ['text-grammar'],
            questionCount: 5
          }
        ]
      },
      {
        name: 'dokkai',
        title: '読解 (Đọc hiểu)',
        description: 'Phần thi đọc hiểu - 60 phút',
        timeLimit: 60,
        subSections: [
          {
            name: 'short-reading',
            title: '内容理解（短文） - Đọc hiểu ngắn',
            questionTypes: ['short-reading'],
            questionCount: 4
          },
          {
            name: 'medium-reading',
            title: '内容理解（中文） - Đọc hiểu trung',
            questionTypes: ['medium-reading'],
            questionCount: 9
          },
          {
            name: 'long-reading',
            title: '内容理解（長文） - Đọc hiểu dài',
            questionTypes: ['long-reading'],
            questionCount: 4
          },
          {
            name: 'comparative-reading',
            title: '統合理解 - So sánh đoạn văn',
            questionTypes: ['comparative-reading'],
            questionCount: 3
          },
          {
            name: 'information-search',
            title: '情報検索 - Tìm kiếm thông tin',
            questionTypes: ['information-search'],
            questionCount: 2
          }
        ]
      }
    ]
  }
};

// Hàm helper để tạo template bài thi
const createTestTemplate = (level) => {
  const template = JLPT_TEST_TEMPLATES[level];
  if (!template) {
    throw new Error(`Template không tồn tại cho level ${level}`);
  }
  
  return {
    ...template,
    sections: template.sections.map(section => ({
      ...section,
      questions: [], // Khởi tạo mảng câu hỏi rỗng
      subSections: section.subSections.map(subSection => ({
        ...subSection,
        questionCount: 0 // Khởi tạo số câu hỏi = 0
      }))
    }))
  };
};

// Hàm helper để lấy thông tin section
const getSectionInfo = (level, sectionName) => {
  const template = JLPT_TEST_TEMPLATES[level];
  if (!template) return null;
  
  return template.sections.find(section => section.name === sectionName);
};

// Hàm helper để lấy thông tin subsection
const getSubSectionInfo = (level, sectionName, subSectionName) => {
  const section = getSectionInfo(level, sectionName);
  if (!section) return null;
  
  return section.subSections.find(subSection => subSection.name === subSectionName);
};

// Hàm helper để lấy tổng số câu hỏi theo level
const getTotalQuestionsByLevel = (level) => {
  const template = JLPT_TEST_TEMPLATES[level];
  if (!template) return 0;
  
  return template.sections.reduce((total, section) => {
    return total + section.subSections.reduce((sectionTotal, subSection) => {
      return sectionTotal + subSection.questionCount;
    }, 0);
  }, 0);
};

module.exports = {
  JLPT_TEST_TEMPLATES,
  createTestTemplate,
  getSectionInfo,
  getSubSectionInfo,
  getTotalQuestionsByLevel
}; 