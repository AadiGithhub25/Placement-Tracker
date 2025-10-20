import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      companyId,
      role,
      year,
      round,
      difficulty,
      outcome,
      experience,
      tips,
      questionsAsked,
      packageOffered
    } = body

    // Validation
    if (!companyId || !role || !year || !round || !difficulty || !outcome || !experience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user is a student
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || dbUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can share experiences' },
        { status: 403 }
      )
    }

    // Create experience
    const exp = await prisma.interviewExperience.create({
      data: {
        userId: user.id,
        companyId,
        role,
        year: parseInt(year),
        round,
        difficulty,
        outcome,
        experience,
        tips: tips || null,
        questionsAsked: questionsAsked || null,
        packageOffered: packageOffered ? parseFloat(packageOffered) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      }
    })

    return NextResponse.json(exp, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const experiences = await prisma.interviewExperience.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        company: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}
