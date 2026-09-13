import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'creator-analyzer-api',
    timestamp: new Date().toISOString(),
  })
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.listen(port, () => {
  console.log(`Creator Analyzer API listening on http://localhost:${port}`)
})
