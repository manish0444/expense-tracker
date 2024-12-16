import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/user'
import { sendEmail } from '@/lib/email'
import { authOptions } from '@/app/api/auth/auth.config'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = await req.json()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Handle different notification types
    switch (type) {
      case 'budget_alert':
        if (user.settings?.budgetAlerts) {
          await sendBudgetAlert(user, data)
        }
        break
      case 'account_update':
        if (user.settings?.emailNotifications) {
          await sendAccountUpdate(user, data)
        }
        break
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

async function sendBudgetAlert(user: any, data: any) {
  const { currentSpending, budget, percentage } = data
  await sendEmail({
    to: user.email,
    subject: 'Budget Alert',
    html: `
      <h2>Budget Alert</h2>
      <p>You've reached ${percentage}% of your monthly budget.</p>
      <p>Current spending: ${currentSpending}</p>
      <p>Monthly budget: ${budget}</p>
    `
  })
}

async function sendAccountUpdate(user: any, data: any) {
  const { type, details } = data
  await sendEmail({
    to: user.email,
    subject: `Account Update: ${type}`,
    html: `
      <h2>Account Update</h2>
      <p>${details}</p>
    `
  })
} 