import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { shareRoutes } from './routes/share'
import { userRoutes } from './routes/user'
import { protectedRoutes } from './routes/protected'
import { authMiddleware } from './middleware/auth'
import { historyRoutes } from './routes/history'

dotenv.config()

const app = express()

// 中间件
app.use(cors({
  origin: 'https://geoffreyqin12.github.io',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// 健康检查端点
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: dbStatus,
      mongodbUri: process.env.MONGODB_URI ? 'configured' : 'not configured'
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/love-match'
console.log('Connecting to MongoDB...')
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 秒超时
  socketTimeoutMS: 45000, // 45 秒超时
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    console.error('MongoDB URI:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://[username]:[password]@'))
  })

// 路由
app.use('/api/share', shareRoutes)
app.use('/api/user', userRoutes)
app.use('/api/protected', authMiddleware, protectedRoutes)
app.use('/api/history', authMiddleware, historyRoutes)

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  console.error('Stack:', err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 处理404错误
app.use((req: express.Request, res: express.Response) => {
  console.log('404 Not Found:', req.method, req.url)
  res.status(404).json({ message: 'Route not found' })
})

export default app 
