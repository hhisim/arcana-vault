import { NextResponse } from 'next/server';

export async function GET() {
  const question = "What is the first teaching of the Tao Te Ching about yielding?";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    // Use /chat endpoint which is confirmed working
    const res = await fetch('http://204.168.154.237:8002/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, session_id: 'demo-oracle' }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ question, answer: null });
    }

    const data = await res.json();
    const answer = typeof data === 'string' ? data : data?.answer;
    return NextResponse.json({ question, answer: answer || null });
  } catch (err) {
    console.error('[demo-oracle]', err);
    return NextResponse.json({ question, answer: null });
  }
}
