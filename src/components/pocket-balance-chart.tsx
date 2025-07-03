"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Transaction } from "@/lib/types"

interface PocketBalanceChartProps {
  transactions: Transaction[];
  currency: '$' | 'USD';
}

export function PocketBalanceChart({ transactions, currency }: PocketBalanceChartProps) {
  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, transaction) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0
      const newBalance = transaction.type === 'deposit' 
        ? lastBalance + transaction.amount 
        : lastBalance - transaction.amount

      acc.push({
        date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: newBalance,
      })
      return acc
    }, [] as { date: string; balance: number }[])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Over Time</CardTitle>
        <CardDescription>
          A visual representation of your pocket's balance history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 1 ? (
          <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${currency}${value}`}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="balance"
                type="monotone"
                fill="url(#colorBalance)"
                stroke="hsl(var(--primary))"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">
             Not enough data to display a chart. Add more transactions.
           </div>
        )}
      </CardContent>
    </Card>
  )
}
