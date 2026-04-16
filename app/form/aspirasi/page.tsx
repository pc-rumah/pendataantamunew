'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquareText, CheckCircle2 } from 'lucide-react'

const categories = [
  'Pelayanan Publik',
  'Infrastruktur',
  'Pendidikan',
  'Kesehatan',
  'Keamanan',
  'Lingkungan',
  'Ekonomi',
  'Sosial',
  'Lainnya',
]

export default function AspirationFormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kategori: '',
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim aspirasi')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Aspirasi Berhasil Dikirim!</h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
            Terima kasih telah menyampaikan aspirasi Anda. Kami akan menindaklanjuti segera.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent-foreground/80 hover:text-accent-foreground mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageSquareText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Formulir Serap Aspirasi</h1>
              <p className="text-accent-foreground/80 text-sm sm:text-base">Sampaikan aspirasi, saran, atau masukan Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 animate-fade-in-up">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Kategori <span className="text-destructive">*</span>
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  required
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Tanggal <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  required
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="judul" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Judul Aspirasi <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                required
                value={formData.judul}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                placeholder="Judul singkat aspirasi Anda"
              />
            </div>

            <div>
              <label htmlFor="isi" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Isi Aspirasi <span className="text-destructive">*</span>
              </label>
              <textarea
                id="isi"
                name="isi"
                required
                rows={5}
                value={formData.isi}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none text-sm sm:text-base"
                placeholder="Jelaskan aspirasi, saran, atau masukan Anda secara detail..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 sm:mt-8 bg-accent text-accent-foreground py-3 sm:py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5" />
                Kirim Aspirasi
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
