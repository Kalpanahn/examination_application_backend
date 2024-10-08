const mongoose = require("mongoose");
const userAnswerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  accuracy: {
    type: Number,
  },
  responses: [
    {
      question: String,
      answer: String,
      correctAnswer: String,
    },
  ],
  score: {
    type: Number,
  },
  displayResult: {
    type: String,
    default: "Not yet",
  },
  totalQuestions: {
    type: Number,
  },

  attendedQuestions: {
    type: Number,
  },
  wrongAnswers: {
    type: Number,
  },
});
module.exports = mongoose.model("UserAnswer", userAnswerSchema);
