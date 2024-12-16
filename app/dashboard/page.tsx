import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { DashboardHeader } from '@/components/dashboard-header'
import { ExpenseEntry } from '@/components/expense-entry'
import { ExpenseList } from '@/components/expense-list'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { ExportOptions } from '@/components/export-options'
import { Notifications } from '@/components/notifications'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ExpenseEntry />
          <AnalyticsDashboard />
          <ExportOptions />
        </div>
        <ExpenseList />
      </main>
      <Notifications />
    </div>
  )
}

