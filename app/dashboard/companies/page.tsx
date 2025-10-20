'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, ExternalLink, Users, CheckCircle, XCircle, Search } from 'lucide-react'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Companies</h1>
        <p className="text-xl text-gray-600">
          Explore companies that visited for campus placements
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
          />
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-apple-gray mb-2">No Companies Yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to add a company by sharing your experience
          </p>
          <Link
            href="/dashboard/experiences/new"
            className="inline-block bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105"
          >
            Share Experience
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <Link
              key={company.id}
              href={`/dashboard/companies/${company.id}`}
              className="group bg-white rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start space-x-4 mb-6">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-apple-blue" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-apple-gray truncate group-hover:text-apple-blue transition-colors">
                    {company.name}
                  </h3>
                  {company.industry && (
                    <p className="text-sm text-gray-500 mt-1">{company.industry}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">{company.placedCount || 0} Placed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-500">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">{company.finalRoundRejectCount || 0} Final Reject</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{company.totalExperiences || 0} experiences shared</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Added by {company.createdBy?.name}
                </span>
                {company.website && (
                  <ExternalLink className="h-4 w-4 text-apple-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
