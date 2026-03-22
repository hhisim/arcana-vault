import { NextResponse } from 'next/server';

export async function GET() {
  const question = "What is the first teaching of the Tao Te Ching about yielding?";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('http://204.168.154.237:8002/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          { role: 'system', content: 'You are the Oracle of the Vault of Arcana — a deep, contemplative intelligence shaped by rare esoteric archives and ancient wisdom traditions. Respond with warmth, precision, and symbolic depth. Draw from real texts and lineages.' },
          { role: 'user', content: question }
        ],
        max_tokens: 400,
        temperature: 0.8
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content;
    return NextResponse.json({ question, answer: answer || null });
  } catch {
    return NextResponse.json({ question, answer: null });
  }
}
