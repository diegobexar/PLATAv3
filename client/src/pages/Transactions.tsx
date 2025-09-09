import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionForm>();

  const onSubmit = async (data: TransactionForm) => {
    try {
      setLoading(true);
      // Here we'll make the API call to create a transaction
      console.log('Creating transaction:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add to local state for now
      const newTransaction = {
        id: Date.now().toString(),
        ...data,
        date: new Date(data.date).toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setTransactions([newTransaction, ...transactions]);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-2 sm:mt-0 btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h2>
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
                    min: { value: 0.01, message: 'Amount must be positive' }
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
                {loading ? 'Adding...' : 'Add Transaction'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">💳</span>
              <p className="text-lg font-medium">No transactions yet</p>
              <p>Add your first transaction to get started!</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-4">
                    {transaction.type === 'EXPENSE' ? '💸' : '💰'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}${transaction.amount}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.type.toLowerCase()}</p>
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