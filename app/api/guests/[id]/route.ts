import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { guests } from "@/lib/schema"
import { guestFormSchema } from "@/lib/validations"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/guests/[id] — Admin only: get single guest
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [guest] = await db
      .select()
      .from(guests)
      .where(eq(guests.id, id))
      .limit(1)

    if (!guest) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ guest })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// PUT /api/guests/[id] — Admin only: update guest
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const result = guestFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    const [updatedGuest] = await db
      .update(guests)
      .set({
        nama: data.nama,
        alamat: data.alamat,
        noTelp: data.noTelp,
        tanggal: data.tanggal,
        instansi: data.instansi || null,
        tujuan: data.tujuan,
        updatedAt: new Date(),
      })
      .where(eq(guests.id, id))
      .returning()

    if (!updatedGuest) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Data tamu berhasil diperbarui",
      guest: updatedGuest,
    })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// DELETE /api/guests/[id] — Admin only: delete guest
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [deletedGuest] = await db
      .delete(guests)
      .where(eq(guests.id, id))
      .returning()

    if (!deletedGuest) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Data tamu berhasil dihapus",
    })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
