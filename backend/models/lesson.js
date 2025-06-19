const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: { type: String, required: true },
  videoId: { type: String, required: true },
  vocabulary: [{type: Schema.Types.ObjectId, ref: "Vocabulary"}],
  grammar: [{type: Schema.Types.ObjectId, ref: "Grammar"}],
  isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Lesson", lessonSchema);
