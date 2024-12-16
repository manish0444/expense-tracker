'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Search, X } from 'lucide-react'

interface ExpenseFiltersProps {
  onSearch: (filters: any) => void
}

export function ExpenseFilters({ onSearch }: ExpenseFiltersProps) {
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()

  const handleSearch = () => {
    onSearch({
      search,
      from: fromDate?.toISOString(),
      to: toDate?.toISOString()
    })
  }

  const handleReset = () => {
    setSearch('')
    setFromDate(undefined)
    setToDate(undefined)
    onSearch({})
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? (
                <>
                  {format(fromDate, 'PPP')}
                  {toDate && ' - '}
                  {toDate && format(toDate, 'PPP')}
                </>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={fromDate}
              selected={{
                from: fromDate,
                to: toDate,
              }}
              onSelect={(range) => {
                setFromDate(range?.from)
                setToDate(range?.to)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
} 