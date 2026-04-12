'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Shield, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="bg-sidebar text-sidebar-foreground py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-sidebar-foreground">Sistem Pendataan</h3>
                <p className="text-xs text-sidebar-foreground/60">Tamu Digital & Aspirasi</p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Layanan pendataan tamu dan penyampaian aspirasi masyarakat secara digital di Kantor Kecamatan Pecalungan.
            </p>
          </div>

          {/* Contact */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <h4 className="font-semibold mb-4 text-sidebar-foreground">Kontak</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Kantor Kecamatan Pecalungan, Batang, Jawa Tengah</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(0285) 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>kec.pecalungan@batangkab.go.id</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="font-semibold mb-4 text-sidebar-foreground">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/form/tamu"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Isi Data Tamu
                </Link>
              </li>
              <li>
                <Link
                  href="/form/aspirasi"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Sampaikan Aspirasi
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div 
          className={`pt-6 sm:pt-8 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-sidebar-foreground/50 text-center sm:text-left transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
          <div>
            &copy; {new Date().getFullYear()} Kantor Kecamatan Pecalungan. All rights reserved.
          </div>
          <div className="hidden sm:block">
            Sistem Pendataan Tamu Digital & Serap Aspirasi
          </div>
        </div>
      </div>
    </footer>
  )
}
