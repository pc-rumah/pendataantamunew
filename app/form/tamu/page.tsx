'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react'
import { saveGuest } from '@/lib/store'

export default function GuestFormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    noTelp: '',
    instansi: '',
    tujuan: '',
    tanggal: new Date().toISOString().split('T')[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    saveGuest(formData)
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Data Berhasil Disimpan!</h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
            Terima kasih telah mengisi data kunjungan Anda.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
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
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Formulir Data Tamu</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">Silakan isi data diri Anda dengan lengkap</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 animate-fade-in-up">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
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
              <label htmlFor="nik" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                NIK (Nomor Induk Kependudukan) <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                required
                maxLength={16}
                value={formData.nik}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                placeholder="Masukkan 16 digit NIK"
              />
            </div>

            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Alamat <span className="text-destructive">*</span>
              </label>
              <textarea
                id="alamat"
                name="alamat"
                required
                rows={3}
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none text-sm sm:text-base"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              <div>
                <label htmlFor="noTelp" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  No. Telepon <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  id="noTelp"
                  name="noTelp"
                  required
                  value={formData.noTelp}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Tanggal Kunjungan <span className="text-destructive">*</span>
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
              <label htmlFor="instansi" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Instansi/Lembaga
              </label>
              <input
                type="text"
                id="instansi"
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm sm:text-base"
                placeholder="Nama instansi (opsional)"
              />
            </div>

            <div>
              <label htmlFor="tujuan" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Tujuan Kunjungan <span className="text-destructive">*</span>
              </label>
              <textarea
                id="tujuan"
                name="tujuan"
                required
                rows={3}
                value={formData.tujuan}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none text-sm sm:text-base"
                placeholder="Jelaskan tujuan kunjungan Anda"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 sm:mt-8 bg-primary text-primary-foreground py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Simpan Data
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
