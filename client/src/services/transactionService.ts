import { Transaction } from '../types';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface CreateTransactionData {
  amount: number;
  description: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date?: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TransactionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`${API_BASE}/transactions?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to fetch transactions');
  }

  return response.json();
};

export const createTransaction = async (data: CreateTransactionData): Promise<{ transaction: Transaction }> => {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to create transaction');
  }

  return response.json();
};

export const getTransaction = async (id: string): Promise<{ transaction: Transaction }> => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to fetch transaction');
  }

  return response.json();
};

export const updateTransaction = async (
  id: string, 
  data: Partial<CreateTransactionData>
): Promise<{ transaction: Transaction }> => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to update transaction');
  }

  return response.json();
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || 'Failed to delete transaction');
  }
};