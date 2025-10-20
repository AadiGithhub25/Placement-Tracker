'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Building2, Users, TrendingUp } from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import PackageChart from '@/components/charts/PackageChart'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch session
      const sessionResponse = await fetch('/api/auth/session')
      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        setUser(session?.user)
      }

      // Fetch stats
      const statsResponse = await fetch('/api/stats')
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-600 mt-2">Here's your placement dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={<Building2 className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Placements"
          value={stats?.totalPlacements || 0}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Avg Package"
          value={`₹${stats?.avgPackage || 0} LPA`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Highest Package"
          value={`₹${stats?.highestPackage || 0} LPA`}
          icon={<BarChart3 className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Package Distribution</h2>
          {stats?.recentPlacements?.length > 0 ? (
            <PackageChart data={stats.recentPlacements} />
          ) : (
            <p className="text-gray-500 text-center py-8">No placement data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Placements</h2>
          <div className="space-y-4">
            {stats?.recentPlacements?.slice(0, 5).map((placement: any) => (
              <div key={placement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {placement.company?.logo && (
                    <img
                      src={placement.company.logo}
                      alt={placement.company.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{placement.company?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{placement.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{placement.avgPackage} LPA</p>
                  <p className="text-sm text-gray-600">{placement.studentsPlaced} placed</p>
                </div>
              </div>
            ))}
            {(!stats?.recentPlacements || stats.recentPlacements.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent placements</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/experiences/new"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 transition text-center"
          >
            <p className="font-semibold text-blue-600">Share Interview Experience</p>
          </a>
          <a
            href="/dashboard/companies"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 transition text-center"
          >
            <p className="font-semibold text-green-600">Browse Companies</p>
          </a>
          <a
            href="/dashboard/deadlines"
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 transition text-center"
          >
            <p className="font-semibold text-purple-600">View Deadlines</p>
          </a>
        </div>
      </div>
    </div>
  )
}
