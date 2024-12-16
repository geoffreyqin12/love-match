import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { History } from '../models/History'
import mongoose from 'mongoose'

const router = Router()

// 保存历史记录
router.post('/', async (req: AuthRequest, res) => {
  try {
    const history = new History({
      userId: req.userId,
      ...req.body
    })
    await history.save()
    res.status(201).json(history)
  } catch (error) {
    res.status(500).json({ message: '保存失败' })
  }
})

// 获取历史记录
router.get('/', async (req: AuthRequest, res) => {
  try {
    const histories = await History.find({ userId: req.userId })
      .sort({ createdAt: -1 })
    res.json(histories)
  } catch (error) {
    res.status(500).json({ message: '获取历史记录失败' })
  }
})

// 获取统计数据
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const stats = await History.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(req.userId) 
        } 
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' },
          totalTests: { $sum: 1 }
        }
      }
    ])

    res.json(stats[0] || {
      avgScore: 0,
      maxScore: 0,
      minScore: 0,
      totalTests: 0
    })
  } catch (error) {
    res.status(500).json({ message: '获取统计数据失败' })
  }
})

export const historyRoutes = router 