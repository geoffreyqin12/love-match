import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  scoreText: {
    type: String,
    required: true
  },
  personalityAnalysis: {
    type: String,
    required: true
  },
  ageAnalysis: {
    type: String,
    required: true
  },
  careerAnalysis: {
    type: String,
    required: true
  },
  suggestions: [{
    type: String
  }],
  male: {
    age: Number,
    occupation: String,
    personality: [String],
    hobbies: [String],
    lifestyle: [String],
    values: {
      family: Number,
      career: Number
    },
    plans: [String]
  },
  female: {
    age: Number,
    occupation: String,
    personality: [String],
    hobbies: [String],
    lifestyle: [String],
    values: {
      family: Number,
      career: Number
    },
    plans: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const History = mongoose.model('History', historySchema) 