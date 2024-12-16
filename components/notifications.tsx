'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// Mock notifications - in a real app, these would come from your backend
const mockNotifications = [
  { id: 1, message: 'You have exceeded your budget for this month.' },
  { id: 2, message: 'Recurring payment for Netflix due tomorrow.' },
  { id: 3, message: 'New expense category suggestion: Healthcare' },
]

export function Notifications() {
  const [notifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Here you would typically fetch notifications from your backend
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 h-14 w-14 rounded-full">
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with your latest expense alerts and reminders.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 bg-secondary rounded-lg">
              {notification.message}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

