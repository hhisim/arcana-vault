import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'No slug provided' }, { status: 400 });

  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
    const content = await fs.readFile(filePath, 'utf8');
    // Strip frontmatter if it exists - basic regex for simplicity
    const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
    return NextResponse.json({ content: cleanContent });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
