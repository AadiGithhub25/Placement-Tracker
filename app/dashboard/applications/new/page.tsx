'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Briefcase, Calendar, FileText } from 'lucide-react'

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    status: 'Applied',
    appliedAt: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [companiesRes, sessionRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/auth/session'),
      ])

      if (companiesRes.ok) {
        const data = await companiesRes.json()
        setCompanies(data)
      }

      if (sessionRes.ok) {
        const session = await sessionRes.json()
        setUser(session?.user)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          appliedAt: new Date(formData.appliedAt),
        }),
      })

      if (response.ok) {
        alert('Application added successfully!')
        router.push('/dashboard/applications')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add application')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center space-x-2 text-apple-blue hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Applications</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Add Application</h1>
        <p className="text-xl text-gray-600">Track a new job application</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 space-y-8">
        {/* Company */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">
            Company *
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              required
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">
            Role/Position *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
              placeholder="e.g., Software Engineer"
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="Applied">Applied</option>
              <option value="Online Test">Online Test</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applied Date */}
          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">
              Applied Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                required
                value={formData.appliedAt}
                onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">Notes</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={6}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
              placeholder="Add any notes, interview dates, contacts, etc..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-apple-blue text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {loading ? 'Adding...' : 'Add Application'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
