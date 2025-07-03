"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, Gift, Home, PiggyBank } from 'lucide-react';
import type { Pocket, Transaction } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";


interface PocketsContextType {
  pockets: Pocket[];
  addPocket: (name: string, initialBalance: number) => void;
  addTransaction: (pocketId: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deletePocket: (pocketId: string) => void;
  getPocketById: (pocketId: string) => Pocket | undefined;
}

const PocketsContext = createContext<PocketsContextType | undefined>(undefined);

const initialPockets: Pocket[] = [
  {
    id: '1',
    name: 'Vacation Fund',
    icon: Gift,
    transactions: [
      { id: 't1', type: 'deposit', amount: 1500, description: 'Initial deposit', date: '2024-06-15T10:00:00.000Z' },
      { id: 't2', type: 'deposit', amount: 200, description: 'Paycheck savings', date: '2024-06-30T10:00:00.000Z' },
      { id: 't3', type: 'withdrawal', amount: 300, description: 'Booked flights', date: '2024-07-05T10:00:00.000Z' },
    ],
  },
  {
    id: '2',
    name: 'New Car',
    icon: Car,
    transactions: [
       { id: 't4', type: 'deposit', amount: 5000, description: 'Initial deposit', date: '2024-05-16T10:00:00.000Z' },
       { id: 't5', type: 'deposit', amount: 500, description: 'Monthly savings', date: '2024-06-15T10:00:00.000Z' },
       { id: 't6', type: 'deposit', amount: 500, description: 'Monthly savings', date: '2024-07-13T10:00:00.000Z' },
    ],
  },
  {
    id: '3',
    name: 'Emergency Fund',
    icon: PiggyBank,
    transactions: [
      { id: 't7', type: 'deposit', amount: 2000, description: 'Initial deposit', date: '2024-04-16T10:00:00.000Z' },
    ],
  },
  {
    id: '4',
    name: 'Home Reno',
    icon: Home,
    transactions: [
       { id: 't8', type: 'deposit', amount: 750, description: 'Side hustle income', date: '2024-06-25T10:00:00.000Z' },
    ],
  },
];

const icons = [Gift, Car, PiggyBank, Home];

export const PocketsProvider = ({ children }: { children: ReactNode }) => {
  const [pockets, setPockets] = useState<Pocket[]>(initialPockets);
  const { toast } = useToast()

  const addPocket = (name: string, initialBalance: number) => {
    const newPocket: Pocket = {
      id: uuidv4(),
      name,
      icon: icons[pockets.length % icons.length],
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
    
    setPockets(pockets.map(p => 
      p.id === pocketId 
        ? { ...p, transactions: [...p.transactions, newTransaction] }
        : p
    ));
    toast({
      title: "Transaction Added",
      description: `A ${transaction.type} of $${transaction.amount.toFixed(2)} was added.`,
    })
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
