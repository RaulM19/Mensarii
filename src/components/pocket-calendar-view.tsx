"use client"

import * as React from "react"
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/types"

interface ArcaCalendarViewProps {
  transactions: Transaction[];
  currency: '$' | 'USD';
}

const groupTransactionsByDay = (transactions: Transaction[]) => {
  const grouped = new Map<string, Transaction[]>();
  
  transactions.forEach(t => {
    const dayKey = format(new Date(t.date), 'yyyy-MM-dd');
    const dailyTransactions = grouped.get(dayKey) ?? [];
    dailyTransactions.push(t);
    grouped.set(dayKey, dailyTransactions);
  });
  
  return grouped;
};

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: amount % 1 ? 2 : 0,
    });
};

export function ArcaCalendarView({ transactions, currency }: ArcaCalendarViewProps) {
  const transactionsByDay = React.useMemo(() => groupTransactionsByDay(transactions), [transactions]);

  const DayContent = ({ date }: { date: Date }) => {
    const dayKey = format(date, 'yyyy-MM-dd');
    const dailyTransactions = transactionsByDay.get(dayKey);

    if (!dailyTransactions || dailyTransactions.length === 0) {
      return (
        <div className="flex flex-col h-full items-start justify-start p-1.5 text-left">
          <div className="font-medium">{format(date, 'd')}</div>
        </div>
      );
    }
    
    const dailyTotals = dailyTransactions.reduce((acc, t) => {
        if (t.type === 'deposit') acc.deposits += t.amount;
        else acc.withdrawals += t.amount;
        return acc;
    }, { deposits: 0, withdrawals: 0 });

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col h-full items-start justify-start p-1.5 text-left w-full cursor-pointer">
            <div className="font-medium">{format(date, 'd')}</div>
            <div className="flex flex-col items-start mt-1 text-xs w-full space-y-1 overflow-hidden">
              {dailyTotals.deposits > 0 && (
                <div className="text-primary font-bold truncate w-full bg-primary/10 px-1.5 py-0.5 rounded-sm">
                  +{currency}{formatCurrency(dailyTotals.deposits)}
                </div>
              )}
               {dailyTotals.withdrawals > 0 && (
                <div className="text-destructive font-bold truncate w-full bg-destructive/10 px-1.5 py-0.5 rounded-sm">
                  -{currency}{formatCurrency(dailyTotals.withdrawals)}
                </div>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 z-10">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Transactions for {format(date, 'PPP')}</h4>
              <p className="text-sm text-muted-foreground">
                Detailed activity for this day.
              </p>
            </div>
            <div className="grid gap-3">
              {dailyTransactions.map((t) => (
                <div key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{t.description}</span>
                        <Badge variant={t.type === 'deposit' ? 'default' : 'destructive'} className="capitalize w-fit">
                            {t.type}
                        </Badge>
                    </div>
                  <div className={`font-semibold text-right ${t.type === 'deposit' ? 'text-primary' : 'text-destructive'}`}>
                    {t.type === 'deposit' ? '+' : '-'}{currency}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Calendar</CardTitle>
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
            hasTransaction: (date: Date) => {
              const dayKey = format(date, 'yyyy-MM-dd');
              return transactionsByDay.has(dayKey);
            }
          }}
          modifiersClassNames={{
            hasTransaction: 'border-primary/50'
          }}
        />
      </CardContent>
    </Card>
  )
}
