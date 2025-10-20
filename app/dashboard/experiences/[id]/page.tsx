'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ThumbsUp, ThumbsDown, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ExperienceDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [experience, setExperience] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchExperience()
    }
  }, [params.id])

  const fetchExperience = async () => {
    try {
      const response = await fetch(`/api/experiences/${params.id}`)
      const data = await response.json()
      setExperience(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      const response = await fetch(`/api/experiences/${params.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      })

      if (response.ok) {
        const updated = await response.json()
        setExperience(updated)
        toast.success('Vote recorded!')
      } else {
        toast.error('Failed to vote')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!experience) {
    return <div className="text-center py-12">Experience not found</div>
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start space-x-4">
          {experience.company.logo ? (
            <img
              src={experience.company.logo}
              alt={experience.company.name}
              className="w-16 h-16 rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{experience.company.name}</h1>
            <p className="text-lg text-gray-700 mt-1">{experience.role}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>by {experience.user.name}</span>
              <span>•</span>
              <span>{experience.user.department}</span>
              <span>•</span>
              <span>{formatDate(experience.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-600">Year</p>
            <p className="font-semibold">{experience.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Round</p>
            <p className="font-semibold">{experience.round}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Difficulty</p>
            <p className={`font-semibold ${
              experience.difficulty === 'Easy' ? 'text-green-600' :
              experience.difficulty === 'Medium' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {experience.difficulty}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Votes</p>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">👍 {experience.upvotes}</span>
              <span className="text-red-600">👎 {experience.downvotes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Interview Experience</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{experience.experience}</p>
      </div>

      {/* Tips */}
      {experience.tips && (
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">💡 Preparation Tips</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{experience.tips}</p>
        </div>
      )}

      {/* Questions */}
      {experience.questionsAsked && (
        <div className="bg-purple-50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-purple-900">❓ Questions Asked</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{experience.questionsAsked}</p>
        </div>
      )}

      {/* Vote Buttons */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-700 mb-4">Was this experience helpful?</p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleVote('UPVOTE')}
            className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold"
          >
            <ThumbsUp className="h-5 w-5" />
            <span>Helpful ({experience.upvotes})</span>
          </button>
          <button
            onClick={() => handleVote('DOWNVOTE')}
            className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
          >
            <ThumbsDown className="h-5 w-5" />
            <span>Not Helpful ({experience.downvotes})</span>
          </button>
        </div>
      </div>
    </div>
  )
}
