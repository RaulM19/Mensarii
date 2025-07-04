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

interface PocketTransactionsListProps {
  transactions: Transaction[];
  currency: '$' | 'USD';
}

export function PocketTransactionsList({ transactions, currency }: PocketTransactionsListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length > 0 ? (
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
                    <Badge variant={t.type === 'deposit' ? 'default' : 'destructive'}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${t.type === 'deposit' ? 'text-primary' : 'text-destructive'}`}>
                    {t.type === 'deposit' ? '+' : '-'} {currency}{t.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No transactions yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
