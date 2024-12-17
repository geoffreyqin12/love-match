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
const port = process.env.PORT || 3001

// 中间件
app.use(cors({
  origin: 'https://geoffreyqin12.github.io',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/love-match'
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// 路由
app.use('/api/share', shareRoutes)
app.use('/api/user', userRoutes)
app.use('/api/protected', authMiddleware, protectedRoutes)
app.use('/api/history', authMiddleware, historyRoutes)

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Vercel 处理
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

export default app 
