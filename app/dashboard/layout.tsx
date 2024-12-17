import { DashboardNav } from '@/components/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      <DashboardNav />
      <main className="md:pl-72">
        <div className="container mx-auto p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}