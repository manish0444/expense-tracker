'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/date-range-picker'

export function ExportOptions() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  })
  const [format, setFormat] = useState<string>('csv')

  const handleExport = () => {
    console.log('Exporting data:', { dateRange, format })
    // Here you would typically call your backend API to generate and download the file
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="w-full">Export</Button>
        </div>
      </CardContent>
    </Card>
  )
}

