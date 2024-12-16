'use client'

import { useState } from 'react'
import { useSettings } from '@/contexts/settings-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PremiumFeatures } from '@/components/premium-features'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Crown, CreditCard, Settings as SettingsIcon, Bell, Globe,  Wallet, LogOut,  Star } from 'lucide-react'
import { ModeToggleAdvanced } from '@/components/ui/mode-toggle-advanced'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  // Add local state to track switch states
  const [emailEnabled, setEmailEnabled] = useState(settings.emailNotifications)
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(settings.budgetAlerts)

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {settings.isPro && (
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full blur animate-pulse" />
            <div className="relative bg-black/50 text-amber-500 p-2 rounded-full backdrop-blur-sm border border-amber-500/20">
              <Crown className="h-6 w-6 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-r from-black to-gray-900 border-0 overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {settings.isPro && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-500" />
                    <div className="relative flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Star className="h-4 w-4 text-amber-500 animate-pulse" />
                      <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent animate-shine">
                        Pro Member
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white animate-gradient-text">
                {session?.user?.name || 'User'}
              </h2>
              <p className="text-gray-400">{session?.user?.email}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                <Avatar className="relative h-16 w-16 border-2 border-background">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          {settings.isPro && (
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Monthly Budget</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="Enter amount"
                      value={settings.monthlyBudget}
                      onChange={(e) => updateSettings({ monthlyBudget: parseFloat(e.target.value) })}
                    />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue={settings.currency} onValueChange={(value) => updateSettings({ currency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your account via email</p>
                </div>
                <Switch 
                  checked={emailEnabled}
                  disabled={loading}
                  onCheckedChange={async (checked) => {
                    try {
                      setLoading(true)
                      setEmailEnabled(checked)

                      const success = await updateSettings({
                        emailNotifications: checked
                      }).then(() => true).catch(() => false)

                      if (!success) {
                        setEmailEnabled(!checked)
                        throw new Error('Failed to update settings')
                      }

                      toast.success(checked ? 'Email notifications enabled' : 'Email notifications disabled')
                    } catch (error) {
                      console.error('Failed to update notifications:', error)
                      toast.error('Failed to update notification settings')
                    } finally {
                      setLoading(false)
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you're close to your budget limit</p>
                </div>
                <Switch 
                  checked={budgetAlertsEnabled}
                  disabled={loading}
                  onCheckedChange={async (checked) => {
                    try {
                      setLoading(true)
                      setBudgetAlertsEnabled(checked)

                      const success = await updateSettings({
                        budgetAlerts: checked
                      }).then(() => true).catch(() => false)

                      if (!success) {
                        setBudgetAlertsEnabled(!checked)
                        throw new Error('Failed to update settings')
                      }

                      toast.success(checked ? 'Budget alerts enabled' : 'Budget alerts disabled')
                    } catch (error) {
                      console.error('Failed to update alerts:', error)
                      toast.error('Failed to update alert settings')
                    } finally {
                      setLoading(false)
                    }
                  }}
                />
              </div>
              {emailEnabled && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Test Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send a test email to verify your settings</p>
                    </div>
                    <Button 
                      variant="outline"
                      disabled={loading}
                      onClick={async () => {
                        try {
                          setLoading(true)
                          const response = await fetch('/api/notifications/test', {
                            method: 'POST'
                          })
                          
                          if (!response.ok) {
                            const data = await response.json()
                            throw new Error(data.error || 'Failed to send test email')
                          }
                          
                          toast.success('Test email sent! Check your inbox')
                        } catch (error) {
                          console.error('Test email error:', error)
                          toast.error('Failed to send test email')
                        } finally {
                          setLoading(false)
                        }
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Test Email'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="space-y-1">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <ModeToggleAdvanced />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {settings.isPro && (
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-purple-500">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">Active until Dec 31, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <CreditCard className="h-4 w-4" />
                      <span>•••• 4242</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Cycle</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Wallet className="h-4 w-4" />
                      <span>Monthly</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {!settings.isPro && (
        <div className="mt-8">
          <PremiumFeatures />
        </div>
      )}
    </div>
  )
} 