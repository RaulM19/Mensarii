"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Pocket name must be at least 2 characters.",
  }),
  initialBalance: z.coerce.number().min(0, {
    message: "Initial balance must be a positive number.",
  }),
  currency: z.enum(['$', 'USD']),
})

type CreatePocketDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePocketDialog({ open, onOpenChange }: CreatePocketDialogProps) {
  const { addPocket } = usePockets()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      initialBalance: 0,
      currency: "$",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addPocket(values.name, values.initialBalance, values.currency)
    form.reset()
    onOpenChange(false)
  }

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Pocket</DialogTitle>
          <DialogDescription>
            Give your new savings pocket a name and an optional starting balance.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pocket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Fund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initialBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Balance</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="$">$</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Create Pocket</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
