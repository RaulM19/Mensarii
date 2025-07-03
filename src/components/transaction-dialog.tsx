"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDown, ArrowUp } from "lucide-react"

import { usePockets } from "@/contexts/pockets-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  type: z.enum(["deposit", "withdrawal"]),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
})

type TransactionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pocketId: string
  initialType?: "deposit" | "withdrawal"
}

export function TransactionDialog({ open, onOpenChange, pocketId, initialType = 'deposit' }: TransactionDialogProps) {
  const { addTransaction } = usePockets()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialType,
      amount: 0,
      description: "",
    },
  })

  React.useEffect(() => {
    form.reset({
      type: initialType,
      amount: 0,
      description: "",
    });
  }, [open, initialType, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    addTransaction(pocketId, values)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Add a new deposit or withdrawal to your pocket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange} className="w-[300px]">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="deposit">
                          <ArrowUp className="mr-2 h-4 w-4 text-green-500" /> Deposit
                        </TabsTrigger>
                        <TabsTrigger value="withdrawal">
                          <ArrowDown className="mr-2 h-4 w-4 text-red-500" /> Withdrawal
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Paycheck, Groceries, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
