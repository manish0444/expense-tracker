export const emailTemplates = {
  accountUpdate: (userName: string, updateType: string) => ({
    subject: `Account Update: ${updateType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Account Update</h2>
        <p>Hi ${userName},</p>
        <p>Your account has been updated: ${updateType}</p>
        <p>If you didn't make this change, please contact support immediately.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `
  }),

  budgetAlert: (userName: string, currentSpending: number, budget: number, percentage: number) => ({
    subject: 'Budget Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Budget Alert</h2>
        <p>Hi ${userName},</p>
        <p>You've reached ${percentage}% of your monthly budget.</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p>Current spending: $${currentSpending.toFixed(2)}</p>
          <p>Monthly budget: $${budget.toFixed(2)}</p>
        </div>
        <p>Consider reviewing your expenses to stay within your budget.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            You received this email because you enabled budget alerts.
          </p>
        </div>
      </div>
    `
  })
} 