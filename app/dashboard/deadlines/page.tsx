'use client'

import { useEffect, useState } from 'react'
import { Calendar, ExternalLink, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeadlines()
  }, [])

  const fetchDeadlines = async () => {
    try {
      const response = await fetch('/api/deadlines')
      if (response.ok) {
        const data = await response.json()
        setDeadlines(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading deadlines...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Deadlines</h1>
      <p className="text-gray-600 mb-6">Stay updated with upcoming company application deadlines</p>

      <div className="space-y-4">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {deadline.company?.logo ? (
                  <img src={deadline.company.logo} alt={deadline.company.name} className="w-12 h-12 rounded-lg" />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{deadline.title}</h3>
                  <p className="text-gray-600 mt-1">{deadline.company?.name}</p>
                  {deadline.description && (
                    <p className="text-sm text-gray-600 mt-2">{deadline.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mt-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(deadline.deadline)}
                  </div>
                </div>
              </div>
              {deadline.link && (
                <a
                  href={deadline.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <span>Apply</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {deadlines.length === 0 && (
        <div className="text-center py-12 text-gray-500">No upcoming deadlines</div>
      )}
    </div>
  )
}
