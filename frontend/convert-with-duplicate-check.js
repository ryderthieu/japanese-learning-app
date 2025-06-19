const fs = require('fs');
const { ObjectId } = require('mongodb');

// Đọc dữ liệu cũ
const oldLessonsData = JSON.parse(fs.readFileSync('./japanese-learning-app.lessons.json', 'utf8'));

// Tạo collections mới
const lessons = [];
const vocabulary = [];
const grammar = [];

// Map để track duplicate vocabulary và grammar
const vocabularyMap = new Map(); // word -> _id
const grammarMap = new Map(); // rule -> _id

// Counter để tạo ID mới
let vocabCounter = 1;
let grammarCounter = 1;

/**
 * Kiểm tra và tạo vocabulary ID
 */
const getVocabularyId = (word) => {
  if (vocabularyMap.has(word)) {
    return vocabularyMap.get(word);
  }
  
  const vocabId = `vocab_${vocabCounter}`;
  vocabularyMap.set(word, vocabId);
  vocabCounter++;
  return vocabId;
};

/**
 * Kiểm tra và tạo grammar ID
 */
const getGrammarId = (rule) => {
  if (grammarMap.has(rule)) {
    return grammarMap.get(rule);
  }
  
  const grammarId = `grammar_${grammarCounter}`;
  grammarMap.set(rule, grammarId);
  grammarCounter++;
  return grammarId;
};

// Chuyển đổi từng lesson
oldLessonsData.forEach((oldLesson, lessonIndex) => {
  const lessonId = oldLesson._id.$oid;
  const vocabularyRefs = [];
  const grammarRefs = [];

  // Chuyển đổi vocabulary
  if (oldLesson.vocabulary) {
    oldLesson.vocabulary.forEach((vocab, vocabIndex) => {
      const vocabId = getVocabularyId(vocab.word);
      vocabularyRefs.push(vocabId);
      
      // Chỉ tạo vocabulary document nếu chưa tồn tại
      if (!vocabularyMap.has(vocab.word) || vocabularyMap.get(vocab.word) === vocabId) {
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
      }
    });
  }

  // Chuyển đổi grammar
  if (oldLesson.grammar) {
    oldLesson.grammar.forEach((gram, gramIndex) => {
      const grammarId = getGrammarId(gram.rule);
      grammarRefs.push(grammarId);
      
      // Chỉ tạo grammar document nếu chưa tồn tại
      if (!grammarMap.has(gram.rule) || grammarMap.get(gram.rule) === grammarId) {
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
      }
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

// Ghi file vocabulary mới (đã loại bỏ duplicate)
fs.writeFileSync('./data/vocabulary.json', JSON.stringify(vocabulary, null, 2));
console.log(`✅ Đã tạo ${vocabulary.length} vocabulary items (đã loại bỏ duplicate)`);

// Ghi file grammar mới (đã loại bỏ duplicate)
fs.writeFileSync('./data/grammar.json', JSON.stringify(grammar, null, 2));
console.log(`✅ Đã tạo ${grammar.length} grammar items (đã loại bỏ duplicate)`);

// Tạo thống kê
const stats = {
  totalLessons: lessons.length,
  totalVocabulary: vocabulary.length,
  totalGrammar: grammar.length,
  uniqueVocabulary: vocabularyMap.size,
  uniqueGrammar: grammarMap.size,
  convertedAt: new Date().toISOString()
};

fs.writeFileSync('./data/stats.json', JSON.stringify(stats, null, 2));
console.log('📊 Thống kê:', stats);

// Tạo script MongoDB để import với kiểm tra duplicate
const mongoScript = `
// === MONGODB IMPORT SCRIPT ===

// 1. Tạo collections
db.createCollection("vocabulary");
db.createCollection("grammar");
db.createCollection("lessons");

// 2. Import vocabulary với kiểm tra duplicate
const vocabularyData = ${JSON.stringify(vocabulary, null, 2)};

vocabularyData.forEach(vocab => {
  const existing = db.vocabulary.findOne({ "word": vocab.word });
  if (!existing) {
    db.vocabulary.insertOne({
      _id: vocab._id,
      word: vocab.word,
      kanji: vocab.kanji,
      meaning: vocab.meaning,
      examples: vocab.examples,
      difficulty: vocab.difficulty,
      level: vocab.level,
      category: vocab.category,
      createdAt: new Date(vocab.createdAt),
      updatedAt: new Date(vocab.updatedAt)
    });
    print("Inserted vocabulary: " + vocab.word);
  } else {
    print("Vocabulary already exists: " + vocab.word + " (ID: " + existing._id + ")");
  }
});

// 3. Import grammar với kiểm tra duplicate
const grammarData = ${JSON.stringify(grammar, null, 2)};

grammarData.forEach(gram => {
  const existing = db.grammar.findOne({ "rule": gram.rule });
  if (!existing) {
    db.grammar.insertOne({
      _id: gram._id,
      rule: gram.rule,
      meaning: gram.meaning,
      examples: gram.examples,
      difficulty: gram.difficulty,
      level: gram.level,
      category: gram.category,
      createdAt: new Date(gram.createdAt),
      updatedAt: new Date(gram.updatedAt)
    });
    print("Inserted grammar: " + gram.rule);
  } else {
    print("Grammar already exists: " + gram.rule + " (ID: " + existing._id + ")");
  }
});

// 4. Import lessons
const lessonsData = ${JSON.stringify(lessons, null, 2)};

lessonsData.forEach(lesson => {
  db.lessons.insertOne({
    _id: lesson._id,
    title: lesson.title,
    videoId: lesson.videoId,
    description: lesson.description,
    level: lesson.level,
    order: lesson.order,
    vocabularyRefs: lesson.vocabularyRefs,
    grammarRefs: lesson.grammarRefs,
    isActive: lesson.isActive,
    createdAt: new Date(lesson.createdAt),
    updatedAt: new Date(lesson.updatedAt)
  });
  print("Inserted lesson: " + lesson.title);
});

// 5. Tạo indexes
db.vocabulary.createIndex({ "word": 1 }, { unique: true });
db.vocabulary.createIndex({ "level": 1 });
db.vocabulary.createIndex({ "difficulty": 1 });
db.vocabulary.createIndex({ "category": 1 });

db.grammar.createIndex({ "rule": 1 }, { unique: true });
db.grammar.createIndex({ "level": 1 });
db.grammar.createIndex({ "difficulty": 1 });
db.grammar.createIndex({ "category": 1 });

db.lessons.createIndex({ "level": 1 });
db.lessons.createIndex({ "order": 1 });
db.lessons.createIndex({ "isActive": 1 });

print("=== IMPORT COMPLETED ===");
print("Total vocabulary: " + db.vocabulary.count());
print("Total grammar: " + db.grammar.count());
print("Total lessons: " + db.lessons.count());
`;

fs.writeFileSync('./data/mongo-import-script.js', mongoScript);
console.log('📝 Đã tạo MongoDB import script: ./data/mongo-import-script.js'); 