'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  Briefcase,
  Target,
  Award,
  CheckCircle2,
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentCompanies, setRecentCompanies] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, companiesRes, deadlinesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/companies'),
        fetch('/api/deadlines'),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      if (companiesRes.ok) {
        const companies = await companiesRes.json()
        setRecentCompanies(companies.slice(0, 6))
      }

      if (deadlinesRes.ok) {
        const deadlines = await deadlinesRes.json()
        setUpcomingDeadlines(deadlines.slice(0, 5))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-apple-blue border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-12">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 animate-slide-up">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track your placement journey, explore companies, and stay ahead of deadlines.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/companies"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <span>Browse Companies</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/experiences/new"
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all animate-scale-in"
              style={{ animationDelay: '0.3s' }}
            >
              <span>Share Experience</span>
            </Link>
          </div>
        </div>
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-3xl font-semibold text-apple-gray mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Building2,
              label: 'Total Companies',
              value: stats?.totalCompanies || 0,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
            },
            {
              icon: Users,
              label: 'Experiences Shared',
              value: stats?.totalExperiences || 0,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600',
            },
            {
              icon: Calendar,
              label: 'Active Deadlines',
              value: upcomingDeadlines.length,
              color: 'from-orange-500 to-red-500',
              bgColor: 'bg-orange-50',
              iconColor: 'text-orange-600',
            },
            {
              icon: TrendingUp,
              label: 'Avg Package',
              value: stats?.avgPackage ? `₹${stats.avgPackage} LPA` : 'N/A',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="text-3xl font-semibold text-apple-gray mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-3xl font-semibold text-apple-gray mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Briefcase,
              title: 'Share Experience',
              description: 'Help others by sharing your interview experience',
              link: '/dashboard/experiences/new',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Target,
              title: 'Track Applications',
              description: 'Keep track of all your job applications',
              link: '/dashboard/applications',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: Award,
              title: 'View Statistics',
              description: 'Analyze placement trends and salary data',
              link: '/dashboard/stats',
              gradient: 'from-orange-500 to-red-500',
            },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.link}
              className="group relative overflow-hidden bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray mb-2 group-hover:text-apple-blue transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-apple-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Companies */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-apple-gray">Recent Companies</h2>
          <Link
            href="/dashboard/companies"
            className="text-apple-blue hover:underline font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentCompanies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No companies added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCompanies.map((company, index) => (
              <Link
                key={company.id}
                href={`/dashboard/companies/${company.id}`}
                className="group bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-apple-blue" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-apple-gray truncate group-hover:text-apple-blue transition-colors">
                      {company.name}
                    </h3>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-600">
                    {company.totalExperiences || 0} experiences
                  </span>
                  <ArrowRight className="h-4 w-4 text-apple-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Deadlines */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-apple-gray">Upcoming Deadlines</h2>
          <Link
            href="/dashboard/deadlines"
            className="text-apple-blue hover:underline font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl divide-y divide-gray-100">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={deadline.id}
                className="p-6 hover:bg-gray-50 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-apple-gray mb-1">
                        {deadline.title}
                      </h3>
                      {deadline.company && (
                        <p className="text-sm text-gray-600 mb-2">
                          {deadline.company.name}
                        </p>
                      )}
                      {deadline.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {deadline.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-sm font-medium text-red-600">
                      {new Date(deadline.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(deadline.deadline).toLocaleDateString('en-IN', {
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Motivational Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-semibold mb-4">
            You're doing great!
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Stay consistent, keep preparing, and your dream job is just around the corner.
          </p>
          <Link
            href="/dashboard/experiences"
            className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            <span>Read Success Stories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
