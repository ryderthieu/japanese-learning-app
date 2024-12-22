const mongoose = require('mongoose');
const Grammar = require('../models/grammar')

const saveGrammar = async (req, res) => {
  try {
    const {grammarId} = req.params
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    if (!user.savedGrammar.includes(grammarId))
      user.savedGrammar.push(grammarId);
    else
      user.savedGrammar = user.savedGrammar.filter((v) => v!==grammarId)

    await user.save()
    res.status(200).json({ message: "Thay đổi trạng thái ngữ pháp thành công" });
  } catch {
    res.status(400).json({ message: "Lỗi khi lưu ngữ pháp." });
  }
}

module.exports = {saveGrammar}