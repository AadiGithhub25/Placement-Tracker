'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp,
  Users,
  Building2,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
} from 'lucide-react'

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Placement Statistics</h1>
        <p className="text-xl text-gray-600">
          Comprehensive insights into campus placement trends
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: Building2,
            label: 'Total Companies',
            value: stats?.overview?.totalCompanies || 0,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
          },
          {
            icon: Users,
            label: 'Students Placed',
            value: stats?.overview?.placedStudents || 0,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
          },
          {
            icon: Target,
            label: 'Placement Rate',
            value: `${stats?.overview?.placementRate || 0}%`,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
          },
          {
            icon: DollarSign,
            label: 'Avg Package',
            value: `₹${stats?.overview?.avgPackage || 0} LPA`,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div className="text-3xl font-semibold text-apple-gray mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Companies */}
        <div className="bg-white rounded-3xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-apple-gray">Top Companies</h2>
          </div>

          <div className="space-y-4">
            {stats?.topCompanies?.slice(0, 8).map((company: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-apple-gray">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.placementCount} students placed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    ₹{company.avgPackage} LPA
                  </div>
                  <div className="text-xs text-gray-500">avg package</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-3xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-apple-gray">Package Distribution</h2>
          </div>

          <div className="space-y-4">
            {stats?.packageDistribution?.map((range: any, index: number) => {
              const maxCount = Math.max(...stats.packageDistribution.map((r: any) => r.count))
              const percentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{range.label}</span>
                    <span className="text-gray-600">{range.count} students</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Placement Trends */}
      <div className="bg-white rounded-3xl p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-apple-gray">Placement Trends</h2>
        </div>

        {stats?.trends && stats.trends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.trends.map((trend: any, index: number) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-semibold text-apple-gray mb-1">
                  {trend.year}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Placed</span>
                    <span className="text-lg font-semibold text-green-600">
                      {trend.placed || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {trend.total || 0}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Success Rate: </span>
                    <span className="text-sm font-semibold text-purple-600">
                      {trend.total > 0 ? ((trend.placed / trend.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No trend data available yet
          </div>
        )}
      </div>

      {/* Industry Distribution */}
      <div className="bg-white rounded-3xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <PieChart className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold text-apple-gray">Industry Distribution</h2>
        </div>

        {stats?.industries && stats.industries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.industries.map((industry: any, index: number) => {
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-purple-500',
              ]
              const color = colors[index % colors.length]

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${color} text-white hover:scale-105 transition-transform`}
                >
                  <div className="text-3xl font-semibold mb-2">{industry.count}</div>
                  <div className="text-sm opacity-90">{industry.name}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No industry data available yet
          </div>
        )}
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-3xl font-semibold">
              {stats?.topCompanies?.[0]?.name || 'N/A'}
            </div>
            <div className="text-indigo-100">Top Hiring Company</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold">
              ₹{Math.max(...(stats?.packageDistribution?.map((r: any) => r.max === Infinity ? 20 : r.max) || [0]))} LPA
            </div>
            <div className="text-indigo-100">Highest Package Range</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold">
              {stats?.overview?.totalExperiences || 0}
            </div>
            <div className="text-indigo-100">Total Experiences Shared</div>
          </div>
        </div>
      </div>
    </div>
  )
}
