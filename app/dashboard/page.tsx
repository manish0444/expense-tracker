import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { ExpenseList } from '@/components/expense-list'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Your expense overview and analytics.
        </p>
      </div>
      <AnalyticsDashboard />
      <ExpenseList limit={5} showViewAll />
    </div>
  )
}

