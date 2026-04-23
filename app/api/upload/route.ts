import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function sanitizeFilename(name: string) {
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '')
}

async function uploadToSupabaseStorage(file: File, buffer: Buffer) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'slides'

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`
  const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`

  const uploadRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: buffer,
  })

  if (!uploadRes.ok) {
    const details = await uploadRes.text()
    throw new Error(`Supabase upload failed (${uploadRes.status}): ${details}`)
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'File harus berupa gambar (JPG, PNG, WEBP, atau GIF)' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran gambar maksimal 5MB' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // In production/serverless, prefer durable object storage if configured.
    const cloudUrl = await uploadToSupabaseStorage(file, buffer)
    if (cloudUrl) {
      return NextResponse.json({
        success: true,
        url: cloudUrl,
      })
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slides')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/slides/${filename}`
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload file',
      },
      { status: 500 }
    )
  }
}
