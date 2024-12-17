'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, FileDown, Mail, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ExportExpensesProps {
  expenses: any[]
  period?: string
}

export function ExportExpenses({ expenses, period }: ExportExpensesProps) {
  const [loading, setLoading] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [email, setEmail] = useState('')

  const exportToText = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/export/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses, period }),
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses_${period || 'all'}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Exported to text successfully')
    } catch (error) {
      toast.error('Failed to export expenses')
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses, period }),
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses_${period || 'all'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Exported to PDF successfully')
    } catch (error) {
      toast.error('Failed to export expenses')
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/export/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses, period, email }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      toast.success('Email sent successfully')
      setShowEmailDialog(false)
    } catch (error) {
      toast.error('Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={exportToText}>
            <FileText className="h-4 w-4 mr-2" />
            Export as Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Send via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Expenses Report</DialogTitle>
            <DialogDescription>
              Enter the email address where you'd like to receive the expenses report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={loading || !email}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
