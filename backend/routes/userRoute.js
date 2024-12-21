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
  cofirmOtp
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);
router.post("/cofirm-otp", cofirmOtp);
router.post("/reset-password", resetPassword);
router.post("/enroll", authenticateJWT, enrollCourse);
router.post("/add-to-cart", authenticateJWT, addToCart);
router.get("/get-cart", authenticateJWT, getCart);
router.post("/remove-from-cart", authenticateJWT, removeFromCart);
router.post("/add-courses", authenticateJWT, addCourses);
router.get("/get-user-courses", authenticateJWT, getUserCourses);
router.get("/get-course-lessons/:courseId", authenticateJWT, getCourseLessons)
router.post("/add-completed-lesson/:lessonId", authenticateJWT, addCompletedLesson)
module.exports = router;
