import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { aspirations } from "@/lib/schema"
import { aspirationFormSchema } from "@/lib/validations"
import { desc } from "drizzle-orm"
import { auth } from "@/auth"

// POST /api/aspirations — Public: create a new aspiration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = aspirationFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    const [newAspiration] = await db
      .insert(aspirations)
      .values({
        nama: data.nama,
        email: data.email,
        kategori: data.kategori,
        judul: data.judul,
        isi: data.isi,
        tanggal: data.tanggal,
      })
      .returning()

    return NextResponse.json(
      { message: "Aspirasi berhasil dikirim", aspiration: newAspiration },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating aspiration:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// GET /api/aspirations — Admin only: list all aspirations
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allAspirations = await db
      .select()
      .from(aspirations)
      .orderBy(desc(aspirations.createdAt))

    return NextResponse.json({ aspirations: allAspirations })
  } catch (error) {
    console.error("Error fetching aspirations:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
