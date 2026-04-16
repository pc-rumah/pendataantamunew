import { config } from "dotenv"
config({ path: ".env.local" })
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { adminUsers } from "../lib/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })
  const db = drizzle(pool)

  console.log("🌱 Seeding admin user...")

  // Check if admin already exists
  const existing = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, "admin"))

  if (existing.length > 0) {
    console.log("⚠️  Admin user already exists, skipping...")
    await pool.end()
    process.exit(0)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 12)

  // Insert admin user
  await db.insert(adminUsers).values({
    username: "admin",
    password: hashedPassword,
    name: "Administrator",
    email: "admin@webripin.local",
  })

  console.log("✅ Admin user seeded successfully!")
  console.log("   Username: admin")
  console.log("   Password: admin123")

  await pool.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
