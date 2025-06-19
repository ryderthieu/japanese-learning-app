const mongoose = require('mongoose');
const Question = require('./models/question');
const Test = require('./models/test');
const User = require('./models/user');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Dữ liệu câu hỏi mẫu cho N5
const questionsN5 = [
    // === MOJI-GOI (Từ vựng) ===
    
    // Kanji-Hiragana
    {
        questionText: '漢字「学校」の読み方は？',
        options: [
            { text: 'がっこう', isCorrect: true },
            { text: 'がくこう', isCorrect: false },
            { text: 'がっこ', isCorrect: false },
            { text: 'がくこ', isCorrect: false }
        ],
        level: 'N5',
        type: 'kanji-hiragana',
        section: 'moji-goi',
        subSection: 'kanji-reading',
        difficulty: 1,
        explanation: '学校 (がっこう) có nghĩa là "trường học"',
        correctAnswer: 'がっこう'
    },
    {
        questionText: '漢字「本」の読み方は？',
        options: [
            { text: 'ほん', isCorrect: true },
            { text: 'もと', isCorrect: false },
            { text: 'ぼん', isCorrect: false },
            { text: 'ぽん', isCorrect: false }
        ],
        level: 'N5',
        type: 'kanji-hiragana',
        section: 'moji-goi',
        subSection: 'kanji-reading',
        difficulty: 1,
        explanation: '本 (ほん) có nghĩa là "sách"',
        correctAnswer: 'ほん'
    },
    {
        questionText: '漢字「食べる」の読み方は？',
        options: [
            { text: 'のべる', isCorrect: false },
            { text: 'たべる', isCorrect: true },
            { text: 'しべる', isCorrect: false },
            { text: 'こべる', isCorrect: false }
        ],
        level: 'N5',
        type: 'kanji-hiragana',
        section: 'moji-goi',
        subSection: 'kanji-reading',
        difficulty: 1,
        explanation: '食べる (たべる) có nghĩa là "ăn"',
        correctAnswer: 'たべる'
    },

    // Hiragana-Kanji
    {
        questionText: 'ひらがな「みず」を漢字で書くと？',
        options: [
            { text: '水', isCorrect: true },
            { text: '木', isCorrect: false },
            { text: '火', isCorrect: false },
            { text: '土', isCorrect: false }
        ],
        level: 'N5',
        type: 'hiragana-kanji',
        section: 'moji-goi',
        subSection: 'kanji-writing',
        difficulty: 1,
        explanation: 'みず được viết bằng kanji là 水 (nước)',
        correctAnswer: '水'
    },
    {
        questionText: 'ひらがな「あめ」を漢字で書くと？',
        options: [
            { text: '風', isCorrect: false },
            { text: '雨', isCorrect: true },
            { text: '雪', isCorrect: false },
            { text: '雲', isCorrect: false }
        ],
        level: 'N5',
        type: 'hiragana-kanji',
        section: 'moji-goi',
        subSection: 'kanji-writing',
        difficulty: 1,
        explanation: 'あめ được viết bằng kanji là 雨 (mưa)',
        correctAnswer: '雨'
    },

    // Context Grammar (Từ vựng theo ngữ cảnh)
    {
        questionText: '朝ごはんを（　　）。',
        options: [
            { text: '食べます', isCorrect: true },
            { text: '飲みます', isCorrect: false },
            { text: '読みます', isCorrect: false },
            { text: '書きます', isCorrect: false }
        ],
        level: 'N5',
        type: 'context-grammar',
        section: 'moji-goi',
        subSection: 'vocabulary-context',
        difficulty: 2,
        explanation: 'Với bữa sáng (朝ごはん) ta dùng 食べます (ăn)',
        correctAnswer: '食べます'
    },
    {
        questionText: 'コーヒーを（　　）。',
        options: [
            { text: '食べます', isCorrect: false },
            { text: '飲みます', isCorrect: true },
            { text: '見ます', isCorrect: false },
            { text: '聞きます', isCorrect: false }
        ],
        level: 'N5',
        type: 'context-grammar',
        section: 'moji-goi',
        subSection: 'vocabulary-context',
        difficulty: 2,
        explanation: 'Với cà phê ta dùng 飲みます (uống)',
        correctAnswer: '飲みます'
    },

    // === BUNPOU (Ngữ pháp) ===
    
    // Grammar Selection
    {
        questionText: '私（　　）学生です。',
        options: [
            { text: 'は', isCorrect: true },
            { text: 'が', isCorrect: false },
            { text: 'を', isCorrect: false },
            { text: 'に', isCorrect: false }
        ],
        level: 'N5',
        type: 'grammar-selection',
        section: 'bunpou',
        subSection: 'particles',
        difficulty: 1,
        explanation: 'は là trợ từ chủ đề, dùng để giới thiệu chủ đề câu',
        correctAnswer: 'は'
    },
    {
        questionText: '本（　　）読みます。',
        options: [
            { text: 'は', isCorrect: false },
            { text: 'が', isCorrect: false },
            { text: 'を', isCorrect: true },
            { text: 'に', isCorrect: false }
        ],
        level: 'N5',
        type: 'grammar-selection',
        section: 'bunpou',
        subSection: 'particles',
        difficulty: 1,
        explanation: 'を là trợ từ tân ngữ, đứng sau danh từ làm tân ngữ',
        correctAnswer: 'を'
    },
    {
        questionText: '図書館（　　）行きます。',
        options: [
            { text: 'を', isCorrect: false },
            { text: 'に', isCorrect: true },
            { text: 'で', isCorrect: false },
            { text: 'と', isCorrect: false }
        ],
        level: 'N5',
        type: 'grammar-selection',
        section: 'bunpou',
        subSection: 'particles',
        difficulty: 2,
        explanation: 'に chỉ hướng đi, điểm đến của hành động',
        correctAnswer: 'に'
    },

    // Sentence Combination
    {
        questionText: '次の語を並べ替えて正しい文を作ってください：\n昨日 / 映画を / 見ました / 友達と',
        options: [
            { text: '昨日友達と映画を見ました。', isCorrect: true },
            { text: '友達と昨日映画を見ました。', isCorrect: false },
            { text: '映画を昨日友達と見ました。', isCorrect: false },
            { text: '見ました昨日友達と映画を。', isCorrect: false }
        ],
        level: 'N5',
        type: 'sentence-combination',
        section: 'bunpou',
        subSection: 'sentence-structure',
        difficulty: 2,
        explanation: 'Thứ tự: Thời gian + Với ai + Tân ngữ + Động từ',
        correctAnswer: '昨日友達と映画を見ました。'
    },

    // === DOKKAI (Đọc hiểu) ===
    
    // Short Reading
    {
        questionText: '田中です。今日は月曜日です。朝、コーヒーを飲みました。それから、会社に行きました。',
        readingPassage: '田中です。今日は月曜日です。朝、コーヒーを飲みました。それから、会社に行きました。',
        options: [
            { text: '田中さんは朝、何を飲みましたか。', isCorrect: false },
            { text: 'コーヒー', isCorrect: true },
            { text: 'お茶', isCorrect: false },
            { text: '水', isCorrect: false }
        ],
        level: 'N5',
        type: 'short-reading',
        section: 'dokkai',
        subSection: 'simple-text',
        difficulty: 2,
        explanation: '文章中に「朝、コーヒーを飲みました」とあります',
        correctAnswer: 'コーヒー'
    },
    {
        questionText: '私の家族は４人です。父、母、兄、私です。父は会社員です。母は主婦です。兄は大学生です。私は高校生です。\n\n私の家族は何人ですか。',
        readingPassage: '私の家族は４人です。父、母、兄、私です。父は会社員です。母は主婦です。兄は大学生です。私は高校生です。',
        options: [
            { text: '３人', isCorrect: false },
            { text: '４人', isCorrect: true },
            { text: '５人', isCorrect: false },
            { text: '６人', isCorrect: false }
        ],
        level: 'N5',
        type: 'short-reading',
        section: 'dokkai',
        subSection: 'simple-text',
        difficulty: 1,
        explanation: '文章の最初に「私の家族は４人です」とあります',
        correctAnswer: '４人'
    }
];

