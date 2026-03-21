import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug');

  if (!rawSlug) return NextResponse.json({ error: 'No slug provided' }, { status: 400 });

  // Sanitize: only allow alphanumeric, hyphens, underscores — prevents path traversal
  const slug = rawSlug.replace(/[^a-zA-Z0-9\-_]/g, '');
  if (!slug || slug !== rawSlug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
    const content = await fs.readFile(filePath, 'utf8');
    const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
    return NextResponse.json({ content: cleanContent });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
};
