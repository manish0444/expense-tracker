export interface BudgetPlan {
  category: string
  currentSpend: number
  recommendedBudget: number
  adjustmentReason: string
  savingPotential: number
  monthlyTarget: number
  weeklyAllowance: number
  confidence: number
  tips: string[]
}

export interface ExpensePattern {
  pattern: string
  frequency: 'daily' | 'weekly' | 'monthly'
  averageAmount: number
  impact: 'positive' | 'negative' | 'neutral'
  description: string
  recommendation: string
  riskLevel: 'low' | 'medium' | 'high'
  relatedCategories: string[]
  detectedDates: string[]
  confidence: number
} 