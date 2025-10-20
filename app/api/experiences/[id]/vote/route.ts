import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(
  req: Request,
  { params }: RouteParams
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { voteType } = body

    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_experienceId: {
          userId: user.id,
          experienceId: params.id
        }
      }
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: { id: existingVote.id }
        })

        await prisma.interviewExperience.update({
          where: { id: params.id },
          data: {
            [voteType === 'upvote' ? 'upvotes' : 'downvotes']: {
              decrement: 1
            }
          }
        })
      } else {
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType }
        })

        await prisma.interviewExperience.update({
          where: { id: params.id },
          data: {
            upvotes: {
              [voteType === 'upvote' ? 'increment' : 'decrement']: 1
            },
            downvotes: {
              [voteType === 'downvote' ? 'increment' : 'decrement']: 1
            }
          }
        })
      }
    } else {
      await prisma.vote.create({
        data: {
          userId: user.id,
          experienceId: params.id,
          voteType
        }
      })

      await prisma.interviewExperience.update({
        where: { id: params.id },
        data: {
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: {
            increment: 1
          }
        }
      })
    }

    const experience = await prisma.interviewExperience.findUnique({
      where: { id: params.id },
      select: {
        upvotes: true,
        downvotes: true
      }
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
