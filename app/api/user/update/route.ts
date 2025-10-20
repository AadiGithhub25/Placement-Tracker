import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, rollNumber, department, graduationYear } = body

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
        rollNumber: rollNumber || undefined,
        department: department || undefined,
        graduationYear: graduationYear ? parseInt(graduationYear) : undefined
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        rollNumber: true,
        department: true,
        graduationYear: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
