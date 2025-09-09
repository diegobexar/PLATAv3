const Budgets = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <button className="mt-2 sm:mt-0 btn btn-primary">
          + Create Budget
        </button>
      </div>

      {/* Current Month Budget Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Budget
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            On Track
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Budget</span>
            <span className="text-lg font-semibold text-gray-900">$3,000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Spent</span>
            <span className="text-lg font-semibold text-red-600">$1,250</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Remaining</span>
            <span className="text-lg font-semibold text-green-600">$1,750</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: '42%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center">42% of budget used</p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Categories</h2>
        <div className="space-y-4">
          {[
            { category: 'Food & Dining', budgeted: 800, spent: 420, color: 'bg-blue-600' },
            { category: 'Transportation', budgeted: 300, spent: 180, color: 'bg-green-600' },
            { category: 'Shopping', budgeted: 500, spent: 320, color: 'bg-yellow-600' },
            { category: 'Entertainment', budgeted: 200, spent: 85, color: 'bg-purple-600' },
            { category: 'Bills & Utilities', budgeted: 600, spent: 245, color: 'bg-red-600' },
            { category: 'Other', budgeted: 600, spent: 0, color: 'bg-gray-600' }
          ].map((item) => {
            const percentage = (item.spent / item.budgeted) * 100;
            const isOverBudget = percentage > 100;
            const isWarning = percentage > 80;

            return (
              <div key={item.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.category}</h3>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${item.spent} / ${item.budgeted}
                    </p>
                    <p className={`text-xs ${
                      isOverBudget ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {percentage.toFixed(0)}% used
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-600' : isWarning ? 'bg-yellow-600' : item.color
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>Remaining: ${Math.max(0, item.budgeted - item.spent)}</span>
                  {isOverBudget && (
                    <span className="text-red-600 font-medium">
                      Over by ${item.spent - item.budgeted}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State for No Budgets */}
      <div className="card text-center py-12" style={{ display: 'none' }}>
        <span className="text-6xl mb-4 block">📋</span>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h2>
        <p className="text-gray-600 mb-6">
          Create your first budget to start tracking your spending limits
        </p>
        <button className="btn btn-primary">
          Create Your First Budget
        </button>
      </div>
    </div>
  );
};

export default Budgets;