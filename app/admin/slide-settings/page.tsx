'use client'

import { useState, useEffect, useRef } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import type { Slide } from '@/lib/schema'
import { Save, RotateCcw, ImagePlus, X, Eye, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function SlideSettingsPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/slides')
      if (res.ok) {
        const data = await res.json()
        setSlides(data)
      }
    } catch (error) {
      console.error('Failed to fetch slides', error)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleSlideChange = (id: number, field: keyof Slide, value: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSaveSlide = async (slide: Slide) => {
    setSaving(true)
    try {
      const res = await fetch('/api/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide)
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success('Slide berhasil disimpan')
    } catch (error) {
      console.error(error)
      toast.error('Gagal menyimpan slide')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides)
      })
      if (!res.ok) throw new Error('Failed to save all')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success('Semua slide berhasil disimpan')
    } catch (error) {
      console.error(error)
      toast.error('Gagal menyimpan slides')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan slide ke default?')) {
      try {
        const res = await fetch('/api/slides/reset', { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          setSlides(data)
          toast.success('Berhasil reset pengaturan slide')
        }
      } catch (error) {
        console.error('Failed to reset', error)
        toast.error('Gagal mereset slide')
      }
    }
  }

  const handleImageUpload = async (slideId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        handleSlideChange(slideId, 'imageUrl', url)
        toast.success('Gambar berhasil diunggah')
      } else {
        toast.error('Gagal mengunggah gambar')
      }
    }
  }

  const removeImage = (slideId: number) => {
    handleSlideChange(slideId, 'imageUrl', '')
  }

  const currentSlide = slides[activeSlide]

  if (slides.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Pengaturan Slide</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Kelola gambar dan keterangan slide landing page</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-border hover:bg-muted transition-colors text-sm active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden xs:inline">{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors text-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden xs:inline">Reset</span>
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm active:scale-95 ml-auto"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden xs:inline">{saved ? 'Tersimpan!' : 'Simpan Semua'}</span>
            </button>
          </div>
        </div>

        {/* Slide Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base active:scale-95 ${
                activeSlide === index
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              Slide {index + 1}
            </button>
          ))}
        </div>

        {/* Preview Mode */}
        {previewMode && currentSlide && (
          <div 
            className={`relative h-[280px] sm:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ${currentSlide.imageUrl ? '' : currentSlide.bgClass}`}
            style={currentSlide.imageUrl ? {
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${currentSlide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : undefined}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="text-center max-w-3xl">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-fade-in-up">
                  {currentSlide.subtitle}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight text-balance animate-fade-in-up animation-delay-100">
                  {currentSlide.title}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xs sm:max-w-md lg:max-w-xl mx-auto text-pretty animate-fade-in-up animation-delay-200">
                  {currentSlide.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {!previewMode && currentSlide && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Form Side */}
            <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 order-2 lg:order-1">
              <h3 className="font-semibold text-base sm:text-lg text-foreground">Edit Slide {activeSlide + 1}</h3>

              {/* Image Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Gambar Background
                </label>
                <div className="relative">
                  {currentSlide.imageUrl ? (
                    <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video">
                      <img 
                        src={currentSlide.imageUrl} 
                        alt="Slide background" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(currentSlide.id)}
                        className="absolute top-2 right-2 p-1.5 sm:p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors active:scale-95"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRefs.current[activeSlide]?.click()}
                      className="w-full aspect-video rounded-lg sm:rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/50 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-colors active:scale-[0.99]"
                    >
                      <ImagePlus className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground px-4 text-center">Klik untuk upload gambar</span>
                    </button>
                  )}
                  <input
                    ref={el => { fileInputRefs.current[activeSlide] = el }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(currentSlide.id, e)}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Gambar akan ditampilkan sebagai background dengan overlay gradient
                </p>
              </div>

              {/* Title */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Judul Slide
                </label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => handleSlideChange(currentSlide.id, 'title', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm sm:text-base"
                  placeholder="Masukkan judul slide"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Subtitle (Badge)
                </label>
                <input
                  type="text"
                  value={currentSlide.subtitle}
                  onChange={(e) => handleSlideChange(currentSlide.id, 'subtitle', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm sm:text-base"
                  placeholder="Masukkan subtitle"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Deskripsi
                </label>
                <textarea
                  value={currentSlide.description}
                  onChange={(e) => handleSlideChange(currentSlide.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none text-sm sm:text-base"
                  placeholder="Masukkan deskripsi slide"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={() => handleSaveSlide(currentSlide)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm sm:text-base active:scale-[0.98]"
              >
                {saving ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    Tersimpan!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Simpan Slide Ini
                  </>
                )}
              </button>
            </div>

            {/* Live Preview Side */}
            <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
              <h3 className="font-semibold text-base sm:text-lg text-foreground">Live Preview</h3>
              <div 
                className={`relative h-[200px] sm:h-[280px] lg:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ${currentSlide.imageUrl ? '' : currentSlide.bgClass}`}
                style={currentSlide.imageUrl ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${currentSlide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : undefined}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                  <div className="text-center max-w-lg">
                    <span className="inline-block px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-2 sm:mb-3">
                      {currentSlide.subtitle || 'Subtitle'}
                    </span>
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight text-balance">
                      {currentSlide.title || 'Judul Slide'}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/90 max-w-xs sm:max-w-md mx-auto text-pretty">
                      {currentSlide.description || 'Deskripsi slide akan muncul di sini'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Preview akan berubah secara realtime saat Anda mengedit
              </p>
            </div>
          </div>
        )}

        {/* All Slides Overview */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-base sm:text-lg text-foreground">Semua Slide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlide(index)
                  setPreviewMode(false)
                }}
                className={`relative h-28 sm:h-36 lg:h-40 rounded-lg sm:rounded-xl overflow-hidden shadow-lg transition-all sm:hover:scale-105 active:scale-[0.98] ${
                  activeSlide === index ? 'ring-2 sm:ring-4 ring-primary' : ''
                } ${slide.imageUrl ? '' : slide.bgClass}`}
                style={slide.imageUrl ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : undefined}
              >
                <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
                  <div className="text-center">
                    <span className="text-xs text-white/80 font-medium">Slide {index + 1}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-2">{slide.title}</h4>
                  </div>
                </div>
                {activeSlide === index && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
