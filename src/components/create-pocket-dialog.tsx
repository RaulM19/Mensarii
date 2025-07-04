"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { usePockets, iconMap } from "@/contexts/pockets-context"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Pocket name must be at least 2 characters.",
  }),
  initialBalance: z.coerce.number().min(0, {
    message: "Initial balance must be a positive number.",
  }),
  currency: z.enum(['$', 'USD']),
  icon: z.string().min(1, { message: "Please select an icon." }),
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
      icon: "piggyBank",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addPocket(values.name, values.initialBalance, values.currency, values.icon)
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
             <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {Object.entries(iconMap).map(([iconName, IconComponent]) => (
                        <FormItem key={iconName} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={iconName} id={iconName} className="sr-only" />
                          </FormControl>
                          <FormLabel htmlFor={iconName} className="cursor-pointer">
                            <div className={cn(
                              "p-3 rounded-lg border-2",
                              field.value === iconName ? 'border-primary bg-primary/10' : 'border-border'
                            )}>
                              <IconComponent className={cn(
                                "h-6 w-6",
                                field.value === iconName ? 'text-primary' : 'text-muted-foreground'
                              )} />
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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
