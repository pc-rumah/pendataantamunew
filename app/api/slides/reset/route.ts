import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slides } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { defaultSlides } from '../route'

export async function POST() {
  try {
    for (const slide of defaultSlides) {
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

    const resetSlides = await db.select().from(slides).orderBy(slides.id)
    return NextResponse.json(resetSlides)
  } catch (error) {
    console.error('Error resetting slides:', error)
    return NextResponse.json(
      { error: 'Failed to reset slides' },
      { status: 500 }
    )
  }
}
