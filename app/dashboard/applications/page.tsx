'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Building2,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: any = {
      Applied: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: FileText,
        color: 'blue',
      },
      'Online Test': {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: Clock,
        color: 'purple',
      },
      'Technical Interview': {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: AlertCircle,
        color: 'orange',
      },
      'HR Interview': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        icon: Clock,
        color: 'yellow',
      },
      Offer: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: CheckCircle2,
        color: 'green',
      },
      Rejected: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: XCircle,
        color: 'red',
      },
    }
    return configs[status] || configs.Applied
  }

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    const matchesSearch =
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: applications.length,
    Applied: applications.filter((a) => a.status === 'Applied').length,
    'Online Test': applications.filter((a) => a.status === 'Online Test').length,
    'Technical Interview': applications.filter((a) => a.status === 'Technical Interview').length,
    'HR Interview': applications.filter((a) => a.status === 'HR Interview').length,
    Offer: applications.filter((a) => a.status === 'Offer').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
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
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Track Applications</h1>
        <p className="text-xl text-gray-600">
          Manage and monitor your job application progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count], index) => {
          const config = getStatusConfig(status)
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status.toLowerCase())}
              className={`p-4 rounded-2xl transition-all hover:scale-105 ${
                filterStatus === status.toLowerCase()
                  ? 'bg-apple-blue text-white shadow-lg'
                  : 'bg-white hover:shadow-md'
              } animate-scale-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-2xl font-semibold mb-1">{count}</div>
              <div className="text-xs">{status}</div>
            </button>
          )
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
          />
        </div>

        {/* Add Application Button */}
        <Link
          href="/dashboard/applications/new"
          className="inline-flex items-center justify-center space-x-2 bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Application</span>
        </Link>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-apple-gray mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your job applications</p>
          <Link
            href="/dashboard/applications/new"
            className="inline-flex items-center space-x-2 bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Application</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, index) => {
            const statusConfig = getStatusConfig(app.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  {/* Left Section */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Logo */}
                    {app.company?.logo ? (
                      <img
                        src={app.company.logo}
                        alt={app.company.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-apple-blue" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-apple-gray mb-1">
                        {app.role}
                      </h3>
                      {app.company && (
                        <p className="text-gray-600 mb-2">{app.company.name}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Applied on{' '}
                            {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      {app.notes && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{app.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-start space-x-4 ml-4">
                    {/* Status Badge */}
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium whitespace-nowrap">{app.status}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/applications/${app.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <Edit2 className="h-5 w-5 text-gray-600" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this application?')) {
                            // TODO: Implement delete
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
