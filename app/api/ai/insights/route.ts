import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'
import { authOptions } from '@/app/api/auth/auth.config'
import { generateInsights } from '@/lib/gemini'
import { Recommendation } from '@/models/recommendation'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user?.isPro) {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 })
    }

    // Fetch user's expenses
    const expenses = await Expense.find({ userId: session.user.email })
    
    // Prepare data for AI analysis
    const expenseData = {
      expenses,
      monthlyBudget: user.monthlyBudget || 0,
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      categories: Array.from(new Set(expenses.map(exp => exp.category))),
      monthlyTrend: calculateMonthlyTrend(expenses),
      topCategories: calculateTopCategories(expenses),
      recentExpenses: expenses.slice(0, 10)
    }

    console.log('Generating insights for data:', {
      expenseCount: expenses.length,
      monthlyBudget: expenseData.monthlyBudget,
      categories: expenseData.categories.length
    })

    // Generate AI insights
    const insights = await generateInsights(expenseData)

    // Save recommendations to database
    if (insights.recommendations?.length > 0) {
      await Recommendation.deleteMany({ userId: session.user.email }) // Clear old recommendations
      await Recommendation.insertMany(
        insights.recommendations.map(rec => ({
          ...rec,
          userId: session.user?.email
        }))
      )
    }

    return NextResponse.json(insights)
  } catch (error: any) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json({ 
      error: error.message || 'Error generating insights',
      recommendations: [],
      recommendationStats: { total: 0, completed: 0, pending: 0 },
      totalSaved: 0,
      potentialSavings: 0,
      topExpenseCategory: 'Error loading data',
      unusualExpenses: [],
      savingOpportunities: []
    })
  }
}

function calculateMonthlyTrend(expenses: any[]) {
  // Group expenses by month and calculate totals
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    acc[key] = (acc[key] || 0) + exp.amount
    return acc
  }, {})

  return Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
}

function calculateTopCategories(expenses: any[]) {
    const categoryTotals = expenses.reduce<Record<string, number>>((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})
  
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ 
        category, 
        total: total as number 
      }))
      .sort((a, b) => (b.total as number) - (a.total as number))
      .slice(0, 5)
  }