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
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const t = useTranslation(language)
  const { settings } = useSettings()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <nav className="flex flex-col h-full bg-background">
            <div className="p-4 flex-1">
              <div className="space-y-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-x-2 text-sm font-medium p-2 hover:text-primary hover:bg-muted rounded-lg transition",
                      pathname === route.href ? "text-primary bg-muted" : "text-muted-foreground",
                      route.pro && !settings?.isPro && "opacity-50 pointer-events-none"
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                    {route.pro && !settings?.isPro && (
                      <Sparkles className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:flex flex-col fixed z-50 top-0 left-0 h-full w-72 bg-background border-r">
        <div className="p-4 flex-1">
          <div className="space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-2 text-sm font-medium p-2 hover:text-primary hover:bg-muted rounded-lg transition",
                  pathname === route.href ? "text-primary bg-muted" : "text-muted-foreground",
                  route.pro && !settings?.isPro && "opacity-50 pointer-events-none"
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
                {route.pro && !settings?.isPro && (
                  <Sparkles className="h-4 w-4 text-primary ml-auto" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
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