'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ThumbsUp,
  ThumbsDown,
  Building2,
  Briefcase,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Plus,
  User,
  DollarSign,
  MessageSquare,
} from 'lucide-react'

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOutcome, setFilterOutcome] = useState('all')

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences')
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterOutcome === 'all' || exp.outcome === filterOutcome
    return matchesSearch && matchesFilter
  })

  const handleVote = async (experienceId: string, voteType: 'upvote' | 'downvote') => {
    // TODO: Implement voting API
    console.log('Vote:', experienceId, voteType)
  }

  const getOutcomeBadge = (outcome: string) => {
    const badges: any = {
      PLACED: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: '✅ Placed',
      },
      FINAL_ROUND_REJECT: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        label: '🔶 Final Round Reject',
      },
      REJECTED_EARLY: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        label: '❌ Rejected',
      },
      APPEARED: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        label: '🔵 Appeared',
      },
    }
    return badges[outcome] || badges.APPEARED
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: any = {
      Easy: 'text-green-600',
      Medium: 'text-yellow-600',
      Hard: 'text-red-600',
    }
    return colors[difficulty] || 'text-gray-600'
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
        <h1 className="text-5xl font-semibold text-apple-gray mb-4">Interview Experiences</h1>
        <p className="text-xl text-gray-600">
          Learn from real interview experiences shared by your peers
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
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

        {/* Filter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Outcomes</option>
              <option value="PLACED">Placed</option>
              <option value="FINAL_ROUND_REJECT">Final Round Reject</option>
              <option value="REJECTED_EARLY">Rejected</option>
              <option value="APPEARED">Appeared</option>
            </select>
          </div>

          {/* Add Experience Button */}
          <Link
            href="/dashboard/experiences/new"
            className="inline-flex items-center space-x-2 bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105 whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            <span>Share</span>
          </Link>
        </div>
      </div>

      {/* Experiences Feed */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-apple-gray mb-2">No Experiences Yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your interview experience
          </p>
          <Link
            href="/dashboard/experiences/new"
            className="inline-flex items-center space-x-2 bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Share Experience</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExperiences.map((exp, index) => {
            const outcomeBadge = getOutcomeBadge(exp.outcome)
            return (
              <article
                key={exp.id}
                className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Logo */}
                    {exp.company.logo ? (
                      <img
                        src={exp.company.logo}
                        alt={exp.company.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-apple-blue" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/dashboard/companies/${exp.company.id}`}
                        className="text-2xl font-semibold text-apple-gray hover:text-apple-blue transition-colors"
                      >
                        {exp.company.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm font-medium">{exp.role}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{exp.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className={`text-sm font-medium ${getDifficultyColor(exp.difficulty)}`}>
                            {exp.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Badge */}
                  <span
                    className={`${outcomeBadge.bg} ${outcomeBadge.text} px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap`}
                  >
                    {outcomeBadge.label}
                  </span>
                </div>

                {/* Round & Package */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                  <div className="px-4 py-2 bg-gray-50 rounded-full text-gray-700 font-medium">
                    {exp.round}
                  </div>
                  {exp.packageOffered && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full text-green-700 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{exp.packageOffered} LPA</span>
                    </div>
                  )}
                </div>

                {/* Experience Content */}
                <div className="prose prose-gray max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {exp.experience}
                  </p>
                </div>

                {/* Tips */}
                {exp.tips && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
                    <p className="text-sm text-blue-800">{exp.tips}</p>
                  </div>
                )}

                {/* Questions Asked */}
                {exp.questionsAsked && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">❓ Questions Asked</h4>
                    <p className="text-sm text-purple-800 whitespace-pre-line">{exp.questionsAsked}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  {/* Author */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{exp.user.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(exp.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Voting */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleVote(exp.id, 'upvote')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all group"
                    >
                      <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{exp.upvotes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(exp.id, 'downvote')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all group"
                    >
                      <ThumbsDown className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{exp.downvotes || 0}</span>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