// Dữ liệu câu hỏi mẫu cho N4
const questionsN4 = [
    // === MOJI-GOI ===
    {
        questionText: '漢字「病気」の読み方は？',
        options: [
            { text: 'びょうき', isCorrect: true },
            { text: 'びょうけ', isCorrect: false },
            { text: 'へいき', isCorrect: false },
            { text: 'へいけ', isCorrect: false }
        ],
        level: 'N4',
        type: 'kanji-hiragana',
        section: 'moji-goi',
        subSection: 'kanji-reading',
        difficulty: 2,
        explanation: '病気 (びょうき) có nghĩa là "bệnh tật"',
        correctAnswer: 'びょうき'
    },
    {
        questionText: '次の文の（　　）に入る最も適当なものを選んでください。\n彼は毎日（　　）練習している。',
        options: [
            { text: '一生懸命', isCorrect: true },
            { text: '一生懸命に', isCorrect: false },
            { text: '一生懸命で', isCorrect: false },
            { text: '一生懸命な', isCorrect: false }
        ],
        level: 'N4',
        type: 'usage',
        section: 'moji-goi',
        subSection: 'adverb-usage',
        difficulty: 3,
        explanation: '一生懸命 là trạng từ, có thể dùng trực tiếp trước động từ',
        correctAnswer: '一生懸命'
    },

    // === BUNPOU ===
    {
        questionText: '明日雨が（　　）、ピクニックは中止です。',
        options: [
            { text: '降るなら', isCorrect: true },
            { text: '降れば', isCorrect: false },
            { text: '降るから', isCorrect: false },
            { text: '降って', isCorrect: false }
        ],
        level: 'N4',
        type: 'grammar-selection',
        section: 'bunpou',
        subSection: 'conditional',
        difficulty: 3,
        explanation: 'なら biểu thị điều kiện giả định, phù hợp với ngữ cảnh',
        correctAnswer: '降るなら'
    },

    // === DOKKAI ===
    {
        questionText: '来月、友達の結婚式があります。プレゼントを買わなければなりません。でも、何を買ったらいいか分かりません。友達に聞いてみようと思います。\n\n何について友達に聞きますか。',
        readingPassage: '来月、友達の結婚式があります。プレゼントを買わなければなりません。でも、何を買ったらいいか分かりません。友達に聞いてみようと思います。',
        options: [
            { text: '結婚式の時間', isCorrect: false },
            { text: 'プレゼントのこと', isCorrect: true },
            { text: '結婚式の場所', isCorrect: false },
            { text: '友達の住所', isCorrect: false }
        ],
        level: 'N4',
        type: 'medium-reading',
        section: 'dokkai',
        subSection: 'comprehension',
        difficulty: 3,
        explanation: '「何を買ったらいいか分かりません」から、プレゼントについて聞くことが分かります',
        correctAnswer: 'プレゼントのこと'
    }
];

