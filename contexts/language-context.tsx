'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Language } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserSettings()
  }, [])

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      const data = await response.json()
      if (data.language) {
        setLanguage(data.language as Language)
        document.documentElement.lang = data.language
      }
    } catch (error) {
      console.error('Failed to load language settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = async (newLang: Language) => {
    try {
      // Update UI immediately
      setLanguage(newLang)
      document.documentElement.lang = newLang

      // Save to database
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang })
      })

      if (!response.ok) {
        throw new Error('Failed to save language preference')
      }
    } catch (error) {
      console.error('Failed to save language settings:', error)
      // Revert on error
      setLanguage(language)
      document.documentElement.lang = language
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 