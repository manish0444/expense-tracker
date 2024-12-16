'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Settings,
  Menu,
  ChevronLeft,
  User,
  LogOut,
  CreditCard,
  Receipt,
  Bot,
  Sparkles
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/contexts/language-context'
import { useTranslation } from '@/lib/translations'
import { useSettings } from '@/contexts/settings-context'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500'
  },
  {
    label: 'Add Expense',
    icon: PlusCircle,
    href: '/dashboard/add-expense',
    color: 'text-violet-500'
  },
  {
    label: 'Expenses',
    icon: Receipt,
    href: '/dashboard/expenses',
    color: 'text-pink-700'
  },
  {
    label: 'AI Assistant',
    icon: Bot,
    href: '/dashboard/ai-assistant',
    color: 'text-blue-500',
    pro: true
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-orange-700'
  }
]

// Add the translation key to your type definitions
type TranslationKey = {
  // ... existing keys ...
  [key: string]: string; // Add this line to allow any string key temporarily
};

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobile, setIsMobile] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const t = useTranslation(language)
  const { settings } = useSettings()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile) {
    return (
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="ml-4 flex-1 flex justify-between items-center">
            <h1 className="text-2xl font-bold">ExpenseTracker</h1>
            <UserNav />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4 flex flex-col h-full bg-background">
            <div className="px-3 py-2 flex-1">
              <h2 className="mb-2 px-4 text-lg font-semibold">
                {t('navigation')}
              </h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center p-3 w-full font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-all",
                      pathname === route.href ? "text-primary bg-accent" : "text-muted-foreground",
                      route.pro && !settings.isPro ? 'opacity-50' : ''
                    )}
                  >
                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                    {(route.label)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className={cn(
        "hidden md:flex flex-col gap-4 p-4 bg-background border-r",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">
              {t('dashboard')}
            </h2>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            <ChevronLeft className={cn("h-6 w-6 transition-all", isCollapsed && "rotate-180")} />
          </Button>
        </div>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center p-3 w-full font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-all",
                pathname === route.href ? "text-primary bg-accent" : "text-muted-foreground",
                route.pro && !settings.isPro ? 'opacity-50' : ''
              )}
            >
              <route.icon className={cn("h-5 w-5", route.color)} />
              {!isCollapsed && (
                <span className="ml-3">{route.label}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center p-3 w-full font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition-all",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {(route.label)}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-600/10"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('signOut')}
        </Button>
      </div>
    </div>
  )
}

function UserNav() {
  const { data: session } = useSession()
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="flex items-center gap-4">
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              {t('profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              {t('settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault()
              signOut({ callbackUrl: '/' })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 