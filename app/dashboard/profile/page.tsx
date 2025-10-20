'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Hash,
  Building2,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Shield,
  Award,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Camera,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    graduationYear: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/user/stats'),
      ])

      if (userRes.ok) {
        const session = await userRes.json()
        setUser(session?.user)
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          rollNumber: session?.user?.rollNumber || '',
          department: session?.user?.department || '',
          graduationYear: session?.user?.graduationYear || new Date().getFullYear(),
        })
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        setEditing(false)
        fetchUserData()
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
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
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Profile</h1>
        <p className="text-xl text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-4xl font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-apple-blue rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg hover:scale-110">
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-semibold text-apple-gray mb-2">{user?.name}</h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>

            {/* Role Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
              {user?.role === 'ADMIN' ? (
                <>
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Admin</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Student</span>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-semibold text-apple-gray mb-1">
                  {stats?.experiencesShared || 0}
                </div>
                <div className="text-sm text-gray-600">Experiences</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-apple-gray mb-1">
                  {stats?.companiesAdded || 0}
                </div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-medium hover:bg-red-100 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Activity Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-6">Your Impact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{stats?.upvotesReceived || 0}</div>
                  <div className="text-sm text-blue-100">Upvotes Received</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{stats?.helpfulCount || 0}</div>
                  <div className="text-sm text-blue-100">Students Helped</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-apple-gray">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-apple-blue text-white rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-all disabled:bg-gray-400"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      fetchUserData()
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Roll Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) =>
                        setFormData({ ...formData, graduationYear: parseInt(e.target.value) })
                      }
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-8">
            <h3 className="text-2xl font-semibold text-apple-gray mb-6">Recent Activity</h3>

            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {activity.type === 'experience' ? (
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-3xl p-8">
            <h3 className="text-2xl font-semibold text-apple-gray mb-6">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Change Password</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Privacy Settings</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors text-red-600">
                <div className="flex items-center space-x-3">
                  <X className="h-5 w-5" />
                  <span className="font-medium">Delete Account</span>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
