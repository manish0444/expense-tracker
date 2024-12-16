'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <span>Welcome, {session?.user?.name}</span>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    </header>
  )
}

