import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const deadlines = await prisma.deadline.findMany({
      where: {
        deadline: {
          gte: new Date()
        }
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      },
      orderBy: { deadline: 'asc' }
    })

    return NextResponse.json(deadlines)
  } catch (error) {
    console.error('Error fetching deadlines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deadlines' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can add deadlines
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { companyId, title, description, deadline, link } = body

    if (!companyId || !title || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newDeadline = await prisma.deadline.create({
      data: {
        companyId,
        title,
        description: description || null,
        deadline: new Date(deadline),
        link: link || null
      },
      include: {
        company: true
      }
    })

    return NextResponse.json(newDeadline, { status: 201 })
  } catch (error) {
    console.error('Error creating deadline:', error)
    return NextResponse.json(
      { error: 'Failed to create deadline' },
      { status: 500 }
    )
  }
}
