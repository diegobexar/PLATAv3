import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Budget } from '../types';
import * as budgetService from '../services/budgetService';

interface BudgetForm {
  name: string;
  month: string;
  totalLimit: number;
  rolloverEnabled: boolean;
  categories: {
    category: string;
    budgetedAmount: number;
    alertThreshold: number;
  }[];
}

const defaultCategories = [
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

const Budgets = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm<BudgetForm>({
    defaultValues: {
      categories: [{ category: '', budgetedAmount: 0, alertThreshold: 0.8 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories'
  });

  useEffect(() => {
    loadBudgets();
    loadCurrentBudget();
  }, []);

  const loadBudgets = async () => {
    try {
      setError('');
      const response = await budgetService.getBudgets();
      setBudgets(response.budgets);
    } catch (err) {
      console.error('Error loading budgets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load budgets');
    }
  };

  const loadCurrentBudget = async () => {
    try {
      const response = await budgetService.getCurrentMonthBudget();
      setCurrentBudget(response.budget);
    } catch (err) {
      console.error('No current month budget found');
      setCurrentBudget(null);
    }
  };

  const onSubmit = async (data: BudgetForm) => {
    try {
      setLoading(true);
      setError('');

      const budgetData = {
        ...data,
        categories: data.categories.filter(cat => cat.category && cat.budgetedAmount > 0)
      };

      if (editingBudget) {
        // Note: Budget update endpoint not implemented in backend yet
        console.log('Budget update not yet implemented', budgetData);
        setError('Budget editing not yet implemented');
      } else {
        await budgetService.createBudget(budgetData);
      }

      await loadBudgets();
      await loadCurrentBudget();
      
      reset();
      setShowForm(false);
      setEditingBudget(null);
    } catch (err) {
      console.error('Error saving budget:', err);
      setError(err instanceof Error ? err.message : 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
    
    setValue('name', budget.name);
    setValue('month', new Date(budget.month).toISOString().split('T')[0]);
    setValue('totalLimit', budget.totalLimit);
    setValue('rolloverEnabled', budget.rolloverEnabled);
    setValue('categories', budget.categories.map(cat => ({
      category: cat.category,
      budgetedAmount: cat.budgetedAmount,
      alertThreshold: cat.alertThreshold
    })));
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingBudget(null);
    reset({
      categories: [{ category: '', budgetedAmount: 0, alertThreshold: 0.8 }]
    });
  };

  const addCategory = () => {
    append({ category: '', budgetedAmount: 0, alertThreshold: 0.8 });
  };

  const calculateTotalBudgeted = () => {
    const categories = watch('categories') || [];
    return categories.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-2 sm:mt-0 btn btn-primary"
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Create Budget'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Month Budget Overview */}
      {currentBudget && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {new Date(currentBudget.month).toLocaleString('default', { month: 'long', year: 'numeric' })} Budget
            </h2>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
              <button
                onClick={() => handleEdit(currentBudget)}
                className="text-blue-600 hover:text-blue-800 p-2"
                title="Edit budget"
              >
                ✏️
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Budget</span>
              <span className="text-lg font-semibold text-gray-900">
                ${currentBudget.totalLimit.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: '42%' }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">42% of budget used</p>
          </div>
        </div>
      )}

      {/* Create/Edit Budget Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Name
                </label>
                <input
                  {...register('name', { required: 'Budget name is required' })}
                  type="text"
                  className="input"
                  placeholder="e.g., Monthly Budget 2024"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <input
                  {...register('month', { required: 'Month is required' })}
                  type="month"
                  className="input"
                />
                {errors.month && (
                  <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget Limit ($)
                </label>
                <input
                  {...register('totalLimit', { 
                    required: 'Total limit is required',
                    min: { value: 0.01, message: 'Amount must be positive' },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="3000.00"
                />
                {errors.totalLimit && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalLimit.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    {...register('rolloverEnabled')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable budget rollover</span>
                </label>
              </div>
            </div>

            {/* Budget Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">Budget Categories</h3>
                <button
                  type="button"
                  onClick={addCategory}
                  className="btn btn-secondary text-sm"
                >
                  + Add Category
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        {...register(`categories.${index}.category`, { required: 'Category is required' })}
                        className="input"
                      >
                        <option value="">Select category</option>
                        {defaultCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Amount ($)
                      </label>
                      <input
                        {...register(`categories.${index}.budgetedAmount`, { 
                          required: 'Amount is required',
                          min: { value: 0.01, message: 'Amount must be positive' },
                          valueAsNumber: true
                        })}
                        type="number"
                        step="0.01"
                        className="input"
                        placeholder="500.00"
                      />
                    </div>

                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alert %
                      </label>
                      <select
                        {...register(`categories.${index}.alertThreshold`, { valueAsNumber: true })}
                        className="input"
                      >
                        <option value={0.5}>50%</option>
                        <option value={0.75}>75%</option>
                        <option value={0.8}>80%</option>
                        <option value={0.9}>90%</option>
                        <option value={1}>100%</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-secondary p-2"
                      disabled={fields.length === 1}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total Budgeted:</strong> ${calculateTotalBudgeted().toFixed(2)} / ${watch('totalLimit') || 0}
                </p>
                {calculateTotalBudgeted() > (watch('totalLimit') || 0) && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Category budgets exceed total limit
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
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

      {/* Budget List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Budgets</h2>
        
        <div className="space-y-3">
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📋</span>
              <p className="text-lg font-medium">No budgets yet</p>
              <p>Create your first budget to start tracking your spending limits</p>
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{budget.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(budget.month).toLocaleString('default', { month: 'long', year: 'numeric' })} • 
                      ${budget.totalLimit.toLocaleString()} budget • 
                      {budget.categories.length} categories
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit budget"
                    >
                      ✏️
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

export default Budgets;