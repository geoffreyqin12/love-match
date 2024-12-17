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
    const connectionState = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    }
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: dbStatus,
      detailedStatus: connectionState[mongoose.connection.readyState],
      mongodbUri: process.env.MONGODB_URI ? 'configured' : 'not configured',
      mongodbHost: process.env.MONGODB_URI ? new URL(process.env.MONGODB_URI).hostname : 'not available'
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/love-match'
console.log('Starting MongoDB connection...')
console.log('MongoDB host:', new URL(MONGODB_URI).hostname)

mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...')
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
}).catch(err => {
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
