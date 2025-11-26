import React from 'react';

/**
 * GoalsWithPercentage Component - REDESIGNED to match Family Finance aesthetic
 * 
 * Features:
 * - Clean progress bars with shimmer animation
 * - Color-coded percentage badges (red → yellow → green based on progress)
 * - Glassmorphic design matching the app
 * - No clunky buttons - just beautiful progress display
 * 
 * Props:
 * @param {Array} goals - Array of goal objects with structure:
 *   - id: unique identifier
 *   - name: goal name
 *   - emoji: goal icon
 *   - current: current amount saved
 *   - target: target amount
 *   - color: (optional) custom color for progress bar
 */

const GoalsWithPercentage = ({ goals = [] }) => {
  // Helper: Calculate percentage
  const getPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // Helper: Get badge color based on progress
  const getBadgeStyle = (percentage) => {
    if (percentage >= 90) {
      return {
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#10B981',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      };
    } else if (percentage >= 70) {
      return {
        background: 'rgba(139, 92, 246, 0.15)',
        color: '#8B5CF6',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      };
    } else if (percentage >= 40) {
      return {
        background: 'rgba(251, 191, 36, 0.15)',
        color: '#FBBF24',
        border: '1px solid rgba(251, 191, 36, 0.3)'
      };
    } else {
      return {
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#EF4444',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      };
    }
  };

  // Helper: Get progress bar gradient
  const getProgressGradient = (percentage) => {
    if (percentage >= 90) {
      return 'linear-gradient(90deg, #10B981, #14B8A6)';
    } else if (percentage >= 70) {
      return 'linear-gradient(90deg, #8B5CF6, #A78BFA)';
    } else if (percentage >= 40) {
      return 'linear-gradient(90deg, #F59E0B, #FBBF24)';
    } else {
      return 'linear-gradient(90deg, #EF4444, #F87171)';
    }
  };

  if (!goals || goals.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '32px', 
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px'
      }}>
        No goals yet. Start tracking your financial goals!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {goals.map((goal) => {
        const percentage = getPercentage(goal.current, goal.target);
        const badgeStyle = getBadgeStyle(percentage);
        const progressGradient = getProgressGradient(percentage);
        const remaining = Math.max(goal.target - goal.current, 0);

        return (
          <div
            key={goal.id}
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '14px 16px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            {/* Header: Name + Percentage Badge */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{goal.emoji || '🎯'}</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  {goal.name}
                </span>
              </div>
              
              {/* Percentage Badge */}
              <div style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                ...badgeStyle
              }}>
                {Math.round(percentage)}%
              </div>
            </div>

            {/* Progress Bar with Shimmer */}
            <div style={{
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '8px'
            }}>
              {/* Actual Progress */}
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: progressGradient,
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'width 0.5s ease'
              }}>
                {/* Shimmer Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s infinite'
                }} />
              </div>
            </div>

            {/* Footer: Current / Target + Remaining */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                ${goal.current?.toLocaleString() || 0} / ${goal.target?.toLocaleString() || 0}
              </span>
              {remaining > 0 && (
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ${remaining.toLocaleString()} to go
                </span>
              )}
              {percentage >= 100 && (
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  ✓ Achieved!
                </span>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GoalsWithPercentage;
