"use client"

import * as React from 'react'
import Link from 'next/link'
import { MoreVertical, Plus, Minus, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TransactionDialog } from '@/components/transaction-dialog'
import { usePockets } from '@/contexts/pockets-context'
import type { Pocket } from '@/lib/types'

interface PocketCardProps {
  pocket: Pocket
}

export function PocketCard({ pocket }: PocketCardProps) {
  const { deletePocket } = usePockets()
  const [isTransactionOpen, setTransactionOpen] = React.useState(false)
  const [transactionType, setTransactionType] = React.useState<'deposit' | 'withdrawal'>('deposit')
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const balance = pocket.transactions.reduce((acc, t) => {
    return t.type === 'deposit' ? acc + t.amount : acc - t.amount
  }, 0)

  const handleTransactionClick = (type: 'deposit' | 'withdrawal') => {
    setTransactionType(type)
    setTransactionOpen(true)
  }

  const handleDelete = () => {
    deletePocket(pocket.id)
    setDeleteDialogOpen(false)
  }

  const Icon = pocket.icon

  return (
    <>
      <Card className="flex flex-col h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
            <Link href={`/pocket/${pocket.id}`} className="flex-1 min-w-0">
                <CardTitle className="text-lg font-medium truncate">{pocket.name}</CardTitle>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTransactionClick('deposit')}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add Funds</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTransactionClick('withdrawal')}>
                        <Minus className="mr-2 h-4 w-4" />
                        <span>Withdraw Funds</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Pocket</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <Link href={`/pocket/${pocket.id}`} className="flex-grow">
          <CardContent>
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-3xl font-bold text-primary">
                    {pocket.currency}{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                    {pocket.transactions.length} transactions
                    </CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      <TransactionDialog
        open={isTransactionOpen}
        onOpenChange={setTransactionOpen}
        pocketId={pocket.id}
        initialType={transactionType}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this pocket?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{pocket.name}" pocket and all of its transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
