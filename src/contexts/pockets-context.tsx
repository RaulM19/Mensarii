"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, Gift, Home, PiggyBank, Plane, type LucideIcon } from 'lucide-react';
import type { Arca, Transaction } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export const iconMap: { [key: string]: LucideIcon } = {
  piggyBank: PiggyBank,
  gift: Gift,
  car: Car,
  home: Home,
  plane: Plane,
};

interface ArcasContextType {
  arcas: Arca[];
  addArca: (name: string, initialBalance: number, currency: '$' | 'USD', icon: string) => void;
  addTransaction: (arcaId: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteArca: (arcaId: string) => void;
  getArcaById: (arcaId: string) => Arca | undefined;
}

const ArcasContext = createContext<ArcasContextType | undefined>(undefined);

const initialArcas: Arca[] = [
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

const LOCAL_STORAGE_KEY = 'mensarii.arcas';

export const ArcasProvider = ({ children }: { children: ReactNode }) => {
  const [arcas, setArcas] = useState<Arca[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    try {
      const savedArcas = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedArcas) {
        setArcas(JSON.parse(savedArcas));
      } else {
        setArcas(initialArcas);
      }
    } catch (error) {
      console.error("Failed to load arcas from localStorage", error);
      setArcas(initialArcas);
    }
  }, []);

  useEffect(() => {
    if (arcas.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(arcas));
    }
  }, [arcas]);

  const addArca = (name: string, initialBalance: number, currency: '$' | 'USD', icon: string) => {
    const newArca: Arca = {
      id: uuidv4(),
      name,
      icon,
      currency,
      transactions: [],
    };
    if (initialBalance > 0) {
      newArca.transactions.push({
        id: uuidv4(),
        type: 'deposit',
        amount: initialBalance,
        description: 'Initial deposit',
        date: new Date().toISOString(),
      });
    }
    setArcas([...arcas, newArca]);
    toast({
      title: "Arca Created!",
      description: `Your new arca "${name}" is ready.`,
    })
  };

  const addTransaction = (arcaId: string, transaction: Omit<Transaction, 'id' | 'date'>) => {
    const finalDescription = transaction.description.trim() || (transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal');

    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date().toISOString(),
      description: finalDescription,
    };
    
    const arca = arcas.find(p => p.id === arcaId);

    setArcas(arcas.map(p => 
      p.id === arcaId 
        ? { ...p, transactions: [...p.transactions, newTransaction] }
        : p
    ));
    
    if (arca) {
        toast({
        title: "Transaction Added",
        description: `A ${transaction.type} of ${arca.currency}${transaction.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} was added.`,
        })
    }
  };

  const deleteArca = (arcaId: string) => {
    const arca = arcas.find(p => p.id === arcaId);
    if (arca) {
      setArcas(arcas.filter(p => p.id !== arcaId));
       toast({
        title: "Arca Deleted",
        description: `The "${arca.name}" arca has been successfully deleted.`,
        variant: "destructive"
      })
    }
  };

  const getArcaById = (arcaId: string) => {
    return arcas.find(p => p.id === arcaId);
  };

  return (
    <ArcasContext.Provider value={{ arcas, addArca, addTransaction, deleteArca, getArcaById }}>
      {children}
    </ArcasContext.Provider>
  );
};

export const useArcas = () => {
  const context = useContext(ArcasContext);
  if (context === undefined) {
    throw new Error('useArcas must be used within an ArcasProvider');
  }
  return context;
};
