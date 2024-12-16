'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MoneyIcon } from '@/components/ui/money-icon'
import { ExpenseFilters } from '@/components/expense-filters'
import { Pagination } from '@/components/ui/pagination'

interface ExpenseListProps {
  limit?: number
  showViewAll?: boolean
  showFilters?: boolean
}

export function ExpenseList({ limit, showViewAll, showFilters = false }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})
  const router = useRouter()

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: (limit || 10).toString(),
        ...filters
      })

      const response = await fetch(`/api/expenses?${params}`)
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      
      setExpenses(data.expenses)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [page, filters])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete expense')
      
      toast.success('Expense deleted successfully')
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Expenses</h2>
        {showViewAll && (
          <Button onClick={() => router.push('/dashboard/expenses')}>
            View All
          </Button>
        )}
      </div>

      {showFilters && <ExpenseFilters onSearch={handleSearch} />}

      <div className="overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="min-w-[150px]">Description</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[100px]">Amount</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MoneyIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCurrency(expense.amount)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/expenses/${expense._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showFilters && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

