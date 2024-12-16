import { GoogleGenerativeAI } from '@google/generative-ai'
import { BudgetPlan, ExpensePattern } from '@/types/ai-features'

interface TopCategory {
  category: string;
  total: number;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

// Context for the AI to understand the app's purpose
const SYSTEM_CONTEXT = `You are an AI Financial Assistant for an expense tracking application. 
You help users understand their spending patterns, provide financial advice, and suggest ways to save money.
You have access to their expense data and can analyze patterns and trends.
Always be specific, practical, and data-driven in your responses.
Format currency values appropriately and be precise with numbers.
Consider monthly budgets, expense categories, and spending trends in your analysis.`

export async function analyzeExpenses(
  question: string,
  expenseData: {
    expenses: any[]
    monthlyBudget: number
    categories: string[]
    totalSpent: number
    averageDaily: number
    topCategories: { category: string; total: number }[]
  }
) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured')
    }

    // Format the expense data for better context
    const context = `
      Current Monthly Budget: ${formatCurrency(expenseData.monthlyBudget)}
      Total Spent This Month: ${formatCurrency(expenseData.totalSpent)}
      Daily Average: ${formatCurrency(expenseData.averageDaily)}
      Top Spending Categories: ${expenseData.topCategories
        .map(c => `${c.category}: ${formatCurrency(c.total)}`)
        .join(', ')}
      
      Recent Expenses: ${expenseData.expenses
        .slice(0, 5)
        .map(e => `${formatDate(e.date)} - ${e.category}: ${formatCurrency(e.amount)}`)
        .join(', ')}
    `

    console.log('Sending prompt to Gemini:', {
      context,
      question
    })

    const prompt = `${SYSTEM_CONTEXT}\n\nContext:\n${context}\n\nUser Question: ${question}\n\nProvide a detailed, specific answer based on the data provided:`

    const result = await model.generateContent(prompt)
    if (!result) {
      throw new Error('No response from Gemini API')
    }

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('Empty response from Gemini API')
    }

    console.log('Gemini Response:', text)

    return text
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    throw new Error(`Failed to analyze expenses: ${error.message}`)
  }
}

