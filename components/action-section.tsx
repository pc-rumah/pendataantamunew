'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { UserPlus, MessageSquareText } from 'lucide-react'

export function ActionSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-card overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Animated header */}
        <div 
          className={`text-center mb-8 sm:mb-10 lg:mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
            Pilih Layanan Kami
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-md sm:max-w-lg mx-auto">
            Kantor Kecamatan Pecalungan - Silakan pilih layanan yang Anda butuhkan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Guest Form Button with animation */}
          <Link
            href="/form/tamu"
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 sm:p-6 lg:p-8 text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-500 sm:hover:-translate-y-2 sm:hover:scale-[1.02] active:scale-[0.98] ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex sm:block items-center gap-4 sm:gap-0">
              <div className="w-12 h-12 sm:w-14 lg:w-16 sm:h-14 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-4 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                <UserPlus className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold sm:mb-2 lg:mb-3 group-hover:translate-x-1 transition-transform">Isi Data Tamu</h3>
                <p className="text-primary-foreground/80 text-sm sm:text-base group-hover:translate-x-1 transition-transform delay-75 hidden sm:block">
                  Daftarkan kunjungan Anda dengan mengisi formulir data tamu
                </p>
              </div>
            </div>
          </Link>

          {/* Aspiration Button with animation */}
          <Link
            href="/form/aspirasi"
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent/80 p-5 sm:p-6 lg:p-8 text-accent-foreground shadow-lg hover:shadow-2xl transition-all duration-500 sm:hover:-translate-y-2 sm:hover:scale-[1.02] active:scale-[0.98] ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
          >
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex sm:block items-center gap-4 sm:gap-0">
              <div className="w-12 h-12 sm:w-14 lg:w-16 sm:h-14 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-4 lg:mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 flex-shrink-0">
                <MessageSquareText className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold sm:mb-2 lg:mb-3 group-hover:translate-x-1 transition-transform">Serap Aspirasi</h3>
                <p className="text-accent-foreground/80 text-sm sm:text-base group-hover:translate-x-1 transition-transform delay-75 hidden sm:block">
                  Sampaikan aspirasi, saran, dan masukan Anda untuk kemajuan bersama
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
