// @ts-nocheck
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get overall stats
    const [
      totalCompanies,
      totalExperiences,
      totalStudents,
      placedStudents,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.interviewExperience.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.interviewExperience.count({ where: { outcome: 'PLACED' } }),
    ])

    // Get placement data with packages
    const placementData = await prisma.interviewExperience.findMany({
      where: {
        outcome: 'PLACED',
        packageOffered: { not: null },
      },
      select: {
        packageOffered: true,
        year: true,
        company: {
          select: {
            name: true,
            industry: true,
          },
        },
      },
    })

    // Calculate average package
    const avgPackage = placementData.length > 0
      ? (placementData.reduce((sum, p) => sum + (p.packageOffered || 0), 0) / placementData.length).toFixed(2)
      : 0

    // Get top companies by placements
    const topCompanies = await prisma.company.findMany({
      include: {
        experiences: {
          where: { outcome: 'PLACED' },
          select: { id: true, packageOffered: true },
        },
      },
    })

    const companiesWithStats = topCompanies
      .map(company => ({
        name: company.name,
        placementCount: company.experiences.length,
        avgPackage: company.experiences.length > 0
          ? (company.experiences.reduce((sum, e) => sum + (e.packageOffered || 0), 0) / company.experiences.length).toFixed(2)
          : 0,
      }))
      .filter(c => c.placementCount > 0)
      .sort((a, b) => b.placementCount - a.placementCount)
      .slice(0, 10)

    // Get placement trends by year
    const placementsByYear = await prisma.interviewExperience.groupBy({
      by: ['year', 'outcome'],
      _count: true,
      where: {
        year: { gte: new Date().getFullYear() - 3 },
      },
    })

    const yearlyData: any = {}
    placementsByYear.forEach(item => {
      if (!yearlyData[item.year]) {
        yearlyData[item.year] = { year: item.year, placed: 0, rejected: 0, total: 0 }
      }
      if (item.outcome === 'PLACED') {
        yearlyData[item.year].placed = item._count
      }
      yearlyData[item.year].total += item._count
    })

    const trends = Object.values(yearlyData)

    // Get package distribution
    const packageRanges = [
      { label: '< 5 LPA', min: 0, max: 5, count: 0 },
      { label: '5-10 LPA', min: 5, max: 10, count: 0 },
      { label: '10-15 LPA', min: 10, max: 15, count: 0 },
      { label: '15-20 LPA', min: 15, max: 20, count: 0 },
      { label: '> 20 LPA', min: 20, max: Infinity, count: 0 },
    ]

    placementData.forEach(p => {
      const pkg = p.packageOffered || 0
      const range = packageRanges.find(r => pkg >= r.min && pkg < r.max)
      if (range) range.count++
    })

    // Get industry-wise distribution
    const industryStats = await prisma.company.groupBy({
      by: ['industry'],
      _count: true,
    })

    const industries = industryStats
      .filter(i => i.industry)
      .map(i => ({
        name: i.industry,
        count: i._count,
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      overview: {
        totalCompanies,
        totalExperiences,
        totalStudents,
        placedStudents,
        avgPackage,
        placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0,
      },
      topCompanies: companiesWithStats,
      trends,
      packageDistribution: packageRanges,
      industries,
      recentPlacements: placementData.slice(0, 10),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
