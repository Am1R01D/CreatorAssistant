import { Router } from 'express'
import { generateGeminiReply } from '../services/geminiService.js'

const router = Router()

router.post('/chat', async (request, response) => {
  const { message, history, context } = request.body as {
    message?: unknown
    history?: unknown
    context?: unknown
  }

  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    response.status(400).json({ error: 'Message must be between 1 and 2000 characters' })
    return
  }

  const validHistory = Array.isArray(history)
    ? history.filter(
        (item): item is { role: 'user' | 'model'; parts: Array<{ text: string }> } =>
          typeof item === 'object' &&
          item !== null &&
          'role' in item &&
          (item.role === 'user' || item.role === 'model') &&
          'parts' in item &&
          Array.isArray(item.parts),
      )
    : []

  try {
    const messages = [...validHistory, { role: 'user' as const, parts: [{ text: message.trim() }] }].slice(-12)
    const reply = await generateGeminiReply(
      messages,
      typeof context === 'object' && context !== null ? context as Record<string, unknown> : undefined,
    )
    response.json({ reply })
  } catch (error) {
    const isConfigurationError = error instanceof Error && error.message === 'GEMINI_API_KEY is not configured'
    response.status(isConfigurationError ? 503 : 502).json({
      error: isConfigurationError ? 'AI service is not configured yet' : 'AI service is temporarily unavailable',
    })
  }
})

export default router
