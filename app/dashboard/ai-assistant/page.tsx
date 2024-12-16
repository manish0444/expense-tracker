'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/contexts/settings-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Bot, Sparkles, Brain, TrendingUp, PieChart, Zap, Lock, CalendarDays, TrendingDown, Target } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PremiumFeatures } from '@/components/premium-features'
import { cn } from '@/lib/utils'
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { BudgetPlan, ExpensePattern } from '@/types/ai-features'

interface AIInsights {
  totalSaved: number
  potentialSavings: number
  topExpenseCategory: string
  unusualExpenses: any[]
  recommendations: {
    id: string
    text: string
    category: string
    completed: boolean
    impact: number
  }[]
  monthOverMonthGrowth: number
  predictedExpenses: number
  savingOpportunities: {
    category: string
    amount: number
    suggestion: string
    details: string[]
    difficulty: number
    impact: number
  }[]
  recommendationStats: {
    total: number
    completed: number
    pending: number
  }
  budgetPlans: BudgetPlan[]
}

export default function AIAssistantPage() {
  const { settings } = useSettings()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [question, setQuestion] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResponse, setAiResponse] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loadingError, setLoadingError] = useState<string>('')

  useEffect(() => {
    fetchInsights()
  }, [])

  useEffect(() => {
    if (insights) {
      console.log('Budget Plans:', insights.budgetPlans)
    }
  }, [insights])

  const fetchInsights = async () => {
    try {
      setLoadingError('')
      const response = await fetch('/api/ai/insights')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load insights')
      }
      
      setInsights(data)
    } catch (error: any) {
      console.error('Error fetching insights:', error)
      setLoadingError(error.message)
      toast.error('Failed to load AI insights')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings.isPro) {
      toast.error('Please upgrade to Pro to use the AI Assistant')
      return
    }
    
    if (!question.trim()) return

    setAnalyzing(true)
    setError('')
    setAiResponse('')
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }
      
      setAiResponse(data.analysis)
      toast.success('Analysis complete')
    } catch (error: any) {
      console.error('AI Analysis Error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRecommendationToggle = async (id: string, completed: boolean) => {
    try {
      const response = await fetch('/api/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed })
      })

      if (!response.ok) throw new Error('Failed to update recommendation')
      
      // Refresh insights after updating
      fetchInsights()
      toast.success('Recommendation updated')
    } catch (error) {
      toast.error('Failed to update recommendation')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Bot className="h-10 w-10 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading AI insights...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loadingError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="p-4 rounded-lg bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
              {loadingError}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Pro Feature Banner */}
      {!settings.isPro && (
        <Card className="border-gradient bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Lock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Get full access to AI insights and personalized recommendations
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                onClick={() => router.push('/dashboard/settings')}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Assistant Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg">
            <Bot className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Financial Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Powered by advanced analytics and machine learning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium">Pro Feature</span>
        </div>
      </div>

      {/* AI Query Interface */}
      <Card className="border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Ask Your Financial Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleQuestionSubmit} className="flex gap-2">
            <Input
              placeholder={settings.isPro 
                ? "Ask about your spending patterns, savings opportunities, or financial advice..." 
                : "Upgrade to Pro to ask questions and get personalized insights"}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
              disabled={!settings.isPro}
            />
            <Button 
              type="submit" 
              disabled={analyzing || !settings.isPro}
              className={cn(
                "transition-all",
                !settings.isPro && "opacity-50 cursor-not-allowed"
              )}
            >
              {analyzing ? 'Analyzing...' : 'Ask AI'}
            </Button>
          </form>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          {aiResponse && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="prose dark:prose-invert max-w-none">
                {aiResponse}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Savings Card */}
        <Card className="border-gradient">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(insights?.totalSaved || 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Compared to average spending
            </p>
          </CardContent>
        </Card>

        {/* Potential Savings Card */}
        <Card className="border-gradient">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Potential Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {formatCurrency(insights?.potentialSavings || 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Opportunities identified
            </p>
          </CardContent>
        </Card>

        {/* Top Expense Category */}
        <Card className="border-gradient">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-blue-500" />
              Top Expense Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {insights?.topExpenseCategory || 'N/A'}
            </div>
            <p className="text-sm text-muted-foreground">
              Highest spending area
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI Recommendations
            </div>
            <div className="text-sm text-muted-foreground">
              {insights?.recommendationStats.completed}/{insights?.recommendationStats.total} Completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress 
            value={
              ((insights?.recommendationStats?.completed ?? 0) / 
              (insights?.recommendationStats?.total ?? 1)) * 100
            } 
            className="h-2 bg-muted/50 rounded-full"
          />
          {insights?.recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5"
            >
              <Checkbox
                checked={recommendation.completed}
                onCheckedChange={(checked) => 
                  handleRecommendationToggle(recommendation.id, checked as boolean)
                }
              />
              <div className="flex-1">
                <p className={cn(
                  recommendation.completed && "text-muted-foreground line-through"
                )}>
                  {recommendation.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {recommendation.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: recommendation.impact }).map((_, i) => (
                      <Sparkles 
                        key={i} 
                        className="h-3 w-3 text-yellow-500" 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Saving Opportunities */}
      <Card className="border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              Saving Opportunities
            </div>
            <div className="text-sm text-muted-foreground">
              Potential Monthly Savings: {formatCurrency(insights?.potentialSavings || 0)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights?.savingOpportunities.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No saving opportunities identified yet. Keep tracking your expenses!
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {insights?.savingOpportunities.map((opportunity, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-green-500/5 to-blue-500/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-green-500/10 mt-1">
                          <Sparkles className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {opportunity.category}
                            <span className="text-sm text-green-500 font-bold">
                              Save {formatCurrency(opportunity.amount)}/month
                            </span>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {opportunity.suggestion}
                          </p>
                          {opportunity.details && (
                            <div className="mt-2 space-y-1">
                              {opportunity.details.map((detail, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-muted-foreground">
                          Difficulty:
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: opportunity.difficulty }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-4 rounded-sm bg-blue-500/50"
                            />
                          ))}
                          {Array.from({ length: 3 - (opportunity.difficulty || 0) }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-4 rounded-sm bg-gray-200 dark:bg-gray-700"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {opportunity.impact && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground mb-1">
                          Potential Impact
                        </div>
                        <Progress 
                          value={opportunity.impact} 
                          className="h-2 bg-green-100 dark:bg-green-950"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center mt-4">
                These suggestions are based on your spending patterns and similar user profiles
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Smart Budget Planning */}
      <Card className="border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Smart Budget Planning
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insights?.budgetPlans?.length ? (
            <div className="text-center p-6 text-muted-foreground">
              No budget plans available. Start by adding some expenses!
            </div>
          ) : (
            insights.budgetPlans.map((plan, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{plan.category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {plan.adjustmentReason}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Current: {formatCurrency(plan.currentSpend)}
                  </div>
                  <div className="text-sm text-purple-500 font-medium">
                    Target: {formatCurrency(plan.recommendedBudget)}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress to Target</span>
                    <span>{Math.round((plan.currentSpend / plan.recommendedBudget) * 100)}%</span>
                  </div>
                  <Progress
                    value={(plan.currentSpend / plan.recommendedBudget) * 100}
                    className="h-2"
                    indicatorClassName={cn(
                      plan.currentSpend > plan.recommendedBudget 
                        ? "bg-red-500" 
                        : "bg-purple-500"
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Weekly Budget</div>
                    <div className="font-medium">{formatCurrency(plan.weeklyAllowance)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Potential Saving</div>
                    <div className="font-medium text-green-500">
                      {formatCurrency(plan.savingPotential)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Brain className="h-3 w-3" />
                    Tips:
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {plan.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
} 