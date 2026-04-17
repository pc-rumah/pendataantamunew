import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slides } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export const defaultSlides = [
  {
    id: 1,
    title: 'Selamat Datang di Sistem Pendataan Tamu Digital',
    subtitle: 'Kantor Kecamatan Pecalungan',
    description: 'Layanan pendataan tamu dan penyampaian aspirasi masyarakat secara digital',
    imageUrl: '',
    bgClass: 'bg-gradient-to-br from-primary via-primary/90 to-accent',
  },
  {
    id: 2,
    title: 'Tentang Sistem Kami',
    subtitle: 'Modern & Efisien',
    description: 'Sistem ini dirancang untuk memudahkan pendataan tamu dan menampung aspirasi masyarakat secara transparan, cepat, dan akuntabel di Kantor Kecamatan Pecalungan.',
    imageUrl: '',
    bgClass: 'bg-gradient-to-br from-accent via-accent/90 to-primary',
  },
  {
    id: 3,
    title: 'Aspirasi Anda Penting',
    subtitle: 'Suara Anda Didengar',
    description: 'Setiap aspirasi yang masuk akan ditindaklanjuti dengan serius untuk kemajuan Kecamatan Pecalungan.',
    imageUrl: '',
    bgClass: 'bg-gradient-to-br from-primary/80 via-accent/80 to-primary',
  },
]

export async function GET() {
  try {
    let allSlides = await db.select().from(slides).orderBy(slides.id)

    if (allSlides.length === 0) {
      // Seed default slides if empty
      await db.insert(slides).values(defaultSlides)
      allSlides = await db.select().from(slides).orderBy(slides.id)
    }

    return NextResponse.json(allSlides)
  } catch (error) {
    console.error('Error fetching slides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    // We expect either an array of slides or a single slide.
    const updates = Array.isArray(data) ? data : [data]

    for (const slide of updates) {
      await db.update(slides)
        .set({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          imageUrl: slide.imageUrl,
          bgClass: slide.bgClass,
          updatedAt: new Date()
        })
        .where(eq(slides.id, slide.id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating slides:', error)
    return NextResponse.json(
      { error: 'Failed to update slides' },
      { status: 500 }
    )
  }
}
