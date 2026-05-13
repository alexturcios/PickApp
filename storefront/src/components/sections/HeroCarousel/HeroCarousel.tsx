"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    headline: "Summer Collection 2026",
    subtitle: "Up to 50% off on trending styles",
    cta: "Shop Now",
    gradient: "from-[#299E60]/10 to-[#299E60]/5",
    image: "https://storage.googleapis.com/landingpage-al/91354739_0.jpg",
  },
  {
    id: 2,
    headline: "New Arrivals Daily",
    subtitle: "Discover unique pieces from independent sellers",
    cta: "Explore",
    gradient: "from-[#FF6B35]/10 to-[#FF6B35]/5",
    image: "https://storage.googleapis.com/landingpage-al/91437517_0.jpg",
  },
  {
    id: 3,
    headline: "Flash Deals This Week",
    subtitle: "Limited time offers on premium apparel",
    cta: "See Deals",
    gradient: "from-[#121535]/5 to-[#299E60]/5",
    image: "https://storage.googleapis.com/landingpage-al/91437222_0.jpg",
  },
]

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className="w-full px-4 lg:px-8">
      <div className={`relative w-full rounded-[16px] overflow-hidden bg-gradient-to-r ${slide.gradient} min-h-[200px] md:min-h-[320px] lg:min-h-[400px] flex items-center transition-all duration-500`}>
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-8 w-full md:w-1/2">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#121535] tracking-[-0.0230em] leading-tight mb-3">
            {slide.headline}
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#6C757D] tracking-[-0.0170em] mb-6 max-w-[400px]">
            {slide.subtitle}
          </p>
          <button className="self-start px-8 py-3 bg-[#FF6B35] text-white font-semibold text-[14px] rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] transition-colors">
            {slide.cta}
          </button>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
          <Image
            src={imgErrors[current] ? "/images/placeholder.svg" : slide.image}
            alt={slide.headline}
            fill
            className={imgErrors[current] ? "object-contain p-8" : "object-cover"}
            onError={() => setImgErrors((prev) => ({ ...prev, [current]: true }))}
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FFFFFF]/80 border border-[#E6E6E6] flex items-center justify-center hover:bg-[#FFFFFF] transition-colors shadow-sm"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FFFFFF]/80 border border-[#E6E6E6] flex items-center justify-center hover:bg-[#FFFFFF] transition-colors shadow-sm"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-[#299E60] w-6" : "bg-[#E6E6E6]"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
