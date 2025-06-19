const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    gender: { 
        type: String, 
        enum: ['male', 'female'],
        default: 'male'
    },
    dateOfBirth: { type: Date },
    otp: { type: String },
    otpExpire: { type: Date },
    
    // Thông tin khảo sát ban đầu
    hasCompletedInitialSurvey: {
        type: Boolean,
        default: false
    },
    studyGoal: {
        type: String,
        enum: ['work', 'study', 'travel', 'hobby', 'exam', 'other'],
        default: 'hobby'
    },
    
    // Thông tin JLPT
    jlptLevel: { 
        type: String, 
        enum: ['Beginner', 'N5', 'N4', 'N3', 'N2', 'N1'],
        default: 'Beginner'
    },
    targetLevel: { 
        type: String, 
        enum: ['N5', 'N4', 'N3', 'N2', 'N1'],
        default: 'N5'
    },
    
    // Tiến độ học tập
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    completedLessons: [{type: Schema.Types.ObjectId, ref: 'Lesson'}],    
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
        studyDuration: {
            type: Number,
            default: 30,
            min: 5,
            max: 180
        },
        reminder: {
            enabled: {
                type: Boolean,
                default: true
            },
            time: {
                type: String,
                default: '08:00',
                validate: {
                    validator: function(v) {
                        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Thời gian nhắc nhở không hợp lệ (định dạng: HH:mm)'
                }
            }
        }
    }
}, {
    timestamps: true
});

userSchema.statics.signup = async function (email, password, fullName) {
    console.log(email)
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
        fullName
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

// Method để cập nhật mật khẩu
userSchema.methods.changePassword = async function(currentPassword, newPassword) {
    const match = await bcrypt.compare(currentPassword, this.password);
    
    if (!match) {
        throw new Error('Mật khẩu hiện tại không đúng');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    this.password = hash;
    return this.save();
};

// Method để cập nhật thông tin cá nhân
userSchema.methods.updateProfile = async function(data) {
    const allowedFields = ['fullName', 'gender', 'dateOfBirth', 'jlptLevel', 'targetLevel', 'studySettings', 'hasCompletedInitialSurvey', 'studyGoal'];
    
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            this[field] = data[field];
        }
    }
    
    return this.save();
};

// Method để cập nhật thống kê JLPT sau khi làm bài thi
userSchema.methods.updateJLPTStats = async function(testAttempt) {
    try {
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
        
        // Phân tích câu trả lời theo section - sử dụng Promise.all để tối ưu hiệu suất
        if (answers && answers.length > 0) {
            const questionIds = answers.map(answer => answer.questionId).filter(Boolean);
            
            if (questionIds.length > 0) {
                const questions = await mongoose.model('Question').find({ 
                    _id: { $in: questionIds } 
                }).select('_id section');
                
                const questionMap = new Map();
                questions.forEach(q => {
                    questionMap.set(q._id.toString(), q.section);
                });
                
                // Phân tích câu trả lời theo section
                for (const answer of answers) {
                    if (answer && answer.questionId) {
                        const section = questionMap.get(answer.questionId.toString());
                        if (section && sectionScores[section]) {
                            sectionScores[section].total += 1;
                            if (answer.isCorrect) {
                                sectionScores[section].correct += 1;
                            }
                        }
                    }
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
        
        console.log('JLPT Stats updated successfully for user:', this._id);
        return this.save();
    } catch (error) {
        console.error('Error updating JLPT stats:', error);
        // Vẫn trả về this.save() để không làm fail toàn bộ quá trình
        return this.save();
    }
};

// Method để thêm bài thi đã làm
userSchema.methods.addTestAttempt = async function(testAttempt) {
    this.testAttempts.push(testAttempt);
    await this.updateJLPTStats(testAttempt);
    return this.save();
};

// Method để lấy thống kê JLPT
userSchema.methods.getJLPTStats = async function() {
    // Populate thông tin chi tiết cho recent attempts
    await this.populate({
        path: 'testAttempts.testId',
        select: 'title level category'
    });
    
    // Lấy 5 bài thi gần nhất và sắp xếp theo thời gian giảm dần
    const recentAttempts = this.testAttempts
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5);
    
    return {
        level: this.jlptLevel,
        targetLevel: this.targetLevel,
        stats: this.jlptStats,
        recentAttempts: recentAttempts
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
