'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Building2, Globe, TrendingUp, Users, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function CompanyDetailPage() {
  const params = useParams()
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCompany()
    }
  }, [params.id])

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${params.id}`)
      const data = await response.json()
      setCompany(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!company) {
    return <div className="text-center py-12">Company not found</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start space-x-4">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            {company.industry && (
              <p className="text-gray-600 mt-1">{company.industry}</p>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-2"
              >
                <Globe className="h-4 w-4 mr-1" />
                Visit Website
              </a>
            )}
          </div>
        </div>
        {company.description && (
          <p className="text-gray-700 mt-4">{company.description}</p>
        )}
      </div>

      {/* Placement Data */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Placement Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {company.placementData?.map((data: any) => (
            <div key={data.id} className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Year {data.year}</p>
              <p className="font-semibold text-lg mb-2">{data.role}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Package:</span>
                  <span className="font-semibold">₹{data.minPackage} LPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Package:</span>
                  <span className="font-semibold">₹{data.maxPackage} LPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Package:</span>
                  <span className="font-semibold text-green-600">₹{data.avgPackage} LPA</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Students Placed:</span>
                  <span className="font-semibold text-blue-600">{data.studentsPlaced}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Experiences */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Interview Experiences</h2>
        <div className="space-y-4">
          {company.experiences?.map((exp: any) => (
            <div key={exp.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-lg">{exp.role}</p>
                  <p className="text-sm text-gray-600">
                    by {exp.user.name} • {exp.round} • {exp.difficulty}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">👍 {exp.upvotes}</span>
                  <span className="text-red-600">👎 {exp.downvotes}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{exp.experience}</p>
              {exp.tips && (
                <p className="text-blue-600 text-sm mt-2">💡 Tip: {exp.tips}</p>
              )}
            </div>
          ))}
          {company.experiences?.length === 0 && (
            <p className="text-gray-500 text-center py-4">No experiences yet</p>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {company.deadlines?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {company.deadlines.map((deadline: any) => (
              <div key={deadline.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-semibold">{deadline.title}</p>
                  {deadline.description && (
                    <p className="text-sm text-gray-600">{deadline.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">
                    {formatDate(deadline.deadline)}
                  </p>
                  {deadline.link && (
                    <a
                      href={deadline.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Apply
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
