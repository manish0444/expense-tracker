import { sendEmail } from './email'
import { emailTemplates } from './email-templates'

export class NotificationService {
  static async sendAccountUpdate(user: any, updateType: string) {
    if (!user.settings?.emailNotifications) return

    try {
      await sendEmail({
        to: user.email,
        ...emailTemplates.accountUpdate(user.name || 'User', updateType)
      })
    } catch (error) {
      console.error('Failed to send account update notification:', error)
    }
  }

  static async sendBudgetAlert(user: any, currentSpending: number, budget: number) {
    if (!user.settings?.budgetAlerts) return

    const percentage = Math.round((currentSpending / budget) * 100)
    if (percentage < 80) return // Only alert at 80% or higher

    try {
      await sendEmail({
        to: user.email,
        ...emailTemplates.budgetAlert(
          user.name || 'User',
          currentSpending,
          budget,
          percentage
        )
      })
    } catch (error) {
      console.error('Failed to send budget alert:', error)
    }
  }
} 