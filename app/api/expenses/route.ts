import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'
import { authOptions } from '@/app/api/auth/auth.config'
import { checkBudgetAndNotify } from '@/lib/budget-monitor'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    // Get or create user
    let user = await User.findOne({ email: session.user.email })
    if (!user) {
      user = await User.create({ 
        email: session.user.email,
        isPro: false,
        expenseCount: 0,
        lastResetDate: new Date()
      })
    }

    // Check if free tier user has exceeded monthly limit
    if (!user.isPro) {
      const currentDate = new Date()
      const lastReset = new Date(user.lastResetDate)
      
      // Reset count if it's a new month
      if (currentDate.getMonth() !== lastReset.getMonth() || 
          currentDate.getFullYear() !== lastReset.getFullYear()) {
        user.expenseCount = 0
        user.lastResetDate = currentDate
        await user.save()
      }
      
      // Check limit
      if (user.expenseCount >= 3) {
        return NextResponse.json(
          { error: 'Free tier limit reached. Upgrade to Pro for unlimited entries.' },
          { status: 403 }
        )
      }
    }

    const data = await req.json()
    const expense = await Expense.create({
      ...data,
      userId: session.user.email
    })

    // Increment expense count for free tier users
    if (!user.isPro) {
      user.expenseCount += 1
      await user.save()
    }

    // After saving the expense, check budget and notify if needed
    const allExpenses = await Expense.find({ userId: session.user.email })
    await checkBudgetAndNotify(user, allExpenses)

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating expense' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const category = searchParams.get('category')

    const query: any = { userId: session.user.email }

    // Add search filter
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    // Add date filter
    if (from || to) {
      query.date = {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    // Add category filter
    if (category) {
      query.category = category
    }

    const skip = (page - 1) * limit

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments(query)
    ])

    return NextResponse.json({
      expenses,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Error fetching expenses' }, { status: 500 })
  }
} 