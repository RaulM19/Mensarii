"use client"

import * as React from "react"
import { format, isSameDay } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { Badge } from "./ui/badge"

interface PocketCalendarViewProps {
  transactions: Transaction[]
}

export function PocketCalendarView({ transactions }: PocketCalendarViewProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const transactionDates = transactions.map(t => new Date(t.date))

  const selectedDayTransactions = date 
    ? transactions
        .filter(t => isSameDay(new Date(t.date), date))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Calendar</CardTitle>
        <CardDescription>Select a day to see transaction details. Highlighted days have activity.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasTransaction: transactionDates,
              }}
              modifiersStyles={{
                hasTransaction: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                  textUnderlineOffset: '2px',
                },
              }}
            />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Transactions for {date ? format(date, 'PPP') : '...'}
          </h3>
          {selectedDayTransactions.length > 0 ? (
            <div className="space-y-4">
              {selectedDayTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(t.date), 'p')}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'deposit' ? '+' : '-'} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant={t.type === 'deposit' ? 'default' : 'destructive'} className={t.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {t.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No transactions on this day.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
