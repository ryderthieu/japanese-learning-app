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
    res.status(400).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    res
      .status(200)
      .json({ message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." });
  } catch (error) {
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
    const userId = req.user._id
    const user = await User.findById(userId).populate('savedVocabulary').populate('savedGrammar')
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

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

    const course = await Course.findById(courseId).populate("lessons");
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
    const {questionId} = req.params
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    if (!user.savedQuestion.includes(questionId))
      user.savedQuestion.push(questionId);
    else
      user.savedQuestion = user.savedQuestion.filter((v) => v!==questionId)

    await user.save()
    res.status(200).json({ message: "Thay đổi trạng thái câu hỏi thành công" });
  } catch {
    res.status(400).json({ message: "Lỗi khi lưu câu hỏi." });
  }
}
module.exports = {
  login,
  signup,
  forgotPassword,
  resetPassword,
  enrollCourse,
  addToCart,
  getCart,
  removeFromCart,
  addCourses,
  getUserCourses,
  getCourseLessons,
  addCompletedLesson,
  cofirmOtp,
  saveQuestion,
  getInfo
};
