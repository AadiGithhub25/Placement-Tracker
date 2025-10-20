import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Building2, Users, Calendar, TrendingUp, BookOpen, Award } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Building2,
      title: 'Company Database',
      description: 'Browse companies from the last 3 years added by students who reached final rounds.',
    },
    {
      icon: Users,
      title: 'Real Experiences',
      description: 'Learn from authentic interview experiences shared by your peers.',
    },
    {
      icon: Calendar,
      title: 'Track Deadlines',
      description: 'Never miss an application deadline with our comprehensive tracker.',
    },
    {
      icon: TrendingUp,
      title: 'Placement Stats',
      description: 'View detailed placement statistics and salary trends.',
    },
    {
      icon: BookOpen,
      title: 'Interview Prep',
      description: 'Access questions asked and tips from students who got placed.',
    },
    {
      icon: Award,
      title: 'Success Stories',
      description: 'Get inspired by success stories from your seniors.',
    },
  ]

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <Hero
        title="Your Campus Placement Journey Simplified"
        subtitle="Connect with peers, share experiences, and track your placement progress all in one place."
        ctaText="Get Started"
        ctaLink="/signup"
        background="gradient"
      />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-apple-gray mb-4">
              Everything you need for placement success.
            </h2>
            <p className="text-lg text-gray-600">
              Built by students, for students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-apple-lightgray hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-apple-gray text-white">
        <div className="max-w-[980px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of students already using PlacementTracker to land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-apple-blue text-white rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-apple-lightgray border-t border-gray-200">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 PlacementTracker. Built for students, by students.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
