"use client"

import * as React from "react"
import { format, startOfDay } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"

const groupTransactionsByDay = (transactions: Transaction[]) => {
  const grouped = new Map<string, { deposits: number; withdrawals: number }>();
  
  transactions.forEach(t => {
    const dayKey = startOfDay(new Date(t.date)).toISOString();
    const dailyTotals = grouped.get(dayKey) ?? { deposits: 0, withdrawals: 0 };
    
    if (t.type === 'deposit') {
      dailyTotals.deposits += t.amount;
    } else {
      dailyTotals.withdrawals += t.amount;
    }
    
    grouped.set(dayKey, dailyTotals);
  });
  
  return grouped;
};

export function PocketCalendarView({ transactions, currency }: PocketCalendarViewProps) {
  const transactionsByDay = React.useMemo(() => groupTransactionsByDay(transactions), [transactions]);

  // Custom component to render the content of each calendar day
  const DayContent = ({ date }: { date: Date }) => {
    const dayKey = startOfDay(date).toISOString();
    const dailyData = transactionsByDay.get(dayKey);

    return (
      <div className="flex flex-col h-full items-start justify-start p-1.5 text-left">
        {/* Day number */}
        <div className="font-medium">{format(date, 'd')}</div>
        {/* Transaction data */}
        {dailyData && (
          <div className="flex flex-col items-start mt-1 text-xs w-full space-y-1 overflow-hidden">
            {dailyData.deposits > 0 && (
              <div className="text-primary font-bold truncate w-full bg-primary/10 px-1.5 py-0.5 rounded-sm">
                +{currency}{dailyData.deposits.toLocaleString('en-US', {maximumFractionDigits: 0})}
              </div>
            )}
             {dailyData.withdrawals > 0 && (
              <div className="text-destructive font-bold truncate w-full bg-destructive/10 px-1.5 py-0.5 rounded-sm">
                -{currency}{dailyData.withdrawals.toLocaleString('en-US', {maximumFractionDigits: 0})}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const transactionDates = Array.from(transactionsByDay.keys()).map(isoString => new Date(isoString));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Calendar</CardTitle>
        <CardDescription>A monthly overview of your transaction activity. Days with transactions are highlighted.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          showOutsideDays={false}
          className="p-0 w-full"
          classNames={{
            months: "flex flex-col w-full",
            month: "space-y-4 w-full",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-[14.28%] font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "w-[14.28%] h-28 text-left text-sm p-0 relative border",
            day: "h-full w-full p-0 font-normal rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            day_selected: "",
            day_today: "bg-accent text-accent-foreground",
            day_hidden: "invisible",
          }}
          components={{
            DayContent
          }}
          modifiers={{
            hasTransaction: transactionDates,
          }}
          modifiersClassNames={{
            hasTransaction: 'border-primary border-2'
          }}
        />
      </CardContent>
    </Card>
  )
}
