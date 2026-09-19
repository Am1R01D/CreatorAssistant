
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import aiRouter from './routes/ai';

const app = express()
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use('/api/ai', aiRouter)

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'creator-analyzer-api',
    timestamp: new Date().toISOString(),
  })
})

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (response.headersSent) {
    next(error)
    return
  }

  response.status(500).json({ error: 'Server error' })
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

export default app

