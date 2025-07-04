"use client"

import * as React from 'react'
import Link from 'next/link'
import { MoreVertical, Plus, Minus, Trash2, PiggyBank } from 'lucide-react'
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
import { useArcas, iconMap } from '@/contexts/pockets-context'
import type { Arca } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArcaCardProps {
  arca: Arca
  isDragging?: boolean
}

export function ArcaCard({ arca, isDragging = false }: ArcaCardProps) {
  const { deleteArca } = useArcas()
  const [isTransactionOpen, setTransactionOpen] = React.useState(false)
  const [transactionType, setTransactionType] = React.useState<'deposit' | 'withdrawal'>('deposit')
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const balance = arca.transactions.reduce((acc, t) => {
    return t.type === 'deposit' ? acc + t.amount : acc - t.amount
  }, 0)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: amount % 1 ? 2 : 0,
    });
  };

  const handleTransactionClick = (type: 'deposit' | 'withdrawal') => {
    setTransactionType(type)
    setTransactionOpen(true)
  }

  const handleDelete = () => {
    deleteArca(arca.id)
    setDeleteDialogOpen(false)
  }

  const Icon = iconMap[arca.icon] || PiggyBank

  return (
    <>
      <Card className={cn(
        "flex flex-col h-full group transition-all duration-300",
        !isDragging && "hover:shadow-lg hover:-translate-y-1",
        isDragging && "shadow-2xl"
      )}>
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
            <Link href={`/pocket/${arca.id}`} className="flex-1 min-w-0">
                <CardTitle className="text-lg font-medium truncate">{arca.name}</CardTitle>
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
                        <span>Delete Arca</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <Link href={`/pocket/${arca.id}`} className="flex-grow">
          <CardContent>
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-3xl font-bold text-primary">
                    {arca.currency}{formatCurrency(balance)}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                    {arca.transactions.length} transactions
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
        arcaId={arca.id}
        initialType={transactionType}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this arca?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{arca.name}" arca and all of its transactions.
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