// Dữ liệu Test mẫu
const testTemplates = [
    {
        title: 'JLPT N5 模擬試験 第1回',
        description: 'Đề thi thử JLPT N5 đầy đủ các phần thi',
        level: 'N5',
        sections: [
            {
                name: 'moji-goi',
                title: '文字・語彙 (Từ vựng và Chữ viết)',
                description: 'Phần thi về từ vựng, kanji và cách sử dụng từ',
                timeLimit: 25,
                questions: [],
                subSections: [
                    {
                        name: 'kanji-reading',
                        title: '漢字読み',
                        description: 'Đọc kanji',
                        questionTypes: ['kanji-hiragana'],
                        questionCount: 8
                    },
                    {
                        name: 'kanji-writing', 
                        title: '表記',
                        description: 'Viết kanji',
                        questionTypes: ['hiragana-kanji'],
                        questionCount: 6
                    },
                    {
                        name: 'vocabulary-context',
                        title: '文脈規定',
                        description: 'Từ vựng theo ngữ cảnh',
                        questionTypes: ['context-grammar', 'usage'],
                        questionCount: 11
                    },
                    {
                        name: 'synonyms',
                        title: '言い換え類義',
                        description: 'Từ đồng nghĩa',
                        questionTypes: ['synonyms'],
                        questionCount: 5
                    }
                ]
            },
            {
                name: 'bunpou',
                title: '文法 (Ngữ pháp)',
                description: 'Phần thi về ngữ pháp và cấu trúc câu',
                timeLimit: 50,
                questions: [],
                subSections: [
                    {
                        name: 'grammar-form',
                        title: '文法形式の判断',
                        description: 'Chọn ngữ pháp đúng',
                        questionTypes: ['grammar-selection'],
                        questionCount: 16
                    },
                    {
                        name: 'sentence-structure',
                        title: '文の組み立て',
                        description: 'Sắp xếp câu',
                        questionTypes: ['sentence-combination'],
                        questionCount: 5
                    },
                    {
                        name: 'text-grammar',
                        title: '文章の文法',
                        description: 'Ngữ pháp trong đoạn văn',
                        questionTypes: ['text-grammar'],
                        questionCount: 5
                    }
                ]
            },
            {
                name: 'dokkai',
                title: '読解 (Đọc hiểu)',
                description: 'Phần thi đọc hiểu các loại văn bản',
                timeLimit: 30,
                questions: [],
                subSections: [
                    {
                        name: 'short-text',
                        title: '内容理解（短文）',
                        description: 'Đọc hiểu đoạn văn ngắn',
                        questionTypes: ['short-reading'],
                        questionCount: 4
                    },
                    {
                        name: 'information-search',
                        title: '情報検索',
                        description: 'Tìm kiếm thông tin',
                        questionTypes: ['information-search'],
                        questionCount: 2
                    }
                ]
            }
        ],
        totalTime: 105,
        totalQuestions: 67,
        passingScore: 80,
        maxScore: 180,
        isActive: true,
        isPublic: true,
        category: 'mock',
        tags: ['N5', 'mock-test', 'full-test'],
        showAnswers: true,
        showExplanation: true,
        allowReview: true
    },
    {
        title: 'JLPT N4 模擬試験 第1回',
        description: 'Đề thi thử JLPT N4 đầy đủ các phần thi',
        level: 'N4',
        sections: [
            {
                name: 'moji-goi',
                title: '文字・語彙 (Từ vựng và Chữ viết)',
                description: 'Phần thi về từ vựng, kanji và cách sử dụng từ',
                timeLimit: 30,
                questions: [],
                subSections: [
                    {
                        name: 'kanji-reading',
                        title: '漢字読み',
                        description: 'Đọc kanji',
                        questionTypes: ['kanji-hiragana'],
                        questionCount: 10
                    },
                    {
                        name: 'kanji-writing',
                        title: '表記', 
                        description: 'Viết kanji',
                        questionTypes: ['hiragana-kanji'],
                        questionCount: 8
                    },
                    {
                        name: 'vocabulary-context',
                        title: '文脈規定',
                        description: 'Từ vựng theo ngữ cảnh',
                        questionTypes: ['context-grammar', 'usage'],
                        questionCount: 12
                    },
                    {
                        name: 'synonyms',
                        title: '言い換え類義',
                        description: 'Từ đồng nghĩa',
                        questionTypes: ['synonyms'],
                        questionCount: 7
                    }
                ]
            },
            {
                name: 'bunpou',
                title: '文法 (Ngữ pháp)',
                description: 'Phần thi về ngữ pháp và cấu trúc câu',
                timeLimit: 60,
                questions: [],
                subSections: [
                    {
                        name: 'grammar-form',
                        title: '文法形式の判断',
                        description: 'Chọn ngữ pháp đúng',
                        questionTypes: ['grammar-selection'],
                        questionCount: 15
                    },
                    {
                        name: 'sentence-structure',
                        title: '文の組み立て',
                        description: 'Sắp xếp câu',
                        questionTypes: ['sentence-combination'],
                        questionCount: 5
                    },
                    {
                        name: 'text-grammar',
                        title: '文章の文法',
                        description: 'Ngữ pháp trong đoạn văn',
                        questionTypes: ['text-grammar'],
                        questionCount: 5
                    }
                ]
            },
            {
                name: 'dokkai',
                title: '読解 (Đọc hiểu)',
                description: 'Phần thi đọc hiểu các loại văn bản',
                timeLimit: 35,
                questions: [],
                subSections: [
                    {
                        name: 'short-text',
                        title: '内容理解（短文）',
                        description: 'Đọc hiểu đoạn văn ngắn',
                        questionTypes: ['short-reading'],
                        questionCount: 3
                    },
                    {
                        name: 'medium-text',
                        title: '内容理解（中文）',
                        description: 'Đọc hiểu đoạn văn trung bình',
                        questionTypes: ['medium-reading'],
                        questionCount: 4
                    },
                    {
                        name: 'information-search',
                        title: '情報検索',
                        description: 'Tìm kiếm thông tin',
                        questionTypes: ['information-search'],
                        questionCount: 3
                    }
                ]
            }
        ],
        totalTime: 125,
        totalQuestions: 72,
        passingScore: 90,
        maxScore: 180,
        isActive: true,
        isPublic: true,
        category: 'mock',
        tags: ['N4', 'mock-test', 'full-test'],
        showAnswers: true,
        showExplanation: true,
        allowReview: true
    }
];

