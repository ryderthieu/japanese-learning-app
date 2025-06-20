const mongoose = require('mongoose');
const Grammar = require('../models/grammar')
const User = require('../models/user')
const saveGrammar = async (req, res) => {
  try {
    const {grammarId} = req.body
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    if (!user.savedGrammar.includes(grammarId))
      user.savedGrammar.push(grammarId);
    else
      user.savedGrammar = user.savedGrammar.filter((v) => v.toString() !== grammarId)

    await user.save()
    res.status(200).json({ message: "Thay đổi trạng thái ngữ pháp thành công" });
  } catch {
    res.status(400).json({ message: "Lỗi khi lưu ngữ pháp." });
  }
}

const getLessons = async (req, res) => {
    try {
        const { level, lessonNumber = 1 } = req.query; 
        const limit = 10;  
        const skip = (lessonNumber - 1) * limit;  

        const query = level ? { level } : {};  
        const grammars = await Grammar.find(query)
            .skip(skip)  
            .limit(limit);

        res.json(grammars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSavedGrammar = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('savedGrammar');
        const grammars = user.savedGrammar || []
        res.json(grammars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {saveGrammar, getLessons, getSavedGrammar}