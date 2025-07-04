"use client"

import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"

interface ArcaTransactionsListProps {
  transactions: Transaction[];
  currency: '$' | 'USD';
}

export function ArcaTransactionsList({ transactions, currency }: ArcaTransactionsListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: amount % 1 ? 2 : 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {sortedTransactions.length > 0 ? (
          <>
            {/* Mobile View: List of Cards */}
            <div className="space-y-4 md:hidden p-4">
              {sortedTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{t.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(t.date), 'dd/MM/yyyy')}
                    </p>
                      <Badge variant={t.type === 'deposit' ? 'default' : 'destructive'} className="capitalize">
                        {t.type}
                      </Badge>
                  </div>
                  <div className={`text-lg font-bold ${t.type === 'deposit' ? 'text-primary' : 'text-destructive'}`}>
                    {t.type === 'deposit' ? '+' : '-'}
                    {currency}
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        {format(new Date(t.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        <Badge variant={t.type === 'deposit' ? 'default' : 'destructive'} className="capitalize">
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${t.type === 'deposit' ? 'text-primary' : 'text-destructive'}`}>
                        {t.type === 'deposit' ? '+' : '-'} {currency}{formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No transactions yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
