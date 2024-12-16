'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

// Mock data - in a real application, this would come from your backend
const pieData = {
  labels: ['Food', 'Bills', 'Entertainment', 'Other'],
  datasets: [
    {
      data: [300, 500, 200, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }
  ]
}

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Monthly Expenses',
      data: [650, 590, 800, 810, 560, 550],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
}

export function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Expenses by Category</h3>
            <Pie data={pieData} />
          </div>
          <div>
            <h3 className="text-lg font-medium">Monthly Expenses</h3>
            <Line data={lineData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

