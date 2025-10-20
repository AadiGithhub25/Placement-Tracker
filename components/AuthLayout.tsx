'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-apple-gray hover:text-apple-blue transition-colors z-10"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Home</span>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-apple-gray mb-2">
            PlacementTracker
          </h1>
          <p className="text-gray-600">Your campus placement companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-apple-gray mb-2">
              {title}
            </h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 PlacementTracker. Built for students.</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  )
}
