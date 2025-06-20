const Question = require('../models/question');
const { getQuestionTypeInfo, getQuestionTypesBySection, getAllSections } = require('../utils/questionTypes');

// Lấy tất cả câu hỏi với filter
const getQuestions = async (req, res) => {
    try {
        const { 
            level, 
            type, 
            section, 
            subSection, 
            difficulty, 
            page = 1, 
            limit = 100,
            search 
        } = req.query;

        // Nếu có testId trong params, lấy câu hỏi từ test đó
        const testId = req.params.testId;

        const filter = {};
        
        if (testId) {
            // Nếu có testId, lấy câu hỏi từ test đó
            const Test = require('../models/test');
            const test = await Test.findById(testId);
            
            if (!test) {
                return res.status(404).json({ error: 'Bài thi không tồn tại' });
            }

            // Lấy tất cả questionId từ test
            const questionIds = test.sections.flatMap(section => 
                section.questions.map(q => q.questionId)
            );
            filter._id = { $in: questionIds };
        } else {
            // Filter thông thường
            if (level) {
                filter.level = level;
            }
            
            if (type) {
                filter.type = type;
            }
            
            if (section) {
                filter.section = section;
            }
            
            if (subSection) {
                filter.subSection = subSection;
            }
            
            if (difficulty) {
                filter.difficulty = parseInt(difficulty);
            }
            
            if (search) {
                filter.questionText = { $regex: search, $options: 'i' };
            }
        }

        const skip = (page - 1) * limit;
        
        const questions = await Question.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Question.countDocuments(filter);
        
        res.status(200).json({
            questions,
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

// Lấy câu hỏi theo ID
const getQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        
        if (!question) {
            return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
        }
        
        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Tạo câu hỏi mới
const createQuestion = async (req, res) => {
    try {
        const {
            questionText,
            options,
            level,
            type,
            section,
            subSection,
            difficulty,
            timeLimit,
            audioFile,
            readingPassage,
            imageFile,
            explanation,
            correctAnswer
        } = req.body;

        // Validate required fields
        if (!questionText || !options || !level || !type || !section) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }

        // Validate options
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: 'Phải có ít nhất 2 lựa chọn' });
        }

        // Validate có đúng 1 đáp án đúng
        const correctOptions = options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
            return res.status(400).json({ error: 'Phải có đúng 1 đáp án đúng' });
        }

        // Validate type và section khớp nhau
        const typeInfo = getQuestionTypeInfo(type);
        if (!typeInfo || typeInfo.section !== section) {
            return res.status(400).json({ error: 'Type và section không khớp' });
        }

        const question = await Question.create({
            questionText,
            options,
            level,
            type,
            section,
            subSection,
            difficulty: difficulty || 1,
            timeLimit,
            audioFile,
            readingPassage,
            imageFile,
            explanation,
            correctAnswer
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cập nhật câu hỏi
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate options nếu có cập nhật
        if (updateData.options) {
            if (!Array.isArray(updateData.options) || updateData.options.length < 2) {
                return res.status(400).json({ error: 'Phải có ít nhất 2 lựa chọn' });
            }

            const correctOptions = updateData.options.filter(option => option.isCorrect);
            if (correctOptions.length !== 1) {
                return res.status(400).json({ error: 'Phải có đúng 1 đáp án đúng' });
            }
        }

        // Validate type và section nếu có cập nhật
        if (updateData.type && updateData.section) {
            const typeInfo = getQuestionTypeInfo(updateData.type);
            if (!typeInfo || typeInfo.section !== updateData.section) {
                return res.status(400).json({ error: 'Type và section không khớp' });
            }
        }

        const question = await Question.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Xóa câu hỏi
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
        }

        res.status(200).json({ message: 'Đã xóa câu hỏi thành công' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy thông tin các loại câu hỏi
const getQuestionTypes = async (req, res) => {
    try {
        const { section } = req.query;
        
        if (section) {
            const types = getQuestionTypesBySection(section);
            res.status(200).json(types);
        } else {
            const sections = getAllSections();
            res.status(200).json(sections);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy câu hỏi ngẫu nhiên theo điều kiện
const getRandomQuestions = async (req, res) => {
    try {
        const { 
            level, 
            type, 
            section, 
            difficulty, 
            count = 10 
        } = req.query;

        const filter = {};
        
        if (level) filter.level = level;
        if (type) filter.type = type;
        if (section) filter.section = section;
        if (difficulty) filter.difficulty = parseInt(difficulty);

        const questions = await Question.aggregate([
            { $match: filter },
            { $sample: { size: parseInt(count) } }
        ]);

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy thống kê câu hỏi
const getQuestionStats = async (req, res) => {
    try {
        const stats = await Question.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    byLevel: {
                        $push: {
                            level: '$level',
                            count: 1
                        }
                    },
                    bySection: {
                        $push: {
                            section: '$section',
                            count: 1
                        }
                    },
                    byType: {
                        $push: {
                            type: '$type',
                            count: 1
                        }
                    },
                    byDifficulty: {
                        $push: {
                            difficulty: '$difficulty',
                            count: 1
                        }
                    }
                }
            }
        ]);

        // Xử lý dữ liệu thống kê
        const processedStats = {
            total: stats[0]?.total || 0,
            byLevel: {},
            bySection: {},
            byType: {},
            byDifficulty: {}
        };

        // Xử lý thống kê theo level
        if (stats[0]?.byLevel) {
            stats[0].byLevel.forEach(item => {
                processedStats.byLevel[item.level] = (processedStats.byLevel[item.level] || 0) + 1;
            });
        }

        // Xử lý thống kê theo section
        if (stats[0]?.bySection) {
            stats[0].bySection.forEach(item => {
                processedStats.bySection[item.section] = (processedStats.bySection[item.section] || 0) + 1;
            });
        }

        // Xử lý thống kê theo type
        if (stats[0]?.byType) {
            stats[0].byType.forEach(item => {
                processedStats.byType[item.type] = (processedStats.byType[item.type] || 0) + 1;
            });
        }

        // Xử lý thống kê theo difficulty
        if (stats[0]?.byDifficulty) {
            stats[0].byDifficulty.forEach(item => {
                processedStats.byDifficulty[item.difficulty] = (processedStats.byDifficulty[item.difficulty] || 0) + 1;
            });
        }

        res.status(200).json(processedStats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionTypes,
    getRandomQuestions,
    getQuestionStats
}; 