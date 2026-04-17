import { pgTable, text, timestamp, uuid, varchar, date, integer } from "drizzle-orm/pg-core"

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  nik: varchar("nik", { length: 16 }).notNull(),
  alamat: text("alamat").notNull(),
  noTelp: varchar("no_telp", { length: 20 }).notNull(),
  tanggal: date("tanggal").notNull(),
  instansi: text("instansi"),
  tujuan: text("tujuan").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Guest = typeof guests.$inferSelect
export type NewGuest = typeof guests.$inferInsert

export const aspirations = pgTable("aspirations", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  kategori: text("kategori").notNull(),
  judul: text("judul").notNull(),
  isi: text("isi").notNull(),
  tanggal: date("tanggal").notNull(),
  status: text("status").notNull().default("baru"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Aspiration = typeof aspirations.$inferSelect
export type NewAspiration = typeof aspirations.$inferInsert

export const dailyVisits = pgTable("daily_visits", {
  date: date("date").primaryKey(), // YYYY-MM-DD format
  count: integer("count").notNull().default(1),
})

export type DailyVisit = typeof dailyVisits.$inferSelect

export const slides = pgTable("slides", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url"),
  bgClass: text("bg_class"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Slide = typeof slides.$inferSelect
export type NewSlide = typeof slides.$inferInsert
