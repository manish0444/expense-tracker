'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ModeToggleAdvanced() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-muted">
      {[
        { value: 'light', icon: Sun },
        { value: 'dark', icon: Moon },
        { value: 'system', icon: Monitor }
      ].map(({ value, icon: Icon }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={`
            rounded-full px-3 py-1.5
            ${theme === value ? 
              'bg-background shadow-sm text-primary' : 
              'hover:bg-background/50 text-muted-foreground'
            }
          `}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4 mr-1" />
          <span className="capitalize">{value}</span>
        </Button>
      ))}
    </div>
  )
} 