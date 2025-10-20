import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await prisma.interviewExperience.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            department: true
          }
        },
        company: {
          select: {
            name: true,
            logo: true,
            industry: true
          }
        }
      }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}
