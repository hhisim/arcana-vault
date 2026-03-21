import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'No slug provided' }, { status: 400 });

  // Sanitize slug: only allow alphanumeric, hyphens, underscores
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeSlug || safeSlug !== slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${safeSlug}.mdx`);

    // Extra safety: ensure resolved path is within the blog directory
    const blogDir = path.resolve(process.cwd(), 'content', 'blog');
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(blogDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const content = await fs.readFile(resolved, 'utf8');
    // Strip frontmatter if it exists
    const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
    return NextResponse.json({ content: cleanContent });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
