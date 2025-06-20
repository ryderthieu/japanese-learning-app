const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Course = require("../models/course");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "5d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  console.log(email)
  try {
    const user = await User.signup(email, password, fullName);
    res.status(200).json({ 
      message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." 
    });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message });
  }
};

const sendOtpEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP Xác Nhận Đặt Lại Mật Khẩu",
    text: `Mã OTP của bạn để đặt lại mật khẩu là: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("OTP sent:", info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email không tồn tại!");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 3600000;
    await user.save();

    sendOtpEmail(email, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const cofirmOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }
    console.log(otp)

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Mã OTP không đúng!" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ error: "Mã OTP đã hết hạn!" });
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Xác nhận OTP thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
}
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(402).json({ message: "OTP đã hết hạn" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select('email fullName gender dateOfBirth jlptLevel targetLevel studySettings hasCompletedInitialSurvey studyGoal')
      .populate('savedVocabulary')
      .populate('savedGrammar');
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    await user.updateProfile(updateData);

    // Lấy lại thông tin đầy đủ sau khi cập nhật
    const updatedUser = await User.findById(userId)
      .select('email fullName gender dateOfBirth jlptLevel targetLevel studySettings hasCompletedInitialSurvey studyGoal')
      .populate('savedVocabulary')
      .populate('savedGrammar');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    await user.changePassword(currentPassword, newPassword);

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Khóa học không hợp lệ" });
    }
    const course = await Course.findById(courseId);

    if (!course)
      return res.status(400).json({ message: "Khóa học không tồn tại" });
    if (user.courses.includes(courseId))
      return res
        .status(400)
        .json({ message: "Người dùng đã đăng ký khóa học này" });

    user.courses.push(courseId);
    await user.save();

    res
      .status(200)
      .json({ message: "Đăng ký thành công", courses: user.courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Khóa học không hợp lệ" });
    }
    const course = await Course.findById(courseId);
    if (!course)
      return res.status(400).json({ message: "Khóa học không tồn tại" });

    if (user.cart.includes(courseId))
      return res.status(400).json({ message: "Khóa học đã có trong giỏ" });
    console.log("hello");

    user.cart.push(courseId);
    await user.save();
    res.status(200).json({ message: "Đã thêm vào giỏ hàng", cart: user.cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cart");
    if (!user)
      return res.status(400).json({ message: "Người dùng không tồn tại" });

    const courses = user.cart;
    res
      .status(200)
      .json({ message: "Lấy danh sách trong giỏ thành công", courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    let cart = user.cart;

    cart = cart.filter((item) => !courses.includes(item.toString()));

    user.cart = cart;
    await user.save();

    res
      .status(200)
      .json({ message: "Khóa học đã được xóa khỏi giỏ hàng", cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    console.log(courses);
    const alreadyRegisteredCourses = user.courses.filter((course) =>
      courses.includes(course.toString())
    );

    if (alreadyRegisteredCourses.length > 0) {
      return res.status(400).json({
        message: `Khóa học đã được đăng ký trước đó`,
      });
    }

    const newCourses = await Course.find({ _id: { $in: courses } });
    if (newCourses.length !== courses.length) {
      return res
        .status(404)
        .json({ message: "Một hoặc nhiều khóa học không tồn tại" });
    }

    user.courses.push(...courses);

    await user.save();

    return res
      .status(200)
      .json({ message: "Thêm khóa học thành công", courses: newCourses });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("courses");

    const coursesWithProgress = await Promise.all(
      user.courses.map(async (course) => {
        const courseDetails = await Course.findById(course._id);
        const totalLessons = courseDetails.lessons.length;
        const completedLessons = user.completedLessons.filter((lesson) =>
          courseDetails.lessons.some((l) => l.equals(lesson))
        ).length;

        const progress =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return {
          _id: courseDetails._id,
          title: courseDetails.title,
          level: courseDetails.level,
          thumbnail: courseDetails.thumbnail,
          progress: Math.round(progress),
        };
      })
    );

    res.status(200).json({ courses: coursesWithProgress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách khóa học." });
  }
};

const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId).populate("lessons")
    if (!course)
      return res.status(404).json({ message: "Khóa học không tồn tại." });

    const user = await User.findById(userId);

    const lessonsWithStatus = course.lessons.map((lesson) => {
      const isCompleted = user.completedLessons.some((completedLesson) =>
        completedLesson.equals(lesson._id)
      );
      return {
        ...lesson.toObject(),
        isCompleted: isCompleted,
      };
    });
    res.status(200).json({ lessons: lessonsWithStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài học." });
  }
};
const addCompletedLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    if (!user.completedLessons.includes(lessonId))
      user.completedLessons.push(lessonId);

    await user.save();
    res.status(200).json({ message: "Bài học đã được hoàn thành." });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const saveQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Câu hỏi không hợp lệ" });
    }

    if (user.savedQuestions.includes(questionId)) {
      return res.status(400).json({ message: "Câu hỏi đã được lưu" });
    }

    user.savedQuestions.push(questionId);
    await user.save();

    res.status(200).json({ message: "Đã lưu câu hỏi", savedQuestions: user.savedQuestions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// === JLPT Functions ===

// Lấy thống kê JLPT của user
const getJLPTStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const stats = await user.getJLPTStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật thông tin JLPT của user
const updateJLPTInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jlptLevel, targetLevel } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    if (jlptLevel) user.jlptLevel = jlptLevel;
    if (targetLevel) user.targetLevel = targetLevel;
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Cập nhật thông tin JLPT thành công',
      jlptLevel: user.jlptLevel,
      targetLevel: user.targetLevel
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tiến độ học tập
const getStudyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const progress = user.getStudyProgress();
    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tiến độ học tập chi tiết
const getDetailedStudyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const detailedProgress = user.getDetailedStudyProgress();
    res.status(200).json(detailedProgress);
  } catch (error) {
    console.error('Error getting detailed study progress:', error);
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật tiến độ học tập hàng ngày
const updateStudyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { additionalMinutes } = req.body;
    
    if (!additionalMinutes || additionalMinutes <= 0) {
      return res.status(400).json({ error: 'Thời gian học phải lớn hơn 0' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    await user.updateDailyStudyProgress(additionalMinutes);
    
    // Trả về tiến độ cập nhật
    const updatedProgress = user.getDetailedStudyProgress();
    
    res.status(200).json({
      message: 'Cập nhật tiến độ thành công',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating study progress:', error);
    res.status(400).json({ error: error.message });
  }
};

// Đồng bộ tiến độ từ frontend (cho trường hợp offline)
const syncStudyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { todayStudyTime, studyDate } = req.body;
    
    if (!todayStudyTime || todayStudyTime < 0) {
      return res.status(400).json({ error: 'Dữ liệu thời gian học không hợp lệ' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    // Kiểm tra ngày đồng bộ
    const today = new Date().toDateString();
    const syncDate = studyDate ? new Date(studyDate).toDateString() : today;
    
    if (syncDate !== today) {
      return res.status(400).json({ error: 'Chỉ có thể đồng bộ dữ liệu hôm nay' });
    }

    // Khởi tạo studyProgress nếu chưa có
    if (!user.studyProgress) {
      user.studyProgress = {
        totalStudyTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        todayStudyTime: 0,
        weeklyStats: { totalTime: 0, daysStudied: 0, goalsAchieved: 0 },
        monthlyStats: { totalTime: 0, daysStudied: 0, goalsAchieved: 0 },
        last30Days: []
      };
    }

    // Tính thời gian chênh lệch cần cập nhật
    const currentStudyTime = user.studyProgress.todayStudyTime || 0;
    const additionalTime = Math.max(0, todayStudyTime - currentStudyTime);
    
    if (additionalTime > 0) {
      await user.updateDailyStudyProgress(additionalTime);
    }
    
    const updatedProgress = user.getDetailedStudyProgress();
    
    res.status(200).json({
      message: 'Đồng bộ tiến độ thành công',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error syncing study progress:', error);
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật cài đặt học tập
const getStudySettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('studySettings');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user.studySettings);
  } catch (error) {
    console.error('Error in getStudySettings:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateStudySettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { studyDuration, reminder } = req.body;

    // Validate input
    if (!studyDuration || studyDuration < 5 || studyDuration > 180) {
      return res.status(400).json({ message: 'Thời gian học tập phải từ 5 đến 180 phút' });
    }
    if (reminder) {
      if (typeof reminder.enabled !== 'boolean') {
        return res.status(400).json({ message: 'Giá trị bật/tắt nhắc nhở không hợp lệ' });
      }
      if (reminder.enabled && reminder.time) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(reminder.time)) {
          return res.status(400).json({ message: 'Thời gian nhắc nhở không hợp lệ (định dạng: HH:mm)' });
        }
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.studySettings = {
      studyDuration,
      reminder: {
        enabled: reminder?.enabled ?? true,
        time: reminder?.time ?? '08:00'
      }
    };
    await user.save();

    res.json(user.studySettings);
  } catch (error) {
    console.error('Error in updateStudySettings:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lưu câu hỏi (cải tiến version cũ)
const saveQuestionNew = async (req, res) => {
  try {
    const { questionId } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Câu hỏi không hợp lệ' });
    }

    await user.saveQuestion(questionId);
    
    res.status(200).json({ 
      message: 'Đã lưu câu hỏi thành công',
      savedQuestions: user.savedQuestions
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bỏ lưu câu hỏi
const unsaveQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    await user.unsaveQuestion(questionId);
    
    res.status(200).json({ 
      message: 'Đã bỏ lưu câu hỏi thành công',
      savedQuestions: user.savedQuestions
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy lịch sử làm bài thi
const getTestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    
    const user = await User.findById(userId)
      .populate('testAttempts.testId', 'title level category')
      .populate('testAttempts.answers.questionId', 'questionText type section');
    
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const skip = (page - 1) * limit;
    const testAttempts = user.testAttempts
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(skip, skip + parseInt(limit));
    
    const total = user.testAttempts.length;
    
    res.status(200).json({
      testAttempts,
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

// Lấy thống kê chi tiết theo section
const getSectionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const sectionStats = {
      mojiGoi: {
        score: user.jlptStats.sectionScores['moji-goi'],
        name: '文字・語彙',
        description: 'Từ vựng và chữ viết'
      },
      bunpou: {
        score: user.jlptStats.sectionScores['bunpou'],
        name: '文法',
        description: 'Ngữ pháp'
      },
      dokkai: {
        score: user.jlptStats.sectionScores['dokkai'],
        name: '読解',
        description: 'Đọc hiểu'
      },
      choukai: {
        score: user.jlptStats.sectionScores['choukai'],
        name: '聴解',
        description: 'Nghe hiểu'
      }
    };

    res.status(200).json(sectionStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  login,
  signup,
  forgotPassword,
  cofirmOtp,
  resetPassword,
  getInfo,
  updateProfile,
  changePassword,
  enrollCourse,
  addToCart,
  getCart,
  removeFromCart,
  addCourses,
  getUserCourses,
  getCourseLessons,
  addCompletedLesson,
  saveQuestion,
  // JLPT functions
  getJLPTStats,
  updateJLPTInfo,
  getStudyProgress,
  getDetailedStudyProgress,
  updateStudyProgress,
  syncStudyProgress,
  getStudySettings,
  updateStudySettings,
  saveQuestionNew,
  unsaveQuestion,
  getTestHistory,
  getSectionStats
};
