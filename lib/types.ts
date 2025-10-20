export interface CompanyWithStats {
  id: string
  name: string
  logo: string | null
  website: string | null
  industry: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
  createdById: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  placementData: Array<{
    id: string
    companyId: string
    year: number
    role: string
    minPackage: number
    maxPackage: number
    avgPackage: number
    studentsPlaced: number
    createdAt: Date
  }>
  experiences: Array<{
    id: string
    outcome: string
    year: number
  }>
  _count: {
    experiences: number
    deadlines: number
  }
  placedCount: number
  finalRoundRejectCount: number
  totalExperiences: number
}
