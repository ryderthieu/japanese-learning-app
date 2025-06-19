const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastName: { type: String },
    firstName: {type: String},
    otp: { type: String },
    otpExpire: { type: Date },
    
    // Thông tin JLPT
    jlptLevel: { 
        type: String, 
        enum: ['N5', 'N4', 'N3', 'N2', 'N1', 'none'],
        default: 'none'
    },
    targetLevel: { 
        type: String, 
        enum: ['N5', 'N4', 'N3', 'N2', 'N1'],
        default: 'N5'
    },
    
    // Tiến độ học tập
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    completedLessons: [{type: Schema.Types.ObjectId, ref: 'Lesson'}],
    completedTests: [{type: Schema.Types.ObjectId, ref: 'Test'}],
    
    // Bài thi đã làm
    testAttempts: [{
        testId: { type: Schema.Types.ObjectId, ref: 'Test' },
        score: { type: Number },
        maxScore: { type: Number },
        timeSpent: { type: Number }, // Thời gian làm bài (phút)
        completedAt: { type: Date, default: Date.now },
        answers: [{
            questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
            selectedOption: { type: Number }, // Index của option được chọn
            isCorrect: { type: Boolean },
            timeSpent: { type: Number } // Thời gian làm câu hỏi (giây)
        }]
    }],
    
    // Thống kê JLPT
    jlptStats: {
        totalTestsTaken: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        weakestSection: { 
            type: String, 
            enum: ['moji-goi', 'bunpou', 'dokkai', 'choukai', 'none'],
            default: 'none'
        },
        strongestSection: { 
            type: String, 
            enum: ['moji-goi', 'bunpou', 'dokkai', 'choukai', 'none'],
            default: 'none'
        },
        sectionScores: {
            'moji-goi': { type: Number, default: 0 },
            'bunpou': { type: Number, default: 0 },
            'dokkai': { type: Number, default: 0 },
            'choukai': { type: Number, default: 0 }
        }
    },
    
    // Câu hỏi và tài liệu đã lưu
    savedQuestions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
    savedVocabulary: [{type: Schema.Types.ObjectId, ref: 'Vocabulary'}],
    savedGrammar: [{type: Schema.Types.ObjectId, ref: 'Grammar'}],
    
    // Giỏ hàng
    cart: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    
    // Cài đặt học tập
    studySettings: {
        dailyGoal: { type: Number, default: 10 }, // Số câu hỏi mục tiêu mỗi ngày
        preferredTestTypes: [{ 
            type: String,
            enum: ['kanji-hiragana', 'hiragana-kanji', 'word-formation', 'context-grammar', 
                   'synonyms', 'usage', 'grammar-selection', 'sentence-combination', 
                   'text-grammar', 'short-reading', 'medium-reading', 'long-reading', 
                   'comparative-reading', 'information-search', 'task-based-listening', 
                   'point-understanding', 'verbal-expressions', 'quick-response', 
                   'comprehensive-listening', 'vocabulary', 'mixed']
        }],
        showHints: { type: Boolean, default: true },
        autoSave: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('Bạn chưa điền hết thông tin!');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email không hợp lệ!');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error('Email đã được sử dụng');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        email,
        password: hash,
    });

    return user;
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Bạn chưa điền hết thông tin!');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Email không đúng!');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Mật khẩu không đúng');
    }

    return user;
};

// Method để cập nhật thống kê JLPT sau khi làm bài thi
userSchema.methods.updateJLPTStats = async function(testAttempt) {
    const { score, maxScore, answers } = testAttempt;
    
    // Cập nhật thống kê tổng quan
    this.jlptStats.totalTestsTaken += 1;
    
    // Tính điểm trung bình
    const totalScore = this.jlptStats.averageScore * (this.jlptStats.totalTestsTaken - 1) + score;
    this.jlptStats.averageScore = totalScore / this.jlptStats.totalTestsTaken;
    
    // Cập nhật điểm cao nhất
    if (score > this.jlptStats.bestScore) {
        this.jlptStats.bestScore = score;
    }
    
    // Tính điểm theo section
    const sectionScores = {
        'moji-goi': { correct: 0, total: 0 },
        'bunpou': { correct: 0, total: 0 },
        'dokkai': { correct: 0, total: 0 },
        'choukai': { correct: 0, total: 0 }
    };
    
    // Phân tích câu trả lời theo section
    for (const answer of answers) {
        const question = await mongoose.model('Question').findById(answer.questionId);
        if (question && sectionScores[question.section]) {
            sectionScores[question.section].total += 1;
            if (answer.isCorrect) {
                sectionScores[question.section].correct += 1;
            }
        }
    }
    
    // Cập nhật điểm section
    for (const [section, stats] of Object.entries(sectionScores)) {
        if (stats.total > 0) {
            const sectionScore = (stats.correct / stats.total) * 100;
            this.jlptStats.sectionScores[section] = sectionScore;
        }
    }
    
    // Xác định section mạnh nhất và yếu nhất
    const sectionEntries = Object.entries(this.jlptStats.sectionScores);
    if (sectionEntries.length > 0) {
        const sortedSections = sectionEntries.sort((a, b) => b[1] - a[1]);
        this.jlptStats.strongestSection = sortedSections[0][0];
        this.jlptStats.weakestSection = sortedSections[sortedSections.length - 1][0];
    }
    
    return this.save();
};

// Method để thêm bài thi đã làm
userSchema.methods.addTestAttempt = async function(testAttempt) {
    this.testAttempts.push(testAttempt);
    await this.updateJLPTStats(testAttempt);
    return this.save();
};

// Method để lấy thống kê JLPT
userSchema.methods.getJLPTStats = function() {
    return {
        level: this.jlptLevel,
        targetLevel: this.targetLevel,
        stats: this.jlptStats,
        recentAttempts: this.testAttempts.slice(-5) // 5 bài thi gần nhất
    };
};

// Method để lấy tiến độ học tập
userSchema.methods.getStudyProgress = function() {
    return {
        completedLessons: this.completedLessons.length,
        completedTests: this.completedTests.length,
        totalTestsTaken: this.jlptStats.totalTestsTaken,
        averageScore: this.jlptStats.averageScore,
        dailyGoal: this.studySettings.dailyGoal
    };
};

// Method để cập nhật cài đặt học tập
userSchema.methods.updateStudySettings = function(settings) {
    this.studySettings = { ...this.studySettings, ...settings };
    return this.save();
};

// Method để lưu câu hỏi
userSchema.methods.saveQuestion = async function(questionId) {
    if (!this.savedQuestions.includes(questionId)) {
        this.savedQuestions.push(questionId);
        return this.save();
    }
    return this;
};

// Method để bỏ lưu câu hỏi
userSchema.methods.unsaveQuestion = async function(questionId) {
    this.savedQuestions = this.savedQuestions.filter(id => id.toString() !== questionId.toString());
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
