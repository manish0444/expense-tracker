import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isPro: { type: Boolean, default: false },
  monthlyBudget: { type: Number, default: 0 },
  settings: {
    emailNotifications: { type: Boolean, default: false },
    budgetAlerts: { type: Boolean, default: false },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' }
  }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
})

userSchema.pre('save', function(next) {
  if (!this.settings) {
    this.settings = {
      emailNotifications: false,
      budgetAlerts: false,
      currency: 'USD',
      language: 'en',
      theme: 'light'
    }
  }
  next()
})

export const User = mongoose.models.User || mongoose.model('User', userSchema) 