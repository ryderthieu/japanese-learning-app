const express = require("express");
const {
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
  getInfo,
  // JLPT functions
  getJLPTStats,
  updateJLPTInfo,
  getStudyProgress,
  updateStudySettings,
  saveQuestionNew,
  unsaveQuestion,
  getTestHistory,
  getSectionStats
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);
router.post("/cofirm-otp", cofirmOtp);
router.post("/reset-password", resetPassword);

// Protected routes
router.use(authenticateJWT);

// User info
router.get("/", getInfo);

// Course management
router.post("/enroll", enrollCourse);
router.post("/add-to-cart", addToCart);
router.get("/get-cart", getCart);
router.post("/remove-from-cart", removeFromCart);
router.post("/add-courses", addCourses);
router.get("/get-user-courses", getUserCourses);
router.get("/get-course-lessons/:courseId", getCourseLessons);
router.post("/add-completed-lesson/:lessonId", addCompletedLesson);

// JLPT routes
router.get("/jlpt/stats", getJLPTStats);
router.put("/jlpt/info", updateJLPTInfo);
router.get("/jlpt/progress", getStudyProgress);
router.put("/jlpt/settings", updateStudySettings);
router.get("/jlpt/history", getTestHistory);
router.get("/jlpt/section-stats", getSectionStats);

// Question management
router.post("/save-question", saveQuestionNew);
router.delete("/unsave-question/:questionId", unsaveQuestion);

module.exports = router;
