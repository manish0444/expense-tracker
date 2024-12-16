import mongoose, { Model } from 'mongoose'

// Define the expense schema
const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'], 
    default: 'monthly' 
  },
  recurringEndDate: { type: Date },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'credit', 'debit', 'bank_transfer', 'mobile_payment', 'other'],
    default: 'cash'
  },
  tags: [String],
  location: String,
  attachments: [String], // URLs to receipts/documents
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Add expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Insurance',
  'Housing',
  'Education',
  'Travel',
  'Personal Care',
  'Gifts & Donations',
  'Investments',
  'Business',
  'Taxes',
  'Subscriptions',
  'Hobbies',
  'Pets',
  'Family',
  'Other'
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

// Add payment methods
export const PAYMENT_METHODS = [
  'cash',
  'credit',
  'debit',
  'bank_transfer',
  'mobile_payment',
  'other'
] as const

export type PaymentMethod = typeof PAYMENT_METHODS[number]

// Add indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 })
expenseSchema.index({ userId: 1, category: 1 })
expenseSchema.index({ userId: 1, isRecurring: 1 })

// Add middleware to update timestamps
expenseSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Define the Expense type
export interface IExpense {
  _id: string
  userId: string
  amount: number
  description: string
  category: ExpenseCategory
  date: Date
  isRecurring: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurringEndDate?: Date
  paymentMethod: PaymentMethod
  tags: string[]
  location?: string
  attachments?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Define the Expense model type
interface ExpenseModel extends Model<IExpense> {}

// Check if the model exists before creating a new one
let Expense: ExpenseModel

try {
  // Try to get the existing model
  Expense = mongoose.model<IExpense, ExpenseModel>('Expense')
} catch {
  // If the model doesn't exist, create it
  Expense = mongoose.model<IExpense, ExpenseModel>('Expense', expenseSchema)
}

export { Expense } 