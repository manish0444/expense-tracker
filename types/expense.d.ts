export interface Expense {
  id: string
  amount: number
  description: string
  date: Date
  category: string
  isRecurring: boolean
  recurringFrequency?: string
  recurringEndDate?: Date
  paymentMethod?: string
  tags: string[]
  location?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}
