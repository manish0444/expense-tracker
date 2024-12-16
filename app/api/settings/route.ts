import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/user'
import { authOptions } from '@/app/api/auth/auth.config'
import { NotificationService } from '@/lib/notification-service'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      isPro: user.isPro || false,
      monthlyBudget: user.monthlyBudget || 0,
      currency: user.settings?.currency || 'USD',
      language: user.settings?.language || 'en',
      theme: user.settings?.theme || 'light',
      emailNotifications: user.settings?.emailNotifications || false,
      budgetAlerts: user.settings?.budgetAlerts || false,
      twoFactorEnabled: user.settings?.twoFactorEnabled || false
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    await connectToDatabase()

    // Find user and current settings
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure settings object exists
    if (!user.settings) {
      user.settings = {}
    }

    // Update settings
    const updatedSettings = {
      ...user.settings,
      ...updates
    }

    // Save to database
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          settings: updatedSettings,
          ...(updates.monthlyBudget !== undefined && { monthlyBudget: updates.monthlyBudget })
        } 
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      throw new Error('Failed to update settings')
    }

    // Return complete settings object
    const response = {
      isPro: updatedUser.isPro || false,
      monthlyBudget: updatedUser.monthlyBudget || 0,
      currency: updatedUser.settings?.currency || 'USD',
      language: updatedUser.settings?.language || 'en',
      theme: updatedUser.settings?.theme || 'light',
      emailNotifications: Boolean(updatedUser.settings?.emailNotifications),
      budgetAlerts: Boolean(updatedUser.settings?.budgetAlerts),
      twoFactorEnabled: Boolean(updatedUser.settings?.twoFactorEnabled)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 