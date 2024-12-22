const mongoose = require('mongoose');
const Vocabulary = require('../models/vocabulary');


const searchVocabulary = async (req, res) => {
  try {
    const { query } = req.query;  

    if (!query) {
      return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm.' });
    }

    const results = await Vocabulary.find({
      $or: [
        { word: { $regex: query, $options: 'i' } }, 
        { kanji: { $regex: query, $options: 'i' } },
        { romanji: { $regex: query, $options: 'i' } },
        { meaning: { $regex: query, $options: 'i' } } 
      ]
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả nào.' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra trong quá trình tìm kiếm.' });
  }
};
const saveVocabulary = async (req, res) => {
  try {
    const {vocabularyId} = req.params
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    if (!user.savedVocabulary.includes(vocabularyId))
      user.savedVocabulary.push(vocabularyId);
    else
      user.savedVocabulary = user.savedVocabulary.filter((v) => v!==vocabularyId)

    await user.save()
    res.status(200).json({ message: "Thay đổi trạng thái từ vựng thành công" });
  } catch {
    res.status(400).json({ message: "Lỗi khi lưu từ vựng." });
  }
}
module.exports = { searchVocabulary, saveVocabulary };

