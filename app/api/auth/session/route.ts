import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    if (!tokenMatch) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const token = tokenMatch[1]
    const payload = await verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        rollNumber: true,
        department: true,
        graduationYear: true,
      },
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
