import { useCallback } from 'react'
import { toast } from 'sonner'

export function useNotifications() {
  const sendNotification = useCallback(async (type: string, data: any) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })

      if (!response.ok) {
        throw new Error('Failed to send notification')
      }
    } catch (error) {
      console.error('Notification error:', error)
      toast.error('Failed to send notification')
    }
  }, [])

  return { sendNotification }
} 