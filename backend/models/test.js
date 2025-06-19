const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      enum: ["N5", "N4", "N3", "N2", "N1"],
    },

    // Cấu trúc bài thi theo JLPT
    sections: [
      {
        name: {
          type: String,
          required: true,
          enum: ["moji-goi", "bunpou", "dokkai", "choukai"],
        },
        title: {
          type: String,
          required: true,
        }, // Tiêu đề hiển thị
        description: {
          type: String,
        },
        timeLimit: {
          type: Number,
        }, // Thời gian làm bài (phút)
        questions: [
          {
            questionId: {
              type: Schema.Types.ObjectId,
              ref: "Question",
              required: true,
            },
            order: {
              type: Number,
              required: true,
            }, // Thứ tự câu hỏi trong section
            points: {
              type: Number,
              default: 1,
            }, // Điểm cho câu hỏi này
          },
        ],
        subSections: [
          {
            name: {
              type: String,
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
            },
            questionTypes: [
              {
                type: String,
              },
            ], // Các loại câu hỏi trong subsection này
            questionCount: {
              type: Number,
              default: 0,
            }, // Số câu hỏi trong subsection
          },
        ],
      },
    ],

    // Cài đặt chung
    totalTime: {
      type: Number,
      required: true,
    }, // Tổng thời gian làm bài (phút)
    totalQuestions: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      required: true,
    }, // Điểm đậu
    maxScore: {
      type: Number,
      required: true,
    }, // Điểm tối đa

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Thông tin tác giả
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },

    // Thống kê
    attemptCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },

    // Tags và categories
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["practice", "mock", "official", "custom"],
    },

    // Cài đặt hiển thị
    showAnswers: {
      type: Boolean,
      default: true,
    }, // Có hiển thị đáp án sau khi làm bài không
    showExplanation: {
      type: Boolean,
      default: true,
    }, // Có hiển thị giải thích không
    allowReview: {
      type: Boolean,
      default: true,
    }, // Có cho phép xem lại bài làm không
    
    // Cài đặt thời gian
    availableFrom: { 
      type: Date 
    }, // Thời gian bắt đầu có thể làm bài
    availableTo: { 
      type: Date 
    }, // Thời gian kết thúc có thể làm bài
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
testSchema.index({ level: 1, isActive: 1 });
testSchema.index({ createdBy: 1 });
testSchema.index({ category: 1, isPublic: 1 });

// Virtual để tính tổng số câu hỏi
testSchema.virtual("questionCount").get(function () {
  return this.sections.reduce((total, section) => {
    return total + section.questions.length;
  }, 0);
});

// Pre-save middleware để cập nhật totalQuestions
testSchema.pre("save", function (next) {
  this.totalQuestions = this.questionCount;
  next();
});

// Method để thêm câu hỏi vào section
testSchema.methods.addQuestionToSection = function (
  sectionName,
  questionId,
  order,
  points = 1
) {
  const section = this.sections.find((s) => s.name === sectionName);
  if (!section) {
    throw new Error(`Section ${sectionName} not found`);
  }

  section.questions.push({
    questionId,
    order,
    points,
  });

  // Sắp xếp lại theo thứ tự
  section.questions.sort((a, b) => a.order - b.order);

  return this.save();
};

// Method để lấy câu hỏi theo section
testSchema.methods.getQuestionsBySection = function (sectionName) {
  const section = this.sections.find((s) => s.name === sectionName);
  return section ? section.questions : [];
};

// Method để kiểm tra xem test có thể làm được không
testSchema.methods.isAvailable = function () {
  const now = new Date();

  if (!this.isActive) return false;

  if (this.availableFrom && now < this.availableFrom) return false;

  if (this.availableTo && now > this.availableTo) return false;

  return true;
};

module.exports = mongoose.model("Test", testSchema);
