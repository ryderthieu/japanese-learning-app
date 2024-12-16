const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: { type: String, required: true },
    videoId: { type: String, required: true },
    vocabulary: [
        {
            word: { type: String, required: true },
            kanji: { type: String },
            meaning: { type: String, required: true },
            example: [
                {
                    sentence: { type: String, required: true },
                    translation: { type: String, required: true }
                }
            ]
        }
    ],
    grammar: [
        {
            rule: { type: String, required: true },
            meaning: { type: String, required: true },
            example: [
                {
                    sentence: { type: String, required: true },
                    translation: { type: String, required: true }
                }
            ]
        }
    ],
    isCompleted: { type: Boolean, default: false },
});


module.exports = mongoose.model('Lesson', lessonSchema)