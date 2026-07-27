import { config } from "dotenv"
config({ path: ".env.local" })
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { adminUsers } from "../lib/schema"
import bcrypt from "bcryptjs"

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })
  const db = drizzle(pool)

  const username = process.env.ADMIN_USERNAME ?? "admin"
  const password = process.env.ADMIN_PASSWORD ?? "admin123"
  const name = process.env.ADMIN_NAME ?? "Administrator"
  const email = process.env.ADMIN_EMAIL ?? "admin@webripin.local"

  console.log(`🌱 Seeding admin user: ${username}...`)

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Insert or update the admin user so rerunning the seed keeps credentials in sync
  await db.insert(adminUsers).values({
    username,
    password: hashedPassword,
    name,
    email,
  }).onConflictDoUpdate({
    target: adminUsers.username,
    set: {
      password: hashedPassword,
      name,
      email,
      updatedAt: new Date(),
    },
  })

  console.log("✅ Admin user seeded successfully!")
  console.log(`   Username: ${username}`)
  console.log(`   Password: ${password}`)

  await pool.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
