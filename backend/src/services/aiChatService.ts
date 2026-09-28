import { generateGeminiReply } from './geminiService'

type GeminiMessage = {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

type ChatBody = {
  message?: unknown
  history?: unknown
  context?: unknown
}

type ChatResult = {
  status: number
  body: { reply?: string; error?: string; retryAfter?: number }
}

type RateLimitEntry = { count: number; resetAt: number }

const rateLimitStore = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12

function normalizeSupabaseUrl(value: string) {
  return value.replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
}

function getBearerToken(authorization?: string) {
  const match = authorization?.match(/^Bearer\s+(.+)$/i)
  return match?.[1]
}

async function verifySupabaseUser(authorization?: string) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_AUTH_NOT_CONFIGURED')
  }

  const token = getBearerToken(authorization)
  if (!token) {
    throw new Error('AUTH_REQUIRED')
  }

  const response = await fetch(`${normalizeSupabaseUrl(supabaseUrl)}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('INVALID_SESSION')
  }
}

function checkRateLimit(identifier: string) {
  const now = Date.now()
  const current = rateLimitStore.get(identifier)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return 0
  }

  current.count += 1
  if (current.count <= RATE_LIMIT_MAX_REQUESTS) return 0
  return Math.max(1, Math.ceil((current.resetAt - now) / 1000))
}

function parseHistory(history: unknown): GeminiMessage[] {
  if (!Array.isArray(history)) return []

  return history.flatMap((item): GeminiMessage[] => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('role' in item) ||
      (item.role !== 'user' && item.role !== 'model') ||
      !('parts' in item) ||
      !Array.isArray(item.parts)
    ) return []

    const parts = item.parts as unknown[]
    const text = parts
      .filter((part: unknown): part is { text: string } =>
        typeof part === 'object' && part !== null && 'text' in part && typeof part.text === 'string',
      )
      .map((part) => ({ text: part.text.slice(0, 2_000) }))

    return text.length ? [{ role: item.role, parts: text }] : []
  })
}

export async function handleAiChat(
  body: ChatBody,
  authorization: string | undefined,
  identifier: string,
): Promise<ChatResult> {
  if (typeof body.message !== 'string' || body.message.trim().length === 0 || body.message.length > 2_000) {
    return { status: 400, body: { error: 'Message must be between 1 and 2000 characters' } }
  }

  const retryAfter = checkRateLimit(identifier)
  if (retryAfter) {
    return { status: 429, body: { error: 'Too many messages. Please wait a moment and try again.', retryAfter } }
  }

  try {
    await verifySupabaseUser(authorization)
  } catch (error) {
    const code = error instanceof Error ? error.message : ''
    if (code === 'AUTH_REQUIRED' || code === 'INVALID_SESSION') {
      return { status: 401, body: { error: 'Sign in to use Creator AI.' } }
    }
    if (code === 'SUPABASE_AUTH_NOT_CONFIGURED') {
      return { status: 503, body: { error: 'AI authentication is not configured yet.' } }
    }
    return { status: 502, body: { error: 'Authentication service is temporarily unavailable.' } }
  }

  const history = parseHistory(body.history)
  const messages = [...history, {
    role: 'user' as const,
    parts: [{ text: body.message.trim() }],
  }].slice(-12)

  try {
    const reply = await generateGeminiReply(
      messages,
      typeof body.context === 'object' && body.context !== null
        ? body.context as Record<string, unknown>
        : undefined,
    )
    return { status: 200, body: { reply } }
  } catch (error) {
    console.error('Creator AI request failed', error)
    const isConfigurationError = error instanceof Error && error.message === 'GEMINI_API_KEY is not configured'
    return {
      status: isConfigurationError ? 503 : 502,
      body: { error: isConfigurationError ? 'AI service is not configured yet.' : 'AI service is temporarily unavailable.' },
    }
  }
}
