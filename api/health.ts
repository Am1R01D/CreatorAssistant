export default function handler(_request: unknown, response: { status: (status: number) => { json: (body: unknown) => void } }) {
  response.status(200).json({
    status: 'ok',
    service: 'creator-analyzer-api',
    timestamp: new Date().toISOString(),
  })
}
