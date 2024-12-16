import { User } from '@/models/user'
import { sendEmail } from '@/lib/email'
import { generateInsights } from '@/lib/gemini'
import { formatCurrency } from './utils'

export async function checkBudgetAndNotify(user: any, expenses: any[]) {
  if (!user.settings?.budgetAlerts) return

  const monthlyBudget = user.monthlyBudget
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Filter current month's expenses
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
  })

  const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budgetPercentage = (totalSpent / monthlyBudget) * 100

  // Get AI insights for personalized recommendations
  const expenseData = {
    expenses: currentMonthExpenses,
    monthlyBudget,
    totalSpent,
    categories: Array.from(new Set(currentMonthExpenses.map(exp => exp.category)))
  }

  const insights = await generateInsights(expenseData)

  // Determine notification triggers
  const triggers = [
    {
      condition: budgetPercentage >= 80,
      subject: '⚠️ Budget Alert: Approaching Monthly Limit',
      message: `You've used ${budgetPercentage.toFixed(1)}% of your monthly budget`
    },
    {
      condition: totalSpent > monthlyBudget,
      subject: '🚨 Budget Alert: Monthly Budget Exceeded',
      message: `You've exceeded your monthly budget by ${formatCurrency(totalSpent - monthlyBudget)}`
    },
    {
      condition: hasUnusualSpending(currentMonthExpenses),
      subject: '📊 Unusual Spending Pattern Detected',
      message: 'We noticed some unusual spending patterns in your expenses'
    }
  ]

  for (const trigger of triggers) {
    if (trigger.condition) {
      await sendBudgetAlert(user, {
        subject: trigger.subject,
        message: trigger.message,
        totalSpent,
        monthlyBudget,
        insights
      })
    }
  }
}

interface Recommendation {
  text: string;
  // Add other properties if needed
}

async function sendBudgetAlert(user: any, data: any) {
  const { subject, message, totalSpent, monthlyBudget, insights } = data

  await sendEmail({
    to: user.email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">${subject}</h2>
        <p>Hi ${user.email},</p>
        <p>${message}</p>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Current Status</h3>
          <p>Monthly Budget: ${formatCurrency(monthlyBudget)}</p>
          <p>Total Spent: ${formatCurrency(totalSpent)}</p>
          <p>Remaining: ${formatCurrency(monthlyBudget - totalSpent)}</p>
        </div>

        <div style="margin-top: 20px;">
          <h3>AI Recommendations</h3>
          ${insights.recommendations.map((rec: Recommendation) => `
            <div style="margin-bottom: 10px; padding: 10px; background: #f3f4f6; border-radius: 4px;">
              ${rec.text}
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            You received this email because you enabled budget alerts. 
            You can manage your notification settings in your account preferences.
          </p>
        </div>
      </div>
    `
  })
}

function hasUnusualSpending(expenses: any[]): boolean {
  // Implement logic to detect unusual spending patterns
  // For example: sudden large expenses, multiple expenses in same category, etc.
  return false // Placeholder
} 