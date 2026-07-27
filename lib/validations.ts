import { z } from "zod"

export const guestFormSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noTelp: z.string().min(1, "No. telepon wajib diisi"),
  tanggal: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  instansi: z.string().optional().default(""),
  tujuan: z.string().min(1, "Tujuan kunjungan wajib diisi"),
})

export type GuestFormData = z.infer<typeof guestFormSchema>

export const aspirationFormSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  judul: z.string().min(1, "Judul aspirasi wajib diisi"),
  isi: z.string().min(1, "Isi aspirasi wajib diisi"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
})

export type AspirationFormData = z.infer<typeof aspirationFormSchema>
