export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  alertThreshold: number;
}

export interface Budget {
  id: string;
  name: string;
  month: string;
  totalLimit: number;
  rolloverEnabled: boolean;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}