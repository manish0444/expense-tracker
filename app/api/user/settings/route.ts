import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/user'
import { authOptions } from '@/app/api/auth/auth.config'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    let user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      user = await User.create({
        email: session.user.email,
        name: session.user.name,
        monthlyBudget: 10000,
        isPro: false
      })
    }

    console.log('GET settings - User found:', user)
    return NextResponse.json({
      monthlyBudget: user.monthlyBudget,
      isPro: user.isPro
    })

  } catch (error) {
    console.error('Error in GET settings:', error)
    return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    console.log('PUT settings - Received data:', data)

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is trying to change budget
    if ('monthlyBudget' in data && data.monthlyBudget !== user.monthlyBudget) {
      // If not pro and already used 3 changes, reject
      if (!user.isPro && user.budgetChangeCount >= 3) {
        return NextResponse.json({ 
          error: 'Free users can only change budget 3 times. Upgrade to Pro for unlimited changes.',
          code: 'BUDGET_CHANGE_LIMIT'
        }, { status: 403 })
      }

      // Increment budget change count for non-pro users
      if (!user.isPro) {
        user.budgetChangeCount += 1
        user.lastBudgetChangeDate = new Date()
      }
    }

    const monthlyBudget = Number(data.monthlyBudget)
    if (isNaN(monthlyBudget) || monthlyBudget < 0) {
      return NextResponse.json({ error: 'Invalid monthly budget' }, { status: 400 })
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          monthlyBudget: monthlyBudget,
          budgetChangeCount: user.budgetChangeCount,
          lastBudgetChangeDate: user.lastBudgetChangeDate,
          name: session.user.name,
          email: session.user.email
        }
      },
      { new: true }
    )

    return NextResponse.json({
      monthlyBudget: updatedUser.monthlyBudget,
      isPro: updatedUser.isPro,
      budgetChangeCount: updatedUser.budgetChangeCount,
      remainingChanges: updatedUser.isPro ? 'unlimited' : (3 - updatedUser.budgetChangeCount)
    })

  } catch (error) {
    console.error('Error in PUT settings:', error)
    return NextResponse.json({ error: 'Error updating settings' }, { status: 500 })
  }
} 