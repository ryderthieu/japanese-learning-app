const fs = require('fs');

// Đọc dữ liệu cũ
const oldLessonsData = JSON.parse(fs.readFileSync('./japanese-learning-app.lessons.json', 'utf8'));

// Tạo collections mới
const lessons = [];
const vocabulary = [];
const grammar = [];

// Counter để tạo ID
let vocabCounter = 1;
let grammarCounter = 1;

// Chuyển đổi từng lesson
oldLessonsData.forEach((oldLesson, lessonIndex) => {
  const lessonId = oldLesson._id.$oid;
  const vocabularyRefs = [];
  const grammarRefs = [];

  // Chuyển đổi vocabulary
  if (oldLesson.vocabulary) {
    oldLesson.vocabulary.forEach((vocab, vocabIndex) => {
      const vocabId = `vocab_${vocabCounter}`;
      vocabularyRefs.push(vocabId);
      
      const vocabDoc = {
        _id: vocabId,
        word: vocab.word,
        kanji: vocab.kanji || '',
        meaning: vocab.meaning,
        examples: vocab.example || [],
        difficulty: 'beginner',
        level: 'N5',
        category: 'basic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      vocabulary.push(vocabDoc);
      vocabCounter++;
    });
  }

  // Chuyển đổi grammar
  if (oldLesson.grammar) {
    oldLesson.grammar.forEach((gram, gramIndex) => {
      const grammarId = `grammar_${grammarCounter}`;
      grammarRefs.push(grammarId);
      
      const grammarDoc = {
        _id: grammarId,
        rule: gram.rule,
        meaning: gram.meaning,
        examples: gram.example || [],
        difficulty: 'beginner',
        level: 'N5',
        category: 'basic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      grammar.push(grammarDoc);
      grammarCounter++;
    });
  }

  // Tạo lesson document mới
  const lessonDoc = {
    _id: lessonId,
    title: oldLesson.title,
    videoId: oldLesson.videoId || '',
    description: oldLesson.description || '',
    level: oldLesson.level || 'N5',
    order: lessonIndex + 1,
    vocabularyRefs: vocabularyRefs,
    grammarRefs: grammarRefs,
    isActive: true,
    createdAt: oldLesson.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  lessons.push(lessonDoc);
});

// Ghi file lessons mới
fs.writeFileSync('./data/lessons.json', JSON.stringify(lessons, null, 2));
console.log(`✅ Đã tạo ${lessons.length} lessons`);

// Ghi file vocabulary mới
fs.writeFileSync('./data/vocabulary.json', JSON.stringify(vocabulary, null, 2));
console.log(`✅ Đã tạo ${vocabulary.length} vocabulary items`);

// Ghi file grammar mới
fs.writeFileSync('./data/grammar.json', JSON.stringify(grammar, null, 2));
console.log(`✅ Đã tạo ${grammar.length} grammar items`);

// Tạo thống kê
const stats = {
  totalLessons: lessons.length,
  totalVocabulary: vocabulary.length,
  totalGrammar: grammar.length,
  convertedAt: new Date().toISOString()
};

fs.writeFileSync('./data/stats.json', JSON.stringify(stats, null, 2));
console.log('📊 Thống kê:', stats); 