export async function generateInsights(expenseData: any) {
  try {
    if (!expenseData.expenses || expenseData.expenses.length === 0) {
      return {
        totalSaved: 0,
        potentialSavings: 0,
        topExpenseCategory: 'No expenses yet',
        unusualExpenses: [],
        recommendations: [
          {
            id: '1',
            text: 'Start by adding your first expense to get personalized recommendations',
            category: 'Getting Started',
            completed: false,
            impact: 1
          }
        ],
        recommendationStats: {
          total: 1,
          completed: 0,
          pending: 1
        },
        monthOverMonthGrowth: 0,
        predictedExpenses: 0,
        savingOpportunities: [],
        insights: ['Start tracking your expenses to get AI-powered insights'],
        budgetPlans: [{
          category: 'Getting Started',
          currentSpend: 0,
          recommendedBudget: 0,
          adjustmentReason: 'Start tracking your expenses',
          savingPotential: 0,
          monthlyTarget: 0,
          weeklyAllowance: 0,
          confidence: 0,
          tips: [
            'Add your first expense',
            'Set a monthly budget goal',
            'Categorize your expenses'
          ]
        }],
        expensePatterns: [{
          pattern: 'No patterns yet',
          frequency: 'monthly',
          averageAmount: 0,
          impact: 'neutral',
          description: 'Start tracking expenses to discover patterns',
          recommendation: 'Add your daily expenses regularly',
          riskLevel: 'low',
          relatedCategories: [],
          detectedDates: [],
          confidence: 0
        }]
      }
    }

    // Calculate actual insights
    const monthlyTotals = calculateMonthlyTotals(expenseData.expenses)
    const averageMonthlySpend = calculateAverageMonthlySpend(monthlyTotals)
    const currentMonthTotal = calculateCurrentMonthTotal(expenseData.expenses)
    const savings = averageMonthlySpend > currentMonthTotal ? averageMonthlySpend - currentMonthTotal : 0
    const topCategory = expenseData.topCategories[0]
    const potentialSavings = identifyPotentialSavings(expenseData)

    const prompt = `${SYSTEM_CONTEXT}
    Analyze this financial data and provide 3-5 specific, actionable recommendations:
    Monthly Budget: ${formatCurrency(expenseData.monthlyBudget)}
    Current Month Spending: ${formatCurrency(currentMonthTotal)}
    Average Monthly Spending: ${formatCurrency(averageMonthlySpend)}
    Top Categories: ${expenseData.topCategories.map((c: TopCategory) => `${c.category}: ${formatCurrency(c.total)}`).join(', ')}

    Format each recommendation as a bullet point (•) and make them specific and actionable.
    Focus on:
    1. Immediate saving opportunities
    2. Spending habit improvements
    3. Budget optimization
    4. Category-specific advice`

    const result = await model.generateContent(prompt)
    if (!result) {
      throw new Error('No response from AI')
    }

    const response = await result.response
    const text = response.text()

    // Generate recommendations with IDs
    const recommendations = text
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map((line, index) => ({
        id: `rec_${Date.now()}_${index}`,
        text: line.replace('•', '').trim(),
        category: categorizeRecommendation(line),
        completed: false,
        impact: estimateImpact(line)
      }))
      .slice(0, 5)

    // Generate budget plans
    const budgetPlans = await generateBudgetPlans(expenseData)
    
    return {
      totalSaved: savings,
      potentialSavings: potentialSavings.total,
      topExpenseCategory: topCategory?.category || 'No expenses yet',
      unusualExpenses: identifyUnusualExpenses(expenseData.expenses),
      recommendations,
      recommendationStats: {
        total: recommendations.length,
        completed: 0,
        pending: recommendations.length
      },
      monthOverMonthGrowth: calculateMoMGrowth(monthlyTotals),
      predictedExpenses: predictNextMonthExpenses(monthlyTotals),
      savingOpportunities: potentialSavings.opportunities,
      insights: text.split('\n\n'),
      budgetPlans: await generateBudgetPlans(expenseData)
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('Failed to generate insights')
  }
}

// Helper functions for calculations
function calculateMonthlyTotals(expenses: any[]) {
  return expenses.reduce((acc, exp) => {
    const date = new Date(exp.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    acc[key] = (acc[key] || 0) + exp.amount
    return acc
  }, {})
}

function calculateAverageMonthlySpend(monthlyTotals: Record<string, number>) {
  const totals = Object.values(monthlyTotals)
  return totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : 0
}

function calculateCurrentMonthTotal(expenses: any[]) {
  const now = new Date()
  return expenses
    .filter(exp => {
      const date = new Date(exp.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, exp) => sum + exp.amount, 0)
}

function identifyPotentialSavings(expenseData: any) {
  const opportunities = []
  let total = 0

  // Check for high-spending categories
  for (const category of expenseData.topCategories) {
    const avgSpend = category.total / 3 // Assuming 3 months of data
    const potentialSaving = calculatePotentialSaving(category, avgSpend)
    
    if (potentialSaving.amount >= 50) { // Only suggest significant savings
      opportunities.push({
        category: category.category,
        amount: Math.round(potentialSaving.amount),
        suggestion: potentialSaving.suggestion,
        details: potentialSaving.details,
        difficulty: potentialSaving.difficulty,
        impact: potentialSaving.impact
      })
      total += potentialSaving.amount
    }
  }

  // Add general savings opportunities
  const generalOpportunities = generateGeneralOpportunities(expenseData)
  opportunities.push(...generalOpportunities)
  total += generalOpportunities.reduce((sum, opp) => sum + opp.amount, 0)

  return {
    total: Math.round(total),
    opportunities: opportunities.sort((a, b) => b.amount - a.amount)
  }
}

function calculatePotentialSaving(category: any, avgSpend: number) {
  const savingsByCategory: Record<string, {
    percentage: number,
    suggestion: string,
    details: string[],
    difficulty: number
  }> = {
    'Food & Dining': {
      percentage: 0.3,
      suggestion: 'Optimize your food spending with meal planning and smart shopping',
      details: [
        'Plan meals weekly to reduce food waste',
        'Buy groceries in bulk when on sale',
        'Cook meals at home instead of eating out'
      ],
      difficulty: 2
    },
    'Shopping': {
      percentage: 0.25,
      suggestion: 'Implement strategic shopping habits to reduce unnecessary expenses',
      details: [
        'Use price comparison tools',
        'Wait for sales on non-essential items',
        'Implement a 24-hour rule for purchases'
      ],
      difficulty: 1
    },
    'Entertainment': {
      percentage: 0.35,
      suggestion: 'Find more cost-effective entertainment options',
      details: [
        'Look for free local events',
        'Use entertainment passes and memberships',
        'Share subscription services with family'
      ],
      difficulty: 1
    },
    'Transportation': {
      percentage: 0.20,
      suggestion: 'Optimize your transportation costs',
      details: [
        'Use public transportation when possible',
        'Combine errands to save fuel',
        'Consider carpooling options'
      ],
      difficulty: 2
    }
  }

  const defaultSaving = {
    percentage: 0.15,
    suggestion: 'Review and optimize spending in this category',
    details: [
      'Track expenses more closely',
      'Look for more affordable alternatives',
      'Set a specific budget'
    ],
    difficulty: 2
  }

  const savingConfig = savingsByCategory[category.category] || defaultSaving
  const potentialAmount = avgSpend * savingConfig.percentage

  return {
    amount: potentialAmount,
    suggestion: savingConfig.suggestion,
    details: savingConfig.details,
    difficulty: savingConfig.difficulty,
    impact: calculateImpact(potentialAmount, avgSpend)
  }
}

function generateGeneralOpportunities(expenseData: any) {
  const opportunities = []
  const monthlyTotal = calculateCurrentMonthTotal(expenseData.expenses)

  // Subscription optimization
  if (hasSubscriptionExpenses(expenseData.expenses)) {
    opportunities.push({
      category: 'Subscriptions',
      amount: monthlyTotal * 0.05,
      suggestion: 'Review and optimize your subscription services',
      details: [
        'Audit all active subscriptions',
        'Cancel unused services',
        'Look for bundle deals'
      ],
      difficulty: 1,
      impact: 65
    })
  }

  // Utility savings
  if (hasUtilityExpenses(expenseData.expenses)) {
    opportunities.push({
      category: 'Utilities',
      amount: monthlyTotal * 0.03,
      suggestion: 'Reduce utility costs with simple changes',
      details: [
        'Use energy-efficient appliances',
        'Optimize thermostat settings',
        'Fix any leaks or inefficiencies'
      ],
      difficulty: 2,
      impact: 75
    })
  }

  return opportunities
}

function calculateImpact(savingAmount: number, totalSpend: number): number {
  const percentage = (savingAmount / totalSpend) * 100
  if (percentage >= 25) return 90
  if (percentage >= 15) return 75
  if (percentage >= 10) return 60
  return 45
}

function hasSubscriptionExpenses(expenses: any[]): boolean {
  const subscriptionKeywords = ['subscription', 'netflix', 'spotify', 'membership', 'monthly']
  return expenses.some(exp => 
    subscriptionKeywords.some(keyword => 
      exp.description?.toLowerCase().includes(keyword)
    )
  )
}

function hasUtilityExpenses(expenses: any[]): boolean {
  const utilityKeywords = ['utility', 'electric', 'water', 'gas', 'internet', 'phone']
  return expenses.some(exp => 
    utilityKeywords.some(keyword => 
      exp.description?.toLowerCase().includes(keyword)
    )
  )
}

function identifyUnusualExpenses(expenses: any[]) {
  const now = new Date()
  const thisMonth = expenses.filter(exp => {
    const date = new Date(exp.date)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })

  // Calculate standard deviation
  const amounts = thisMonth.map(exp => exp.amount)
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length
  const stdDev = Math.sqrt(
    amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length
  )

  // Return expenses that are 2 standard deviations above mean
  return thisMonth.filter(exp => exp.amount > mean + 2 * stdDev)
}

function calculateMoMGrowth(monthlyTotals: Record<string, number>): number {
  const months = Object.keys(monthlyTotals).sort()
  if (months.length < 2) return 0

  const currentMonth = monthlyTotals[months[months.length - 1]]
  const previousMonth = monthlyTotals[months[months.length - 2]]

  if (!previousMonth) return 0
  return ((currentMonth - previousMonth) / previousMonth) * 100
}

function predictNextMonthExpenses(monthlyTotals: Record<string, number>): number {
  const totals = Object.values(monthlyTotals)
  if (totals.length < 2) return totals[0] || 0

  // Simple moving average prediction
  const recentMonths = totals.slice(-3)
  return recentMonths.reduce((a, b) => a + b, 0) / recentMonths.length
}

function extractRecommendations(text: string, userId: string): Promise<any[]> {
  const recommendationPatterns = [
    { regex: /•\s*(.*?)(?=\n|$)/g, type: 'bullet' },
    { regex: /Recommendation:\s*(.*?)(?=\n|$)/g, type: 'explicit' }
  ]

  let recommendations: string[] = []
  
  // Extract recommendations using different patterns
  recommendationPatterns.forEach(({ regex }) => {
    const matches = Array.from(text.matchAll(regex)); // Convert to array
    for (const match of matches) {
      if (match[1]) recommendations.push(match[1].trim())
    }
  })

  // Structure and categorize recommendations
  return Promise.resolve(recommendations.slice(0, 5).map(text => ({
    text,
    category: categorizeRecommendation(text),
    impact: estimateImpact(text),
    userId,
    completed: false
  })))
}

function categorizeRecommendation(text: string): string {
  const categories = {
    'Savings': ['save', 'reduce', 'cut', 'lower', 'budget'],
    'Income': ['earn', 'income', 'revenue', 'salary'],
    'Investment': ['invest', 'portfolio', 'stock', 'fund'],
    'Debt': ['debt', 'loan', 'credit', 'payment'],
    'Lifestyle': ['habit', 'routine', 'daily', 'lifestyle']
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return category
    }
  }
  
  return 'General'
}

function estimateImpact(text: string): number {
  // Simple impact estimation based on keywords
  const impactKeywords = {
    high: ['significant', 'substantial', 'major', 'considerable'],
    medium: ['moderate', 'reasonable', 'decent'],
    low: ['small', 'minor', 'slight']
  }

  if (impactKeywords.high.some(word => text.toLowerCase().includes(word))) return 3
  if (impactKeywords.medium.some(word => text.toLowerCase().includes(word))) return 2
  return 1
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

async function generateBudgetPlans(expenseData: any): Promise<BudgetPlan[]> {
  try {
    // If no expenses, return a starter plan
    if (!expenseData.expenses || expenseData.expenses.length === 0) {
      return [{
        category: 'Getting Started',
        currentSpend: 0,
        recommendedBudget: expenseData.monthlyBudget || 1000,
        adjustmentReason: 'Start tracking your expenses to get personalized budgets',
        savingPotential: 0,
        monthlyTarget: expenseData.monthlyBudget || 1000,
        weeklyAllowance: Math.round((expenseData.monthlyBudget || 1000) / 4),
        confidence: 0,
        tips: [
          'Start adding your daily expenses',
          'Categorize each expense properly',
          'Set realistic budget goals'
        ]
      }]
    }

    // Group expenses by category and calculate monthly averages
    const categoryExpenses = expenseData.expenses.reduce((acc: any, exp: any) => {
      if (!acc[exp.category]) {
        acc[exp.category] = []
      }
      acc[exp.category].push(exp)
      return acc
    }, {})

    const plans: BudgetPlan[] = []

    // Generate plan for each category
    for (const [category, expenses] of Object.entries(categoryExpenses)) {
      const monthlyTotal = (expenses as any[]).reduce((sum, exp) => sum + exp.amount, 0)
      const monthlyAverage = monthlyTotal / 3 // Assuming 3 months of data
      const recommendedBudget = Math.round(monthlyAverage * 0.9) // 10% reduction target

      plans.push({
        category,
        currentSpend: monthlyAverage,
        recommendedBudget,
        adjustmentReason: generateBudgetReason(monthlyAverage, recommendedBudget),
        savingPotential: Math.max(0, monthlyAverage - recommendedBudget),
        monthlyTarget: recommendedBudget,
        weeklyAllowance: Math.round(recommendedBudget / 4),
        confidence: calculateBudgetConfidence(expenses as any[]),
        tips: generateCategoryTips(category, monthlyAverage, recommendedBudget)
      })
    }

    // Sort plans by potential savings
    return plans.sort((a, b) => b.savingPotential - a.savingPotential)

  } catch (error) {
    console.error('Error generating budget plans:', error)
    return [{
      category: 'Error',
      currentSpend: 0,
      recommendedBudget: 0,
      adjustmentReason: 'Error generating budget plans',
      savingPotential: 0,
      monthlyTarget: 0,
      weeklyAllowance: 0,
      confidence: 0,
      tips: ['Try refreshing the page', 'Contact support if the error persists']
    }]
  }
}

function generateBudgetReason(current: number, recommended: number): string {
  const difference = current - recommended
  const percentChange = (difference / current) * 100

  if (percentChange > 20) {
    return `High potential for savings - consider reducing spending by ${Math.round(percentChange)}%`
  } else if (percentChange > 10) {
    return `Moderate savings possible - aim to reduce spending by ${Math.round(percentChange)}%`
  } else if (percentChange > 0) {
    return `Minor adjustments recommended - fine-tune spending by ${Math.round(percentChange)}%`
  } else {
    return 'Current spending is within optimal range'
  }
}

function calculateBudgetConfidence(expenses: any[]): number {
  // More data points = higher confidence
  const dataPoints = Math.min(expenses.length * 5, 40)
  
  // Consistent spending = higher confidence
  const amounts = expenses.map(e => e.amount)
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length
  const consistency = Math.max(0, 40 - (variance / avg) * 10)

  // Recent data = higher confidence
  const mostRecent = new Date(Math.max(...expenses.map(e => new Date(e.date).getTime())))
  const daysSinceLatest = (new Date().getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
  const recency = Math.max(0, 20 - daysSinceLatest)

  return Math.min(95, Math.round(dataPoints + consistency + recency))
}

function generateCategoryTips(category: string, current: number, target: number): string[] {
  const categoryTips: Record<string, string[]> = {
    'Food & Dining': [
      'Plan your meals for the week',
      'Cook in bulk and freeze portions',
      'Use grocery store loyalty programs',
      'Compare prices across different stores',
      'Limit dining out to special occasions'
    ],
    'Transportation': [
      'Consider carpooling options',
      'Use public transportation when possible',
      'Combine errands to save on fuel',
      'Keep up with vehicle maintenance',
      'Walk or bike for short distances'
    ],
    'Shopping': [
      'Make a list and stick to it',
      'Wait 24 hours before large purchases',
      'Look for sales and discounts',
      'Compare prices online',
      'Unsubscribe from promotional emails'
    ],
    'Entertainment': [
      'Look for free local events',
      'Use streaming services instead of cable',
      'Take advantage of happy hours',
      'Check for student/senior discounts',
      'Host gatherings at home'
    ],
    'Utilities': [
      'Install energy-efficient bulbs',
      'Use a programmable thermostat',
      'Fix leaky faucets promptly',
      'Unplug devices when not in use',
      'Consider energy audit'
    ]
  }

  const defaultTips = [
    'Track expenses daily',
    'Set up spending alerts',
    'Review monthly statements',
    'Look for cheaper alternatives',
    'Create a specific budget'
  ]

  const tips = categoryTips[category] || defaultTips
  return tips.slice(0, 3)
}

// Helper functions
function determineFrequency(dates: Date[]): 'daily' | 'weekly' | 'monthly' {
  const intervals = dates
    .slice(1)
    .map((date, i) => date.getTime() - dates[i].getTime())
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
  const dayInMs = 24 * 60 * 60 * 1000

  if (avgInterval <= dayInMs * 2) return 'daily'
  if (avgInterval <= dayInMs * 8) return 'weekly'
  return 'monthly'
}

function determineRiskLevel(amount: number, frequency: string): 'low' | 'medium' | 'high' {
  const monthlyImpact = frequency === 'monthly' ? amount :
    frequency === 'weekly' ? amount * 4 : amount * 30

  if (monthlyImpact > 500) return 'high'
  if (monthlyImpact > 200) return 'medium'
  return 'low'
}

function calculatePatternConfidence(dates: Date[]): number {
  const intervals = dates
    .slice(1)
    .map((date, i) => date.getTime() - dates[i].getTime())
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
  const variance = intervals
    .map(i => Math.pow(i - avgInterval, 2))
    .reduce((a, b) => a + b, 0) / intervals.length

  const consistency = 1 - (Math.sqrt(variance) / avgInterval)
  return Math.round(consistency * 100)
}

function calculateStdDev(numbers: number[], mean: number): number {
  const variance = numbers
    .map(x => Math.pow(x - mean, 2))
    .reduce((a, b) => a + b, 0) / numbers.length
  return Math.sqrt(variance)
}

function calculateTrend(numbers: number[]): number {
  if (numbers.length < 2) return 0
  const first = numbers.slice(0, Math.ceil(numbers.length / 2))
  const second = numbers.slice(Math.ceil(numbers.length / 2))
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length
  const secondAvg = second.reduce((a, b) => a + b, 0) / second.length
  return ((secondAvg - firstAvg) / firstAvg) * 100
}

function generateRecommendation(category: string, amount: number, frequency: string): string {
  const monthlyImpact = frequency === 'monthly' ? amount :
    frequency === 'weekly' ? amount * 4 : amount * 30

  return `Consider reviewing this ${frequency} ${category} expense of ${formatCurrency(amount)} ` +
    `(~${formatCurrency(monthlyImpact)}/month) for potential savings opportunities.`
} 