import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    recentTransactions: [],
    budgetStatus: 'On track'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/transactions"
          className="mt-2 sm:mt-0 btn btn-primary inline-flex items-center"
        >
          <span className="mr-2">+</span>
          Add Transaction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">💸</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.totalIncome - stats.totalExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Status</p>
              <p className="text-lg font-semibold text-gray-900">{stats.budgetStatus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/transactions"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">💳</span>
            <span className="text-sm font-medium text-gray-700">Add Expense</span>
          </Link>
          <Link
            to="/budgets"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Create Budget</span>
          </Link>
          <Link
            to="/goals"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">🎯</span>
            <span className="text-sm font-medium text-gray-700">Set Goal</span>
          </Link>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
            <span className="text-2xl mb-2">🤖</span>
            <span className="text-sm font-medium text-gray-700">AI Insights</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm">Start by adding your first transaction!</p>
            </div>
          ) : (
            stats.recentTransactions.map((transaction: any, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{transaction.type === 'EXPENSE' ? '💸' : '💰'}</span>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'EXPENSE' ? '-' : '+'}${transaction.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;