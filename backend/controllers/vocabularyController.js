const mongoose = require('mongoose');
const Vocabulary = require('../models/vocabulary');

const getMeaningByVocabulary = async (req, res) => {
    const { slug } = req.params;
    try {
        const words = await Vocabulary.find({
            $or: [{ vocabulary: slug }, { kanji: slug }] 
        });

        if (words.length === 0) {
            return res.status(404).json({ message: "No vocabulary found." });
        }

        res.json(words); 

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}

const getVocabularyByLesson = async (req, res) => {
    const { slug } = req.params;
    try {
        const words = await Vocabulary.find({ lesson: slug });

        if (words.length === 0) {
            return res.status(404).json({ message: "No vocabulary found." });
        }

        res.json(words); 

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}
module.exports = { getMeaningByVocabulary, getVocabularyByLesson }
