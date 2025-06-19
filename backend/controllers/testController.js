const Test = require('../models/test');
const Question = require('../models/question');
const User = require('../models/user');
const { createTestTemplate, getSectionInfo, getSubSectionInfo } = require('../utils/testTemplates');

// Lấy tất cả bài thi với filter
const getTests = async (req, res) => {
    try {
        const { 
            level: queryLevel, 
            category, 
            isPublic, 
            isActive, 
            createdBy,
            page = 1, 
            limit = 10,
            search 
        } = req.query;

        // Lấy level từ params nếu có (route /level/:level), nếu không thì từ query
        const level = req.params.level || queryLevel;

        const filter = {};
        
        if (level) filter.level = level;
        if (category) filter.category = category;
        if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (createdBy) filter.createdBy = createdBy;
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        
        const tests = await Test.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Test.countDocuments(filter);
        
        res.status(200).json({
            tests,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy bài thi theo ID
const getTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('sections.questions.questionId');
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }
        
        res.status(200).json(test);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Tạo bài thi mới
const createTest = async (req, res) => {
    try {
        const {
            title,
            description,
            level,
            sections,
            totalTime,
            passingScore,
            maxScore,
            isPublic,
            category,
            showAnswers,
            showExplanation,
            allowReview,
            availableFrom,
            availableTo,
            tags
        } = req.body;

        // Validate required fields
        if (!title || !level || !totalTime || !passingScore || !maxScore) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }

        // Validate sections
        if (!sections || !Array.isArray(sections) || sections.length === 0) {
            return res.status(400).json({ error: 'Phải có ít nhất 1 section' });
        }

        const test = await Test.create({
            title,
            description,
            level,
            sections,
            totalTime,
            passingScore,
            maxScore,
            isPublic: isPublic || false,
            category: category || 'custom',
            showAnswers: showAnswers !== undefined ? showAnswers : true,
            showExplanation: showExplanation !== undefined ? showExplanation : true,
            allowReview: allowReview !== undefined ? allowReview : true,
            availableFrom,
            availableTo,
            tags,
            createdBy: req.user._id
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Tạo bài thi từ template
const createTestFromTemplate = async (req, res) => {
    try {
        const { level, title, description, category = 'mock' } = req.body;

        if (!level) {
            return res.status(400).json({ error: 'Thiếu level' });
        }

        const template = createTestTemplate(level);
        
        const test = await Test.create({
            ...template,
            title: title || template.title,
            description: description || template.description,
            category,
            createdBy: req.user._id
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cập nhật bài thi
const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const test = await Test.findById(id);
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        // Kiểm tra quyền sửa (chỉ người tạo mới được sửa)
        if (test.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Không có quyền sửa bài thi này' });
        }

        const updatedTest = await Test.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Xóa bài thi
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const test = await Test.findById(id);
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        // Kiểm tra quyền xóa
        if (test.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Không có quyền xóa bài thi này' });
        }

        await Test.findByIdAndDelete(id);

        res.status(200).json({ message: 'Đã xóa bài thi thành công' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Thêm câu hỏi vào bài thi
const addQuestionToTest = async (req, res) => {
    try {
        const { testId, sectionName, questionId, order, points = 1 } = req.body;

        const test = await Test.findById(testId);
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        // Kiểm tra quyền
        if (test.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Không có quyền sửa bài thi này' });
        }

        // Kiểm tra câu hỏi tồn tại
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
        }

        await test.addQuestionToSection(sectionName, questionId, order, points);

        res.status(200).json({ message: 'Đã thêm câu hỏi thành công' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy câu hỏi cho bài thi
const getTestQuestions = async (req, res) => {
    try {
        const { testId, sectionName } = req.params;

        const test = await Test.findById(testId);
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        let questions = [];
        
        if (sectionName) {
            // Lấy câu hỏi theo section
            const sectionQuestions = test.getQuestionsBySection(sectionName);
            const questionIds = sectionQuestions.map(q => q.questionId);
            questions = await Question.find({ _id: { $in: questionIds } });
        } else {
            // Lấy tất cả câu hỏi
            const allQuestionIds = test.sections.flatMap(section => 
                section.questions.map(q => q.questionId)
            );
            questions = await Question.find({ _id: { $in: allQuestionIds } });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Bắt đầu làm bài thi
const startTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const userId = req.user._id;

        const test = await Test.findById(testId)
            .populate('sections.questions.questionId');
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        if (!test.isAvailable()) {
            return res.status(400).json({ error: 'Bài thi không khả dụng' });
        }

        // Tăng số lần thử
        test.attemptCount += 1;
        await test.save();

        // Trả về thông tin bài thi (không bao gồm đáp án)
        const testData = {
            _id: test._id,
            title: test.title,
            description: test.description,
            level: test.level,
            totalTime: test.totalTime,
            totalQuestions: test.totalQuestions,
            sections: test.sections.map(section => ({
                name: section.name,
                title: section.title,
                description: section.description,
                timeLimit: section.timeLimit,
                questions: section.questions.map(q => ({
                    _id: q.questionId._id,
                    questionText: q.questionId.questionText,
                    options: q.questionId.options.map(option => ({
                        text: option.text
                        // Không trả về isCorrect
                    })),
                    type: q.questionId.type,
                    section: q.questionId.section,
                    subSection: q.questionId.subSection,
                    timeLimit: q.questionId.timeLimit,
                    audioFile: q.questionId.audioFile,
                    readingPassage: q.questionId.readingPassage,
                    imageFile: q.questionId.imageFile,
                    order: q.order,
                    points: q.points
                }))
            }))
        };

        res.status(200).json(testData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Nộp bài thi
const submitTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { answers, timeSpent } = req.body;
        
        console.log('Submit test request:', {
            testId,
            answersCount: answers?.length,
            timeSpent,
            userId: req.user?._id
        });

        // Kiểm tra user authentication
        if (!req.user) {
            return res.status(401).json({ error: 'Người dùng chưa được xác thực' });
        }
        
        const userId = req.user._id;

        const test = await Test.findById(testId)
            .populate('sections.questions.questionId');
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        console.log('Test found:', { id: test._id, title: test.title });

        // Tính điểm
        let totalScore = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;

        const processedAnswers = [];

        for (const answer of answers) {
            const question = await Question.findById(answer.questionId);
            if (!question) {
                console.log('Question not found:', answer.questionId);
                continue;
            }

            totalQuestions++;
            const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
            
            if (isCorrect) {
                correctAnswers++;
                // Tìm điểm của câu hỏi này trong test
                const testQuestion = test.sections
                    .flatMap(s => s.questions)
                    .find(q => q.questionId._id.toString() === answer.questionId);
                
                totalScore += testQuestion?.points || 1;
            }

            processedAnswers.push({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect,
                timeSpent: answer.timeSpent || 0
            });
        }

        console.log('Score calculation:', { 
            totalScore,
            correctAnswers,
            totalQuestions
        });

        const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const passed = totalScore >= test.passingScore;

        // Tạo test attempt
        const testAttempt = {
            testId: test._id,
            score: totalScore,
            maxScore: test.maxScore,
            timeSpent,
            completedAt: new Date(),
            answers: processedAnswers
        };

        // Cập nhật thống kê user
        try {
            const user = await User.findById(userId);
            if (user && user.addTestAttempt) {
                await user.addTestAttempt(testAttempt);
            } else {
                console.log('User not found or addTestAttempt method missing');
            }
        } catch (userError) {
            console.error('Error updating user stats:', userError);
            // Continue with test update even if user update fails
        }

        // Cập nhật thống kê test
        try {
            test.attemptCount = (test.attemptCount || 0) + 1;
            const newAverageScore = test.attemptCount === 1 
                ? totalScore 
                : ((test.averageScore || 0) * (test.attemptCount - 1) + totalScore) / test.attemptCount;
            test.averageScore = newAverageScore;
            
            console.log('Test before save:', {
                id: test._id,
                attemptCount: test.attemptCount,
                averageScore: test.averageScore
            });
            
            await test.save();
            console.log('Test saved successfully');
        } catch (saveError) {
            console.error('Error saving test:', saveError);
            // Don't fail the request if test stats update fails
        }

        const result = {
            testId: test._id,
            score: totalScore,
            maxScore: test.maxScore,
            correctAnswers,
            totalQuestions,
            scorePercentage,
            passed,
            timeSpent,
            completedAt: testAttempt.completedAt
        };

        // Trả về đáp án nếu được phép
        if (test.showAnswers) {
            const answersWithQuestions = await Promise.all(
                processedAnswers.map(async (answer) => ({
                    ...answer,
                    question: await Question.findById(answer.questionId).select('questionText options explanation correctAnswer')
                }))
            );
            result.answers = answersWithQuestions;
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy thống kê bài thi
const getTestStats = async (req, res) => {
    try {
        const { testId } = req.params;

        const test = await Test.findById(testId);
        
        if (!test) {
            return res.status(404).json({ error: 'Bài thi không tồn tại' });
        }

        const stats = {
            attemptCount: test.attemptCount,
            averageScore: test.averageScore,
            passingScore: test.passingScore,
            maxScore: test.maxScore,
            totalQuestions: test.totalQuestions,
            totalTime: test.totalTime
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTests,
    getTest,
    createTest,
    createTestFromTemplate,
    updateTest,
    deleteTest,
    addQuestionToTest,
    getTestQuestions,
    startTest,
    submitTest,
    getTestStats
}; 