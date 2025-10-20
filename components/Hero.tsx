'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
  background?: 'gradient' | 'dark' | 'light'
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaLink,
  background = 'gradient'
}: HeroProps) {
  const bgStyles = {
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    dark: 'bg-apple-gray text-white',
    light: 'bg-apple-lightgray'
  }

  return (
    <section className={`relative overflow-hidden ${bgStyles[background]} pt-20`}>
      <div className="max-w-[980px] mx-auto px-6 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4 animate-slide-up">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {subtitle}
        </p>
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-flex items-center space-x-2 bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105 animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
