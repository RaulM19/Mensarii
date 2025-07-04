"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, Gift, Home, PiggyBank, Plane, type LucideIcon } from 'lucide-react';
import type { Pocket, Transaction } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export const iconMap: { [key: string]: LucideIcon } = {
  piggyBank: PiggyBank,
  gift: Gift,
  car: Car,
  home: Home,
  plane: Plane,
};

interface PocketsContextType {
  pockets: Pocket[];
  addPocket: (name: string, initialBalance: number, currency: '$' | 'USD', icon: string) => void;
  addTransaction: (pocketId: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deletePocket: (pocketId: string) => void;
  getPocketById: (pocketId: string) => Pocket | undefined;
}

const PocketsContext = createContext<PocketsContextType | undefined>(undefined);

const initialPockets: Pocket[] = [
  {
    id: '1',
    name: 'Vacation Fund',
    icon: 'plane',
    currency: '$',
    transactions: [
      { id: 't1', type: 'deposit', amount: 1500, description: 'Initial deposit', date: '2025-01-15T10:00:00.000Z' },
      { id: 't2', type: 'deposit', amount: 200, description: 'Paycheck savings', date: '2025-02-15T10:00:00.000Z' },
      { id: 't3', type: 'withdrawal', amount: 300, description: 'Booked flights', date: '2025-03-05T10:00:00.000Z' },
    ],
  },
  {
    id: '2',
    name: 'New Car',
    icon: 'car',
    currency: '$',
    transactions: [
       { id: 't4', type: 'deposit', amount: 5000, description: 'Initial deposit', date: '2025-04-16T10:00:00.000Z' },
       { id: 't5', type: 'deposit', amount: 500, description: 'Monthly savings', date: '2025-05-15T10:00:00.000Z' },
       { id: 't6', type: 'deposit', amount: 500, description: 'Monthly savings', date: '2025-06-13T10:00:00.000Z' },
    ],
  },
  {
    id: '3',
    name: 'Emergency Fund',
    icon: 'piggyBank',
    currency: '$',
    transactions: [
      { id: 't7', type: 'deposit', amount: 2000, description: 'Initial deposit', date: '2025-04-16T10:00:00.000Z' },
    ],
  },
  {
    id: '4',
    name: 'Home Reno',
    icon: 'home',
    currency: 'USD',
    transactions: [
       { id: 't8', type: 'deposit', amount: 750, description: 'Side hustle income', date: '2025-06-25T10:00:00.000Z' },
    ],
  },
];

export const PocketsProvider = ({ children }: { children: ReactNode }) => {
  const [pockets, setPockets] = useState<Pocket[]>(initialPockets);
  const { toast } = useToast()

  const addPocket = (name: string, initialBalance: number, currency: '$' | 'USD', icon: string) => {
    const newPocket: Pocket = {
      id: uuidv4(),
      name,
      icon,
      currency,
      transactions: [],
    };
    if (initialBalance > 0) {
      newPocket.transactions.push({
        id: uuidv4(),
        type: 'deposit',
        amount: initialBalance,
        description: 'Initial deposit',
        date: new Date().toISOString(),
      });
    }
    setPockets([...pockets, newPocket]);
    toast({
      title: "Pocket Created!",
      description: `Your new pocket "${name}" is ready.`,
    })
  };

  const addTransaction = (pocketId: string, transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    
    const pocket = pockets.find(p => p.id === pocketId);

    setPockets(pockets.map(p => 
      p.id === pocketId 
        ? { ...p, transactions: [...p.transactions, newTransaction] }
        : p
    ));
    
    if (pocket) {
        toast({
        title: "Transaction Added",
        description: `A ${transaction.type} of ${pocket.currency}${transaction.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} was added.`,
        })
    }
  };

  const deletePocket = (pocketId: string) => {
    setPockets(pockets.filter(p => p.id !== pocketId));
     toast({
      title: "Pocket Deleted",
      description: `The pocket has been successfully deleted.`,
      variant: "destructive"
    })
  };

  const getPocketById = (pocketId: string) => {
    return pockets.find(p => p.id === pocketId);
  };

  return (
    <PocketsContext.Provider value={{ pockets, addPocket, addTransaction, deletePocket, getPocketById }}>
      {children}
    </PocketsContext.Provider>
  );
};

export const usePockets = () => {
  const context = useContext(PocketsContext);
  if (context === undefined) {
    throw new Error('usePockets must be used within a PocketsProvider');
  }
  return context;
};
