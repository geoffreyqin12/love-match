import mongoose from 'mongoose'

const shareSchema = new mongoose.Schema({
  shareId: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    score: Number,
    scoreText: String,
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
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7天后自动删除
  }
})

export const Share = mongoose.model('Share', shareSchema) 
