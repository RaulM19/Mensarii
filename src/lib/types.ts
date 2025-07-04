export type Transaction = {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  date: string; // ISO string for date
};

export type Arca = {
  id: string;
  name: string;
  icon: string;
  currency: '$' | 'USD';
  transactions: Transaction[];
};
