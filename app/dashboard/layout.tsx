import Navigation from '@/components/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-apple-lightgray dark:bg-apple-darkgray transition-colors duration-300">
      <Navigation />
      <main className="pt-[44px]">
        <div className="max-w-[980px] mx-auto px-6 py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
