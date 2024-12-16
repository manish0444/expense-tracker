import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { User } from '@/models/user'
import { sendEmail } from '@/lib/email'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Log after getting session
    console.log('Test email route triggered', {
      userEmail: session?.user?.email,
      emailServerUser: process.env.EMAIL_SERVER_USER,
      emailServerHost: process.env.EMAIL_SERVER_HOST
    })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Found user:', {
      email: user.email,
      hasSettings: !!user.settings,
      emailNotifications: user.settings?.emailNotifications
    })

    // Send a test email with enhanced error handling
    try {
      await sendEmail({
        to: user.email,
        subject: 'Test Email - Expense Tracker',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4F46E5;">Test Email</h2>
            <p>Hi ${user.email},</p>
            <p>This is a test email to confirm your notification settings are working correctly.</p>
            <p>If you received this email, your email notifications are properly configured!</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This is a test email from your Expense Tracker application.
              </p>
            </div>
          </div>
        `
      })

      console.log('Test email sent successfully')
      return NextResponse.json({ success: true })

    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test email route error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 