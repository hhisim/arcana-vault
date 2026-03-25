import { NextResponse } from 'next/server';

export async function GET() {
  const question = "What is the first teaching of the Tao Te Ching about yielding?";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const url = `http://204.168.154.237:8002/ask?q=${encodeURIComponent(question)}&pack=tao&mode=oracle&lang=en`;
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ question, answer: null });
    }

    const data = await res.json();
    const answer = data?.answer;
    return NextResponse.json({ question, answer: answer || null });
  } catch {
    return NextResponse.json({ question, answer: null });
  }
}
