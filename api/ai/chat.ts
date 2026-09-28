import { handleAiChat } from '../../backend/src/services/aiChatService'

type ApiRequest = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}

type ApiResponse = {
  status: (status: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const authorization = request.headers.authorization
  const forwardedFor = request.headers['x-forwarded-for']
  const identifier = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || request.socket?.remoteAddress || 'unknown'
  const result = await handleAiChat(
    typeof request.body === 'object' && request.body !== null ? request.body : {},
    Array.isArray(authorization) ? authorization[0] : authorization,
    identifier,
  )

  if (result.body.retryAfter) response.setHeader('Retry-After', String(result.body.retryAfter))
  response.status(result.status).json(result.body)
}
