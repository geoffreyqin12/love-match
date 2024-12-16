import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 扩展 Request 类型以包含用户ID
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 从请求头获取 token
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      res.status(401).json({ message: '未登录' })
      return
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: '认证失败' })
  }
}