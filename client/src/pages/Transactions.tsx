import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Transaction } from '../types';
import * as transactionService from '../services/transactionService';

interface TransactionForm {
  amount: number;
  description: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Groceries',
  'Other'
];

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TransactionForm>();

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await transactionService.getTransactions({ limit: 50 });
      setTransactions(response.transactions);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TransactionForm) => {
    try {
      setLoading(true);
      setError('');

      if (editingTransaction) {
        // Update existing transaction
        await transactionService.updateTransaction(editingTransaction.id, data);
      } else {
        // Create new transaction
        await transactionService.createTransaction(data);
      }
      
      // Reload transactions to show updated data
      await loadTransactions();
      
      // Reset form and close
      reset();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
    
    // Populate form with transaction data
    setValue('amount', transaction.amount);
    setValue('description', transaction.description);
    setValue('category', transaction.category);
    setValue('type', transaction.type);
    setValue('date', new Date(transaction.date).toISOString().split('T')[0]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await transactionService.deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingTransaction(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-2 sm:mt-0 btn btn-primary"
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Transaction Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="input"
                >
                  <option value="">Select type</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be positive' },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                {...register('description', { required: 'Description is required' })}
                type="text"
                className="input"
                placeholder="What was this for?"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="input"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          )}
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">💳</span>
              <p className="text-lg font-medium">No transactions yet</p>
              <p>Add your first transaction to get started!</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-4">
                    {transaction.type === 'EXPENSE' ? '💸' : '💰'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'EXPENSE' ? '-' : '+'}${transaction.amount}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.type.toLowerCase()}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit transaction"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete transaction"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;