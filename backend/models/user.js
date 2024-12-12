const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator')
// Định nghĩa schema người dùng
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error ('Bạn chưa điền hết thông tin!')
    }
    
    if (!validator.isEmail(email)) {
        throw Error ('Email không hợp lệ!')
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
        throw Error ('Bạn chưa điền hết thông tin!')
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

// Xuất model
module.exports = mongoose.model('User', userSchema);
