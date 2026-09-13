const defaultModel = 'gemini-3.6-flash'

type GeminiMessage = {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

export async function generateGeminiReply(
  messages: GeminiMessage[],
  context?: Record<string, unknown>,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = process.env.GEMINI_MODEL ?? defaultModel
  const contextText = context ? `\nCreator context: ${JSON.stringify(context)}` : ''
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `You are Creator AI, a concise assistant for YouTube creators. Never promise guaranteed views, CTR, revenue, or growth. Say when data is unavailable.${contextText}` }],
        },
        contents: messages,
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as GeminiResponse
  const reply = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim()
  if (!reply) {
    throw new Error('Gemini returned an empty response')
  }

  return reply
}
