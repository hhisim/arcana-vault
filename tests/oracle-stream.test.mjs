import test from 'node:test'
import assert from 'node:assert/strict'

const stream = await import('../lib/oracle-stream.ts').catch(() => ({}))

function responseFrom(parts) {
  const encoder = new TextEncoder()
  return new Response(new ReadableStream({
    start(controller) {
      for (const part of parts) controller.enqueue(encoder.encode(part))
      controller.close()
    },
  }), { headers: { 'content-type': 'text/event-stream' } })
}

test('split SSE chunks assemble one full unchanged answer and expose incremental text', async () => {
  assert.equal(typeof stream.readOracleSseAnswer, 'function')
  const chunks = []
  const response = responseFrom([
    'event: meta\ndata: {"sources":[{"source":"book"}]}\n\nevent: tok',
    'en\ndata: {"text":"The complete "}\n\nevent: token\ndata: {"text":"answer."}\n\nevent: done\ndata: {"pack":"tao"}\n\n',
  ])
  const result = await stream.readOracleSseAnswer(response, (text) => chunks.push(text))
  assert.equal(result.answer, 'The complete answer.')
  assert.deepEqual(chunks, ['The complete ', 'answer.'])
  assert.deepEqual(result.sources, [{ source: 'book' }])
})

test('provider errors after partial output reject rather than treating fragment as complete', async () => {
  const response = responseFrom(['event: token\ndata: {"text":"Partial"}\n\nevent: error\ndata: {"detail":"Oracle unavailable"}\n\n'])
  await assert.rejects(stream.readOracleSseAnswer(response, () => {}), /Oracle unavailable/)
})

test('truncated streams reject and never save an incomplete answer', async () => {
  const response = responseFrom(['event: token\ndata: {"text":"Partial"}\n\n'])
  await assert.rejects(stream.readOracleSseAnswer(response, () => {}), /ended before completion/)
})
