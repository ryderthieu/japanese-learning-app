const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Course = require('../models/course')
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '5d'})
}

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id)

        res.status(200).json({email, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}


const signup = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)
        res.status(200).json({message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const sendOtpEmail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã OTP Xác Nhận Đặt Lại Mật Khẩu',
        text: `Mã OTP của bạn để đặt lại mật khẩu là: ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('OTP sent:', info.response);
        }
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại!');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = Date.now() + 3600000;
        await user.save();

        sendOtpEmail(email, otp);

        res.status(200).json({ message: 'Mã OTP đã được gửi tới email của bạn!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ otp });

        if (!user) {
            throw new Error('OTP không hợp lệ!');
        }

        if (user.otpExpire < Date.now()) {
            throw new Error('Mã OTP đã hết hạn!');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = undefined; 
        user.otpExpire = undefined; 
        await user.save();

        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const enrollCourse = async (req, res) => {
    try {
        const {courseId} = req.body;
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Khóa học không hợp lệ" });
        }
        const course = await Course.findById(courseId)
        if (!course)
            return res.status(400).json({message: "Khóa học không tồn tại"})
        if (user.courses.includes(courseId))
            return res.status(400).json({message: "Người dùng đã đăng ký khóa học này"})

        user.courses.push(courseId)
        await user.save()

        res.status(200).json({message: 'Đăng ký thành công', courses: user.courses})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
module.exports = {login, signup, forgotPassword, resetPassword, enrollCourse}