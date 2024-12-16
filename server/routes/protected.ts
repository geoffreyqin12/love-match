import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/user-info', async (req: AuthRequest, res) => {
  try {
    // 这里可以使用 req.userId 获取当前登录用户的ID
    const userId = req.userId
    
    // 返回一些受保护的数据
    res.json({
      message: '这是受保护的数据',
      userId
    })
  } catch (error) {
    res.status(500).json({ message: '获取数据失败' })
  }
})

export const protectedRoutes = router 