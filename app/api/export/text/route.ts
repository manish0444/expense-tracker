import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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

    const { period } = await req.json()

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

    const content = expenses.map(expense => 
      `${formatDate(expense.date)} - ${expense.description} - ${formatCurrency(expense.amount)}`
    ).join('\n')

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="expenses_${period || 'all'}.txt"`
      }
    })
  } catch (error) {
    console.error('Error exporting expenses:', error)
    return NextResponse.json({ error: 'Failed to export expenses' }, { status: 500 })
  }
}