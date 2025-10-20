'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    year: new Date().getFullYear(),
    round: '',
    difficulty: 'Medium',
    outcome: 'APPEARED',
    experience: '',
    tips: '',
    questionsAsked: '',
    packageOffered: '',
  })

  const [newCompany, setNewCompany] = useState({
    name: '',
    logo: '',
    website: '',
    industry: '',
    description: '',
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

  const handleAddCompany = async () => {
    if (!newCompany.name) {
      alert('Company name is required')
      return
    }

    if (!['PLACED', 'FINAL_ROUND_REJECT'].includes(formData.outcome)) {
      alert('You can only add a company if you were placed or rejected in the final round')
      return
    }

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCompany,
          userId: user?.id,
          outcome: formData.outcome,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Company added successfully!')
        setCompanies([...companies, data])
        setFormData({ ...formData, companyId: data.id })
        setShowAddCompany(false)
        setNewCompany({ name: '', logo: '', website: '', industry: '', description: '' })
      } else {
        if (response.status === 409 && data.company) {
          alert('Company already exists, selecting it for you')
          setFormData({ ...formData, companyId: data.company.id })
          setShowAddCompany(false)
        } else {
          alert(data.error || 'Failed to add company')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add company')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.companyId) {
      alert('Please select or add a company')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          packageOffered: formData.packageOffered ? parseFloat(formData.packageOffered) : null,
        }),
      })

      if (response.ok) {
        alert('Experience shared successfully!')
        router.push('/dashboard/experiences')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to share experience')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to share experience')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Link
        href="/dashboard/experiences"
        className="inline-flex items-center space-x-2 text-apple-blue hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Experiences</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Share Your Experience</h1>
        <p className="text-xl text-gray-600">
          Help your peers by sharing your interview journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 space-y-8">
        {/* Company Selection */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">
            Company *
          </label>
          {!showAddCompany ? (
            <div className="space-y-3">
              <select
                required
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAddCompany(true)}
                className="flex items-center space-x-2 text-apple-blue hover:text-blue-600 font-medium transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Company not listed? Add it here</span>
              </button>
            </div>
          ) : (
            <div className="border-2 border-apple-blue rounded-3xl p-6 bg-blue-50/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-apple-gray">Add New Company</h3>
                <button
                  type="button"
                  onClick={() => setShowAddCompany(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
                <input
                  type="url"
                  placeholder="Logo URL"
                  value={newCompany.logo}
                  onChange={(e) => setNewCompany({ ...newCompany, logo: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={newCompany.website}
                  onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
                <select
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddCompany}
                  className="w-full bg-apple-blue text-white py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-all"
                >
                  Add Company
                </button>
              </div>

              <p className="text-sm text-blue-700 mt-4">
                ⓘ You can only add a company if you were <strong>placed</strong> or <strong>rejected in the final round</strong>
              </p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">Role *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">Year *</label>
            <input
              type="number"
              required
              min="2022"
              max="2030"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">Round *</label>
            <select
              required
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="">Select round</option>
              <option value="Aptitude Test">Aptitude Test</option>
              <option value="Technical Round 1">Technical Round 1</option>
              <option value="Technical Round 2">Technical Round 2</option>
              <option value="HR Round">HR Round</option>
              <option value="Final Round">Final Round</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">Difficulty *</label>
            <select
              required
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-apple-gray mb-3">Outcome *</label>
            <select
              required
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="APPEARED">Just Appeared</option>
              <option value="REJECTED_EARLY">Rejected in Early Rounds</option>
              <option value="FINAL_ROUND_REJECT">Rejected in Final Round</option>
              <option value="PLACED">Got Placed ✅</option>
            </select>
          </div>

          {formData.outcome === 'PLACED' && (
            <div>
              <label className="block text-lg font-semibold text-apple-gray mb-3">Package (LPA)</label>
              <input
                type="number"
                step="0.1"
                value={formData.packageOffered}
                onChange={(e) => setFormData({ ...formData, packageOffered: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                placeholder="e.g., 12.5"
              />
            </div>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">Your Experience *</label>
          <textarea
            required
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
            placeholder="Describe your interview experience in detail..."
          />
        </div>

        {/* Tips */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">Tips for Others</label>
          <textarea
            value={formData.tips}
            onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
            placeholder="Share preparation tips, resources, advice..."
          />
        </div>

        {/* Questions */}
        <div>
          <label className="block text-lg font-semibold text-apple-gray mb-3">Questions Asked</label>
          <textarea
            value={formData.questionsAsked}
            onChange={(e) => setFormData({ ...formData, questionsAsked: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
            placeholder="List the questions asked during the interview..."
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-apple-blue text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {loading ? 'Sharing...' : 'Share Experience'}
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
