'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useTranslation } from '@/lib/translations'
import { MoneyIcon } from '@/components/ui/money-icon'
import { useSettings } from '@/contexts/settings-context'
import { toast } from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface Expense {
  _id: string
  amount: number
  category: string
  date: string
}

export function AnalyticsDashboard() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const { settings } = useSettings()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [settings.monthlyBudget])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses?limit=1000')
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data.expenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const monthlyExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === thisMonth && 
           expenseDate.getFullYear() === thisYear
  }) || []
  
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Calculate daily average based on days passed in current month
  const today = new Date()
  const dayOfMonth = today.getDate()
  const averageDaily = monthlyTotal / dayOfMonth
  
  const budgetLeft = settings.monthlyBudget - monthlyTotal
  const budgetPercentage = ((budgetLeft / settings.monthlyBudget) * 100).toFixed(1)

  // Prepare chart data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return date
  }).reverse()

  const monthlyData = last6Months.map(date => {
    const month = date.getMonth()
    const year = date.getFullYear()
    return expenses?.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year
    }).reduce((sum, expense) => sum + expense.amount, 0) || 0
  })

  // Category data
  const categories = Array.from(new Set(expenses?.map(expense => expense.category) || []))
  const categoryTotals = categories.map(category => ({
    category,
    total: expenses?.filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0) || 0
  }))
  .sort((a, b) => b.total - a.total)

  const expenseData = {
    labels: last6Months.map(date => date.toLocaleString('default', { month: 'short' })),
    datasets: [{
      label: 'Monthly Expenses',
      data: monthlyData,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  }

  const categoryData = {
    labels: categoryTotals.map(c => c.category),
    datasets: [{
      label: 'Expenses by Category',
      data: categoryTotals.map(c => c.total),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  if (loading) {
    return <div className="p-4 text-center">Loading analytics...</div>
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  // Get last month's total for comparison
  const lastMonth = new Date(thisYear, thisMonth - 1)
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === lastMonth.getMonth() && 
           expenseDate.getFullYear() === lastMonth.getFullYear()
  })
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyChange = getPercentageChange(monthlyTotal, lastMonthTotal)

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <MoneyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">All time total</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</div>
            <p className={`text-xs ${monthlyChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <MoneyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageDaily)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {dayOfMonth} days this month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Left</CardTitle>
            <MoneyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetLeft)}</div>
            <p className={`text-xs ${budgetLeft < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {budgetPercentage}% of monthly budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('expenseTrend')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] max-h-[300px] w-full">
            <Line data={{
              ...expenseData,
              datasets: [{
                ...expenseData.datasets[0],
                label: t('monthlyExpenses')
              }]
            }} options={options} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('topCategories')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] max-h-[300px] w-full">
            <Bar data={{
              ...categoryData,
              datasets: [{
                ...categoryData.datasets[0],
                label: t('expensesByCategory')
              }]
            }} options={options} />
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTotals.map(({ category, total }) => (
              <div key={category} className="flex justify-between items-center p-2 rounded-lg border">
                <span className="font-medium truncate max-w-[150px]">{category}</span>
                <span className="ml-2">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}