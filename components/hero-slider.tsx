'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide } from '@/lib/schema'

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/slides')
        if (res.ok) {
          const data = await res.json()
          setSlides(data)
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error)
      }
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  if (!mounted || slides.length === 0) {
    return (
      <div className="h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] lg:h-[80vh] lg:min-h-[600px] bg-primary flex items-center justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] lg:h-[80vh] lg:min-h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          } ${slide.imageUrl ? 'bg-gray-900' : slide.bgClass}`}
          style={slide.imageUrl ? {
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.5)), url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Animated subtitle badge */}
              <span 
                className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6 transition-all duration-700 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-4'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                {slide.subtitle}
              </span>
              
              {/* Animated title */}
              <h1 
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight text-balance transition-all duration-700 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                {slide.title}
              </h1>
              
              {/* Animated description */}
              <p 
                className={`text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto text-pretty transition-all duration-700 px-2 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows with animation - Hidden on mobile for better touch experience */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/50 hover:bg-white/70 w-2 sm:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
