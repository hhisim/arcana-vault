import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Vault mount path
const VAULT_ROOT = '/mnt/mysteryschool'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  // Security: only allow files from vault root
  const fullPath = path.resolve(VAULT_ROOT, filePath)

  if (!fullPath.startsWith(VAULT_ROOT)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const ext = path.extname(fullPath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.epub': 'application/epub+zip',
  }

  const mimeType = mimeTypes[ext]
  if (!mimeType) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
  }

  const fileBuffer = fs.readFileSync(fullPath)

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
