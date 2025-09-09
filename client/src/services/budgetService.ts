import { Budget, BudgetCategory } from '../types';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface CreateBudgetData {
  name: string;
  month: string; // ISO date string
  totalLimit: number;
  rolloverEnabled: boolean;
  categories: {
    category: string;
    budgetedAmount: number;
    alertThreshold?: number;
  }[];
}

export const getBudgets = async (): Promise<{ budgets: Budget[] }> => {
  const response = await fetch(`${API_BASE}/budgets`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to fetch budgets');
  }

  return response.json();
};

export const createBudget = async (data: CreateBudgetData): Promise<{ budget: Budget }> => {
  const response = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to create budget');
  }

  return response.json();
};

export const getBudget = async (id: string): Promise<{ budget: Budget }> => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to fetch budget');
  }

  return response.json();
};

export const getCurrentMonthBudget = async (): Promise<{ budget: Budget }> => {
  const response = await fetch(`${API_BASE}/budgets/current/month`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to fetch current month budget');
  }

  return response.json();
};

export const updateBudget = async (
  id: string, 
  data: Partial<CreateBudgetData>
): Promise<{ budget: Budget }> => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to update budget');
  }

  return response.json();
};

export const deleteBudget = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to delete budget');
  }
};