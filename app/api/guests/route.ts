import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { guests } from "@/lib/schema"
import { guestFormSchema } from "@/lib/validations"
import { desc } from "drizzle-orm"
import { auth } from "@/auth"

// POST /api/guests — Public: create a new guest entry
export async function POST(request: NextRequest) {
  try {
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

    const [newGuest] = await db
      .insert(guests)
      .values({
        nama: data.nama,
        alamat: data.alamat,
        noTelp: data.noTelp,
        tanggal: data.tanggal,
        instansi: data.instansi || null,
        tujuan: data.tujuan,
      })
      .returning()

    return NextResponse.json(
      { message: "Data tamu berhasil disimpan", guest: newGuest },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// GET /api/guests — Admin only: list all guests
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allGuests = await db
      .select()
      .from(guests)
      .orderBy(desc(guests.createdAt))

    return NextResponse.json({ guests: allGuests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
