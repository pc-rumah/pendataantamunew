import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { aspirations } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/aspirations/[id] — Admin only: get single aspiration
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [aspiration] = await db
      .select()
      .from(aspirations)
      .where(eq(aspirations.id, id))
      .limit(1)

    if (!aspiration) {
      return NextResponse.json(
        { error: "Aspirasi tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ aspiration })
  } catch (error) {
    console.error("Error fetching aspiration:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// PATCH /api/aspirations/[id] — Admin only: update aspiration (e.g. status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Allow partial updates (e.g., status change)
    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (body.status !== undefined) {
      const validStatuses = ["baru", "diproses", "selesai"]
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Status tidak valid. Pilih: baru, diproses, atau selesai" },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }
    if (body.nama !== undefined) updateData.nama = body.nama
    if (body.email !== undefined) updateData.email = body.email
    if (body.kategori !== undefined) updateData.kategori = body.kategori
    if (body.judul !== undefined) updateData.judul = body.judul
    if (body.isi !== undefined) updateData.isi = body.isi
    if (body.tanggal !== undefined) updateData.tanggal = body.tanggal

    const [updatedAspiration] = await db
      .update(aspirations)
      .set(updateData)
      .where(eq(aspirations.id, id))
      .returning()

    if (!updatedAspiration) {
      return NextResponse.json(
        { error: "Aspirasi tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Aspirasi berhasil diperbarui",
      aspiration: updatedAspiration,
    })
  } catch (error) {
    console.error("Error updating aspiration:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// DELETE /api/aspirations/[id] — Admin only: delete aspiration
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [deletedAspiration] = await db
      .delete(aspirations)
      .where(eq(aspirations.id, id))
      .returning()

    if (!deletedAspiration) {
      return NextResponse.json(
        { error: "Aspirasi tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Aspirasi berhasil dihapus",
    })
  } catch (error) {
    console.error("Error deleting aspiration:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
