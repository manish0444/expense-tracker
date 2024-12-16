'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Settings {
  isPro: boolean
  monthlyBudget: number
  currency: string
  language: string
  theme: string
  emailNotifications: boolean
  budgetAlerts: boolean
  twoFactorEnabled: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    isPro: false,
    monthlyBudget: 0,
    currency: 'USD',
    language: 'en',
    theme: 'light',
    emailNotifications: false,
    budgetAlerts: false,
    twoFactorEnabled: false
  })
  const [loading, setLoading] = useState(true)

  // Fetch settings from server on mount
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setLoading(true)
        // First try to get server settings
        const response = await fetch('/api/settings')
        if (!response.ok) {
          throw new Error('Failed to fetch settings')
        }
        const serverSettings = await response.json()
        
        // Get any local settings
        const localSettings = localStorage.getItem('userSettings')
        const parsedLocalSettings = localSettings ? JSON.parse(localSettings) : null

        // Merge settings, preferring server settings
        const mergedSettings = {
          ...settings,
          ...parsedLocalSettings,
          ...serverSettings
        }

        // Update state and local storage
        setSettings(mergedSettings)
        localStorage.setItem('userSettings', JSON.stringify(mergedSettings))
      } catch (error) {
        console.error('Error initializing settings:', error)
        toast.error('Failed to load settings')
        
        // Try to load from localStorage as fallback
        const localSettings = localStorage.getItem('userSettings')
        if (localSettings) {
          setSettings(JSON.parse(localSettings))
        }
      } finally {
        setLoading(false)
      }
    }

    initializeSettings()
  }, []) // Run once on mount

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      // Optimistically update local state
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings))

      // Update server
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })

      const data = await response.json()

      if (!response.ok) {
        // Revert on failure
        setSettings(settings)
        localStorage.setItem('userSettings', JSON.stringify(settings))
        throw new Error(data.error || 'Failed to update settings')
      }

      // Update with server response
      const finalSettings = { ...updatedSettings, ...data }
      setSettings(finalSettings)
      localStorage.setItem('userSettings', JSON.stringify(finalSettings))

      return data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  // Sync settings across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userSettings' && e.newValue) {
        setSettings(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 