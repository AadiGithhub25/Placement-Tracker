import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        placementData: {
          orderBy: { year: 'desc' }
        },
        experiences: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        deadlines: {
          where: {
            deadline: {
              gte: new Date()
            }
          },
          orderBy: { deadline: 'asc' }
        },
        _count: {
          select: {
            experiences: true,
            applications: true
          }
        }
      }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    const placedCount = company.experiences.filter(e => e.outcome === 'PLACED').length
    const placedExperiences = company.experiences.filter(e => e.outcome === 'PLACED' && e.packageOffered)
    const avgPackage = placedExperiences.length > 0
      ? placedExperiences.reduce((sum, e) => sum + (e.packageOffered || 0), 0) / placedExperiences.length
      : 0

    return NextResponse.json({
      ...company,
      stats: {
        placedCount,
        avgPackage: avgPackage.toFixed(2),
        totalExperiences: company._count.experiences,
        totalApplications: company._count.applications
      }
    })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}
