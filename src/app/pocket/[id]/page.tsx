"use client"

import * as React from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { usePockets, iconMap } from '@/contexts/pockets-context'
import { ArrowLeft, Plus, Minus, PiggyBank } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PocketTransactionsList } from '@/components/pocket-transactions-list'
import { PocketBalanceChart } from '@/components/pocket-balance-chart'
import { PocketCalendarView } from '@/components/pocket-calendar-view'
import { TransactionDialog } from '@/components/transaction-dialog'

export default function PocketDetailPage() {
  const params = useParams()
  const { getPocketById } = usePockets()
  const pocketId = typeof params.id === 'string' ? params.id : ''
  const pocket = getPocketById(pocketId)

  const [isTransactionOpen, setTransactionOpen] = React.useState(false)
  const [transactionType, setTransactionType] = React.useState<'deposit' | 'withdrawal'>('deposit')

  if (!pocket) {
    // Return a loading state or a fallback until the pocket is loaded from localstorage
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-muted-foreground">Loading Pocket...</div>
        </div>
    );
  }

  const balance = pocket.transactions.reduce((acc, t) => {
    return t.type === 'deposit' ? acc + t.amount : acc - t.amount
  }, 0)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: amount % 1 ? 2 : 0,
    });
  };

  const Icon = iconMap[pocket.icon] || PiggyBank

  const handleTransactionClick = (type: 'deposit' | 'withdrawal') => {
    setTransactionType(type)
    setTransactionOpen(true)
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pockets
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-card border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{pocket.name}</h1>
                <p className="text-muted-foreground">Current Balance</p>
                <p className="text-4xl font-bold text-primary">
                  {pocket.currency}{formatCurrency(balance)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleTransactionClick('deposit')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
              <Button onClick={() => handleTransactionClick('withdrawal')} variant="destructive">
                <Minus className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </header>

        <main>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list">Transactions</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-4">
              <PocketTransactionsList transactions={pocket.transactions} currency={pocket.currency} />
            </TabsContent>
            <TabsContent value="chart" className="mt-4">
               <PocketBalanceChart transactions={pocket.transactions} currency={pocket.currency} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <PocketCalendarView transactions={pocket.transactions} currency={pocket.currency} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <TransactionDialog
        open={isTransactionOpen}
        onOpenChange={setTransactionOpen}
        pocketId={pocket.id}
        initialType={transactionType}
      />
    </>
  )
}
