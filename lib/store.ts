export interface Guest {
  id: string
  nama: string
  nik: string
  alamat: string
  noTelp: string
  instansi: string
  tujuan: string
  tanggal: string
  createdAt: string
}

export interface Aspiration {
  id: string
  nama: string
  email: string
  kategori: string
  judul: string
  isi: string
  tanggal: string
  status: 'baru' | 'diproses' | 'selesai'
  createdAt: string
}

const GUESTS_KEY = 'guests_data'
const ASPIRATIONS_KEY = 'aspirations_data'

export function getGuests(): Guest[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(GUESTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveGuest(guest: Omit<Guest, 'id' | 'createdAt'>): Guest {
  const guests = getGuests()
  const newGuest: Guest = {
    ...guest,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  guests.push(newGuest)
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
  return newGuest
}

export function updateGuest(id: string, data: Partial<Guest>): Guest | null {
  const guests = getGuests()
  const index = guests.findIndex((g) => g.id === id)
  if (index === -1) return null
  guests[index] = { ...guests[index], ...data }
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
  return guests[index]
}

export function deleteGuest(id: string): boolean {
  const guests = getGuests()
  const filtered = guests.filter((g) => g.id !== id)
  if (filtered.length === guests.length) return false
  localStorage.setItem(GUESTS_KEY, JSON.stringify(filtered))
  return true
}

export function getAspirations(): Aspiration[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ASPIRATIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAspiration(aspiration: Omit<Aspiration, 'id' | 'createdAt' | 'status'>): Aspiration {
  const aspirations = getAspirations()
  const newAspiration: Aspiration = {
    ...aspiration,
    id: crypto.randomUUID(),
    status: 'baru',
    createdAt: new Date().toISOString(),
  }
  aspirations.push(newAspiration)
  localStorage.setItem(ASPIRATIONS_KEY, JSON.stringify(aspirations))
  return newAspiration
}

export function updateAspiration(id: string, data: Partial<Aspiration>): Aspiration | null {
  const aspirations = getAspirations()
  const index = aspirations.findIndex((a) => a.id === id)
  if (index === -1) return null
  aspirations[index] = { ...aspirations[index], ...data }
  localStorage.setItem(ASPIRATIONS_KEY, JSON.stringify(aspirations))
  return aspirations[index]
}

export function deleteAspiration(id: string): boolean {
  const aspirations = getAspirations()
  const filtered = aspirations.filter((a) => a.id !== id)
  if (filtered.length === aspirations.length) return false
  localStorage.setItem(ASPIRATIONS_KEY, JSON.stringify(filtered))
  return true
}

// Slide Settings are now directly fetched from the PostgreSQL API

// Admin authentication is now handled by Auth.js (see /auth.ts)
