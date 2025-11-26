import React, { useState, useEffect } from 'react';

const GoalsTimelineWithCelebration = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      description: '6 months of expenses',
      icon: '🏦',
      current: 8500,
      target: 15000,
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      completed: false,
      archived: false,
    },
    {
      id: 2,
      name: 'Vacation Fund',
      icon: '✈️',
      current: 5000,
      target: 5000,
      startDate: '2023-06-01',
      targetDate: '2024-06-30',
      completed: true,
      archived: false,
      completedDate: '2024-05-15',
    },
    {
      id: 3,
      name: 'New Car',
      icon: '🚗',
      current: 12000,
      target: 20000,
      startDate: '2023-01-01',
      targetDate: '2025-01-01',
      completed: false,
      archived: false,
    },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  // Confetti effect
  const Confetti = () => {
    const confettiCount = 50;
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(confettiCount)].map((_, i) => {
          const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          const left = Math.random() * 100;
          const animationDelay = Math.random() * 0.5;
          const animationDuration = 2 + Math.random() * 2;
          
          return (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                backgroundColor: color,
                left: `${left}%`,
                top: '-10px',
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Calculate days remaining
  const getDaysRemaining = (targetDate) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate progress percentage
  const calculatePercentage = (current, target) => {
    if (!target || target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  // Calculate days elapsed
  const getDaysElapsed = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Calculate total timeline duration
  const getTotalDays = (startDate, targetDate) => {
    const start = new Date(startDate);
    const target = new Date(targetDate);
    const diffTime = target - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mark goal as completed
  const completeGoal = (goalId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId && !goal.completed) {
        setCelebratingGoal(goal);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setCelebratingGoal(null);
        }, 4000);
        
        return {
          ...goal,
          completed: true,
          completedDate: new Date().toISOString().split('T')[0],
          current: goal.target, // Set current to target
        };
      }
      return goal;
    }));
  };

  // Archive goal
  const archiveGoal = (goalId) => {
    if (confirm('Archive this goal? You can view it in archived goals later.')) {
      setGoals(goals.map(goal =>
        goal.id === goalId ? { ...goal, archived: true } : goal
      ));
    }
  };

  // Unarchive goal
  const unarchiveGoal = (goalId) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, archived: false } : goal
    ));
  };

  // Add funds to goal
  const addFunds = (goalId, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = goal.current + amount;
        const newGoal = { ...goal, current: newCurrent };
        
        // Check if goal is now complete
        if (newCurrent >= goal.target && !goal.completed) {
          completeGoal(goalId);
        }
        
        return newGoal;
      }
      return goal;
    }));
  };

  const activeGoals = goals.filter(g => !g.archived);
  const archivedGoals = goals.filter(g => g.archived);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Celebration Modal */}
      {celebratingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4 animate-spin-slow">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              You've achieved your goal:
            </p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              {celebratingGoal.icon} {celebratingGoal.name}
            </p>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-green-800">
                ${celebratingGoal.target.toLocaleString()} Achieved! 🎊
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Great job staying committed to your financial goals!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Goals</h1>
          <p className="text-gray-600">Track your progress and celebrate achievements</p>
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          {showArchived ? 'Show Active' : 'Show Archived'} ({archivedGoals.length})
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {(showArchived ? archivedGoals : activeGoals).map((goal) => {
          const percentage = calculatePercentage(goal.current, goal.target);
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const daysElapsed = getDaysElapsed(goal.startDate);
          const totalDays = getTotalDays(goal.startDate, goal.targetDate);
          const timelinePercentage = Math.min((daysElapsed / totalDays) * 100, 100);
          const isOverdue = daysRemaining < 0 && !goal.completed;
          const remaining = goal.target - goal.current;

          return (
            <div
              key={goal.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                goal.completed ? 'border-2 border-green-300' : 'border border-gray-200'
              } ${goal.archived ? 'opacity-75' : ''}`}
            >
              <div className="p-6">
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{goal.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {goal.name}
                        {goal.completed && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                        {goal.archived && (
                          <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
                            Archived
                          </span>
                        )}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      )}
                    </div>
                  </div>

                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                    goal.completed ? 'bg-green-100 text-green-700' :
                    percentage >= 75 ? 'bg-blue-100 text-blue-700' :
                    percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {percentage}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                    {!goal.completed && remaining > 0 && (
                      <span className="font-medium">${remaining.toLocaleString()} to go</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        goal.completed ? 'bg-green-600' :
                        percentage >= 75 ? 'bg-blue-600' :
                        percentage >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      Started: {new Date(goal.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      {goal.completed ? (
                        `Completed: ${new Date(goal.completedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      ) : (
                        `Target: ${new Date(goal.targetDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        goal.completed ? 'bg-green-400' :
                        isOverdue ? 'bg-red-400' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${goal.completed ? 100 : timelinePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Days Indicator */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Days Elapsed</p>
                    <p className="text-lg font-bold text-gray-800">{daysElapsed} days</p>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    goal.completed ? 'bg-green-50' :
                    isOverdue ? 'bg-red-50' :
                    daysRemaining <= 30 ? 'bg-orange-50' :
                    'bg-blue-50'
                  }`}>
                    <p className="text-xs mb-1" style={{
                      color: goal.completed ? '#16a34a' :
                             isOverdue ? '#dc2626' :
                             daysRemaining <= 30 ? '#ea580c' :
                             '#2563eb'
                    }}>
                      {goal.completed ? 'Completed Early' : isOverdue ? 'Overdue' : 'Days Remaining'}
                    </p>
                    <p className="text-lg font-bold" style={{
                      color: goal.completed ? '#15803d' :
                             isOverdue ? '#b91c1c' :
                             daysRemaining <= 30 ? '#c2410c' :
                             '#1e40af'
                    }}>
                      {goal.completed ? 
                        `${Math.abs(getDaysRemaining(goal.completedDate))} days early` :
                        `${Math.abs(daysRemaining)} days ${isOverdue ? 'overdue' : 'left'}`
                      }
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!goal.completed && !goal.archived && (
                    <>
                      <button
                        onClick={() => addFunds(goal.id, 100)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add $100
                      </button>
                      {percentage >= 100 && (
                        <button
                          onClick={() => completeGoal(goal.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Complete
                        </button>
                      )}
                    </>
                  )}
                  
                  {goal.completed && !goal.archived && (
                    <button
                      onClick={() => archiveGoal(goal.id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Archive Goal
                    </button>
                  )}

                  {goal.archived && (
                    <button
                      onClick={() => unarchiveGoal(goal.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restore Goal
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeGoals.length === 0 && !showArchived && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Goals</h3>
          <p className="text-gray-600">Create your first financial goal to get started!</p>
        </div>
      )}
    </div>
  );
};

// Add these animations to your global CSS
const animationStyles = `
@keyframes confetti {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-confetti {
  animation: confetti linear forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
`;

export default GoalsTimelineWithCelebration;
