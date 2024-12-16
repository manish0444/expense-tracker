import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'
import { authOptions } from '@/app/api/auth/auth.config'
import { analyzeExpenses } from '@/lib/gemini'

export async function POST(req: Request) {
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

    const { question } = await req.json()
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // Fetch user's expenses
    const expenses = await Expense.find({ userId: session.user.email })
    if (!expenses.length) {
      return NextResponse.json({ 
        analysis: "I don't see any expenses recorded yet. Start by adding some expenses, and I'll help you analyze your spending patterns!" 
      })
    }
    
    // Prepare data for analysis
    const expenseData = {
      expenses: expenses,
      monthlyBudget: user.monthlyBudget,
      categories: Array.from(new Set(expenses.map(exp => exp.category))),
      totalSpent: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      averageDaily: calculateDailyAverage(expenses),
      topCategories: calculateTopCategories(expenses).map(cat => ({
        category: cat.category,
        total: Number(cat.total)
      }))
    }

    console.log('Expense data being sent to AI:', expenseData)

    // Get AI analysis
    const analysis = await analyzeExpenses(question, expenseData)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Error analyzing expenses:', error)
    return NextResponse.json({ 
      error: error.message || 'Error analyzing expenses' 
    }, { status: 500 })
  }
}

function calculateDailyAverage(expenses: any[]) {
  const today = new Date()
  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()
  
  const monthlyExpenses = expenses.filter(exp => {
    const date = new Date(exp.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  })

  const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  return total / today.getDate()
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