import { Router } from 'express'
import { handleAiChat } from '../services/aiChatService'

const router = Router()

router.post('/chat', async (request, response) => {
  const forwardedFor = request.headers['x-forwarded-for']
  const identifier = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || request.ip || 'unknown'
  const result = await handleAiChat(request.body ?? {}, request.headers.authorization, identifier)
  if (result.body.retryAfter) response.setHeader('Retry-After', String(result.body.retryAfter))
  response.status(result.status).json(result.body)
})

export default router
