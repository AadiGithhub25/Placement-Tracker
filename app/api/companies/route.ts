import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// GET - Fetch companies from last 3 years
export async function GET() {
  try {
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

    const companies = await prisma.company.findMany({
      where: {
        createdAt: {
          gte: threeYearsAgo
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        placementData: {
          orderBy: { year: 'desc' },
          take: 1
        },
        _count: {
          select: {
            experiences: true,
            deadlines: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate stats separately
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const experiences = await prisma.interviewExperience.findMany({
          where: {
            companyId: company.id,
            outcome: {
              in: ['PLACED', 'FINAL_ROUND_REJECT']
            }
          },
          select: {
            outcome: true
          }
        })

        return {
          ...company,
          placedCount: experiences.filter(e => e.outcome === 'PLACED').length,
          finalRoundRejectCount: experiences.filter(e => e.outcome === 'FINAL_ROUND_REJECT').length,
          totalExperiences: company._count.experiences
        }
      })
    )

    return NextResponse.json(companiesWithStats)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST - Add company (only students with PLACED or FINAL_ROUND_REJECT)
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, logo, website, industry, description, outcome } = body

    // Validation
    if (!name || !outcome) {
      return NextResponse.json(
        { error: 'Company name and outcome are required' },
        { status: 400 }
      )
    }

    // Verify outcome is valid
    if (!['PLACED', 'FINAL_ROUND_REJECT'].includes(outcome)) {
      return NextResponse.json(
        { error: 'Only students who got placed or rejected in final round can add companies' },
        { status: 403 }
      )
    }

    // Check if user is a student
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || dbUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can add companies' },
        { status: 403 }
      )
    }

    // Check if company already exists
    const existing = await prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Company already exists', company: existing },
        { status: 409 }
      )
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        logo: logo || null,
        website: website || null,
        industry: industry || null,
        description: description || null,
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
