export interface OracleStreamResult {
  answer: string
  sources: Array<{ source: string; text?: string | null; chunk?: number | null; distance?: number | null }>
}

/** Consume the backend's SSE stream without altering or limiting its answer text. */
export async function readOracleSseAnswer(response: Response, onToken: (text: string) => void): Promise<OracleStreamResult> {
  if (!response.body) throw new Error('Oracle stream has no body')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  let answer = ''
  let sources: OracleStreamResult['sources'] = []
  let completed = false

  const consume = (block: string) => {
    const event = block.split('\n').find((line) => line.startsWith('event:'))?.slice(6).trim()
    const data = block.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n')
    if (!event || !data) return
    let payload: Record<string, unknown>
    try { payload = JSON.parse(data) } catch { throw new Error('Malformed Oracle stream event') }
    if (event === 'meta') {
      if (Array.isArray(payload.sources)) sources = payload.sources as OracleStreamResult['sources']
    } else if (event === 'token' && typeof payload.text === 'string') {
      answer += payload.text
      onToken(payload.text)
    } else if (event === 'error') {
      throw new Error(typeof payload.detail === 'string' ? payload.detail : 'Oracle unavailable')
    } else if (event === 'done') {
      completed = true
    }
  }

  try {
    while (!completed) {
      const { done, value } = await reader.read()
      if (done) break
      pending += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
      let boundary = pending.indexOf('\n\n')
      while (boundary >= 0) {
        consume(pending.slice(0, boundary))
        pending = pending.slice(boundary + 2)
        if (completed) break
        boundary = pending.indexOf('\n\n')
      }
    }
    if (!completed) throw new Error('Oracle stream ended before completion')
    return { answer, sources }
  } finally {
    reader.releaseLock()
  }
}
