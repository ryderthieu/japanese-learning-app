const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')


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


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userID)
    } catch {
        
    }
}
module.exports = {login, signup}