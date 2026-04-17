'use server'

import { db } from '@/lib/db'
import { dailyVisits } from '@/lib/schema'
import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

export interface VisitorStats {
  totalVisits: number
  todayVisits: number
}

function getTodayString(): string {
  // Returns current date in YYYY-MM-DD
  return new Date().toISOString().split('T')[0]
}

export async function getVisitorStatsAction(): Promise<VisitorStats> {
  const today = getTodayString()

  // Get total visits by summing all counts
  const totalResult = await db.select({
    total: sql<number>`cast(sum(${dailyVisits.count}) as int)`
  }).from(dailyVisits)

  // Get today's visits
  const todayResult = await db.select({ count: dailyVisits.count })
    .from(dailyVisits)
    .where(eq(dailyVisits.date, today))
    .limit(1)

  const totalVisits = totalResult[0]?.total || 0
  const todayVisits = todayResult[0]?.count || 0

  return {
    totalVisits,
    todayVisits
  }
}

export async function recordVisitAction(): Promise<VisitorStats> {
  const today = getTodayString()

  // Upsert today's visit count
  await db.insert(dailyVisits)
    .values({ date: today, count: 1 })
    .onConflictDoUpdate({
      target: dailyVisits.date,
      set: { count: sql`${dailyVisits.count} + 1` }
    })

  // Return the updated stats
  return getVisitorStatsAction()
}
