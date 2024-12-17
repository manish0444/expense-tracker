import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import nodemailer from 'nodemailer'
import { formatDate, formatCurrency } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { Expense } from '@/types/expense'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, period } = await req.json()

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        ...(period && {
          date: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - parseInt(period)))
          }
        })
      },
      orderBy: { date: 'desc' }
    }) as Expense[]

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })

    const expenseList = expenses.map(expense => 
      `${formatDate(expense.date)} - ${expense.description} - ${formatCurrency(expense.amount)}`
    ).join('\n')

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Expense Report ${period ? `(Last ${period} months)` : ''}`,
      text: `Here are your expenses:\n\n${expenseList}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}