// Hàm seed dữ liệu
async function seedDatabase() {
    try {
        console.log('🌱 Bắt đầu seed database...');

        // Xóa dữ liệu cũ
        console.log('🗑️  Xóa dữ liệu cũ...');
        await Question.deleteMany({});
        await Test.deleteMany({});

        // Tạo user admin nếu chưa có
        let adminUser = await User.findOne({ email: 'admin@jlpt.com' });
        if (!adminUser) {
            console.log('👤 Tạo user admin...');
            adminUser = await User.create({
                email: 'admin@jlpt.com',
                password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                fullName: 'Admin JLPT',
                jlptLevel: 'N1',
                targetLevel: 'N1'
            });
        }

        // Thêm câu hỏi N5
        console.log('📝 Thêm câu hỏi N5...');
        const insertedQuestionsN5 = await Question.insertMany(questionsN5);
        console.log(`✅ Đã thêm ${insertedQuestionsN5.length} câu hỏi N5`);

        // Thêm câu hỏi N4
        console.log('📝 Thêm câu hỏi N4...');
        const insertedQuestionsN4 = await Question.insertMany(questionsN4);
        console.log(`✅ Đã thêm ${insertedQuestionsN4.length} câu hỏi N4`);

        // Tạo test templates với câu hỏi đã thêm
        console.log('📋 Tạo bài thi...');

        // Test N5
        const n5Template = { ...testTemplates[0] };
        n5Template.createdBy = adminUser._id;
        
        // Gán câu hỏi cho từng section
        const n5Questions = insertedQuestionsN5.filter(q => q.level === 'N5');
        
        // Moji-Goi section
        const mojiGoiQuestions = n5Questions.filter(q => q.section === 'moji-goi');
        n5Template.sections[0].questions = mojiGoiQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        // Bunpou section
        const bunpouQuestions = n5Questions.filter(q => q.section === 'bunpou');
        n5Template.sections[1].questions = bunpouQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        // Dokkai section
        const dokkaiQuestions = n5Questions.filter(q => q.section === 'dokkai');
        n5Template.sections[2].questions = dokkaiQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        const testN5 = await Test.create(n5Template);
        console.log(`✅ Đã tạo bài thi N5: ${testN5.title}`);

        // Test N4
        const n4Template = { ...testTemplates[1] };
        n4Template.createdBy = adminUser._id;
        
        const n4Questions = insertedQuestionsN4.filter(q => q.level === 'N4');
        
        // Gán câu hỏi cho từng section N4
        const n4MojiGoiQuestions = n4Questions.filter(q => q.section === 'moji-goi');
        n4Template.sections[0].questions = n4MojiGoiQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        const n4BunpouQuestions = n4Questions.filter(q => q.section === 'bunpou');
        n4Template.sections[1].questions = n4BunpouQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        const n4DokkaiQuestions = n4Questions.filter(q => q.section === 'dokkai');
        n4Template.sections[2].questions = n4DokkaiQuestions.map((q, index) => ({
            questionId: q._id,
            order: index + 1,
            points: 1
        }));

        const testN4 = await Test.create(n4Template);
        console.log(`✅ Đã tạo bài thi N4: ${testN4.title}`);

        // Thống kê kết quả
        console.log('\n📊 Thống kê seed database:');
        console.log(`Questions: ${await Question.countDocuments()}`);
        console.log(`Tests: ${await Test.countDocuments()}`);
        console.log(`Users: ${await User.countDocuments()}`);
        
        console.log('\n🎉 Seed database hoàn thành!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi seed database:', error);
        process.exit(1);
    }
}

// Chạy script
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, questionsN5, questionsN4, testTemplates }; 