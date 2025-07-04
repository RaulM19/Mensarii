import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type Transaction = {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  date: string; // ISO string for date
};

export type Pocket = {
  id: string;
  name: string;
  icon: string;
  currency: '$' | 'USD';
  transactions: Transaction[];
};
