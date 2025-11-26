import React from 'react';

const GoalsWithPercentage = ({ goals = [] }) => {
  const calculatePercentage = (current, target) => {
    if (!target || target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(Math.round(percentage), 100); // Cap at 100%
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 75) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-yellow-600';
    if (percentage >= 25) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map((goal) => {
        const percentage = calculatePercentage(goal.current, goal.target);
        const remaining = goal.target - goal.current;
        
        return (
          <div
            key={goal.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
          >
            {/* Percentage Badge - Top Right */}
            <div className="absolute top-4 right-4">
              <div
                className={`${getPercentageColor(percentage)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1`}
              >
                {percentage >= 100 ? (
                  <>
                    <svg 
                      className="w-4 h-4" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span>100%</span>
                  </>
                ) : (
                  <span>{percentage}%</span>
                )}
              </div>
            </div>

            {/* Goal Icon */}
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{goal.icon || '🎯'}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {goal.name}
                </h3>
                {goal.description && (
                  <p className="text-sm text-gray-500">{goal.description}</p>
                )}
              </div>
            </div>

            {/* Progress Information */}
            <div className="space-y-3 mb-4">
              {/* Current vs Target */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-800">
                  ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                </span>
              </div>

              {/* Remaining Amount */}
              {remaining > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-red-600">
                    ${remaining.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Goal Achievement Status */}
              {percentage >= 100 && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Goal Achieved!
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${getProgressBarColor(percentage)} h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </div>
              </div>
              
              {/* Progress Text on Bar (for larger percentages) */}
              {percentage > 15 && (
                <div className="absolute inset-0 flex items-center justify-start pl-3">
                  <span className="text-xs font-bold text-white drop-shadow">
                    {percentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Optional: Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2 px-3 rounded-md transition-colors">
                Add Funds
              </button>
              <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium py-2 px-3 rounded-md transition-colors">
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add this to your global CSS for the shimmer animation
const shimmerStyles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

export default GoalsWithPercentage;

// Example usage:
// const exampleGoals = [
//   {
//     id: 1,
//     name: 'Emergency Fund',
//     description: 'Save for 6 months expenses',
//     icon: '🏦',
//     current: 8500,
//     target: 15000,
//   },
//   {
//     id: 2,
//     name: 'Vacation Fund',
//     icon: '✈️',
//     current: 3200,
//     target: 5000,
//   },
//   {
//     id: 3,
//     name: 'New Car',
//     icon: '🚗',
//     current: 12000,
//     target: 12000, // Completed goal
//   },
// ];
