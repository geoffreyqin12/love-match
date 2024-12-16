import { Router, Request, Response } from 'express'
import { Share } from '../models/Share'

// 定义类型
type ShareData = {
  score: number;
  scoreText: string;
  male: {
    age: number;
    occupation: string;
    personality: string[];
    hobbies: string[];
    lifestyle: string[];
    values: {
      family: number;
      career: number;
    };
    plans: string[];
  };
  female: {
    age: number;
    occupation: string;
    personality: string[];
    hobbies: string[];
    lifestyle: string[];
    values: {
      family: number;
      career: number;
    };
    plans: string[];
  };
}

interface ShareRequestBody {
  shareId: string;
  data: ShareData;
}

interface ShareParams {
  shareId: string;
}

// 创建路由
const router = Router()

// 创建分享
router.post('/', async (
  req: Request<{}, any, ShareRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { shareId, data } = req.body
    const share = new Share({ shareId, data })
    await share.save()
    res.status(201).json({ shareId })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create share' })
  }
})

// 获取分享数据
router.get('/:shareId', async (
  req: Request<ShareParams>,
  res: Response
): Promise<void> => {
  try {
    const { shareId } = req.params
    const share = await Share.findOne({ shareId })
    if (!share) {
      res.status(404).json({ message: 'Share not found' })
      return
    }
    res.json(share.data)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get share' })
  }
})

export const shareRoutes = router
