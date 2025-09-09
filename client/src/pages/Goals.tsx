const Goals = () => {
  const goals = [
    {
      id: 1,
      title: 'Emergency Fund',
      description: 'Build an emergency fund for unexpected expenses',
      targetAmount: 10000,
      currentAmount: 3500,
      targetDate: '2024-12-31',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Vacation to Europe',
      description: 'Save for a 2-week trip to Europe',
      targetAmount: 5000,
      currentAmount: 1200,
      targetDate: '2024-07-01',
      isCompleted: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <button className="mt-2 sm:mt-0 btn btn-primary">
          + Add Goal
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
          <p className="text-sm text-gray-600">Active Goals</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-2xl font-bold text-green-600">
            ${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Saved</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600">Goals Completed</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysLeft = goal.targetDate 
            ? Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div key={goal.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>${goal.currentAmount.toLocaleString()} saved</span>
                    <span>•</span>
                    <span>${goal.targetAmount.toLocaleString()} target</span>
                    {daysLeft !== null && (
                      <>
                        <span>•</span>
                        <span className={daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : ''}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
                  <button className="btn btn-secondary text-sm">
                    Add Money
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-2">
                    ⚙️
                  </button>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-600">{progress.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${remaining.toLocaleString()} remaining</span>
                  {progress >= 100 && (
                    <span className="text-green-600 font-medium">🎉 Goal achieved!</span>
                  )}
                </div>
              </div>

              {/* Monthly Suggestion */}
              {daysLeft && daysLeft > 0 && remaining > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Save <strong>${Math.ceil(remaining / Math.ceil(daysLeft / 30))}</strong> per month 
                    to reach this goal on time
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="card text-center py-12">
          <span className="text-6xl mb-4 block">🎯</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No savings goals yet</h2>
          <p className="text-gray-600 mb-6">
            Set your first savings goal and start building your financial future
          </p>
          <button className="btn btn-primary">
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;