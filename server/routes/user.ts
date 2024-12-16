import { Router } from 'express'
import { Document } from 'mongoose'
import { User } from '../models/User'
import jwt from 'jsonwebtoken'

// 定义用户文档接口
interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 定义请求体接口
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

const router = Router()

// 注册路由
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body as RegisterRequest

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      res.status(400).json({ message: '用户名已存在' })
      return
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      res.status(400).json({ message: '邮箱已被注册' })
      return
    }

    // 创建新用户
    const user = new User({ username, password, email })
    await user.save()

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.status(201).json({ token, username: user.username })
  } catch (error) {
    res.status(500).json({ message: '注册失败，请重试' })
  }
})

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body as LoginRequest

    // 查找用户
    const user = await User.findOne({ username }) as UserDocument | null
    if (!user) {
      res.status(401).json({ message: '用户名或密码错误' })
      return
    }

    // 验证密码
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: '用户名或密码错误' })
      return
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // 确保返回的数据包含 token 和 username
    res.json({
      token,
      username: user.username,
      message: '登录成功'
    })
  } catch (error) {
    res.status(500).json({ message: '登录失败，请重试' })
  }
})

export const userRoutes = router 