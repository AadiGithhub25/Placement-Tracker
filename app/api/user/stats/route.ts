import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [experiencesShared, companiesAdded, upvotesReceived] = await Promise.all([
      prisma.interviewExperience.count({
        where: { userId: user.id }
      }),
      prisma.company.count({
        where: { createdById: user.id }
      }),
      prisma.interviewExperience.aggregate({
        where: { userId: user.id },
        _sum: { upvotes: true }
      })
    ])

    const recentActivities = await prisma.interviewExperience.findMany({
      where: { userId: user.id },
      include: {
        company: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const activities = recentActivities.map(exp => ({
      type: 'experience',
      title: `Shared experience for ${exp.company.name}`,
      description: `${exp.role} - ${exp.round}`,
      date: exp.createdAt
    }))

    return NextResponse.json({
      experiencesShared,
      companiesAdded,
      upvotesReceived: upvotesReceived._sum.upvotes || 0,
      helpfulCount: upvotesReceived._sum.upvotes || 0,
      recentActivities: activities
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
