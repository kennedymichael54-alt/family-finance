import React, { useState, useEffect } from 'react';

/**
 * GoalsTimelineWithCelebration - REDESIGNED for modern aesthetic
 * 
 * Clean goal tracking with progress visualization
 */

const GoalsTimelineWithCelebration = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      emoji: '🛡️',
      current: 12500,
      target: 15000,
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      description: '6 months of expenses',
      archived: false
    },
    {
      id: 2,
      name: 'Vacation Fund',
      emoji: '✈️',
      current: 2800,
      target: 5000,
      startDate: new Date('2024-03-01'),
      targetDate: new Date('2024-08-01'),
      description: 'Dream vacation to Europe',
      archived: false
    },
    {
      id: 3,
      name: 'New Car',
      emoji: '🚗',
      current: 8500,
      target: 25000,
      startDate: new Date('2023-06-01'),
      targetDate: new Date('2025-06-01'),
      description: 'Down payment for new vehicle',
      archived: false
    }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState(null);

  const addFunds = (goalId, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        const wasIncomplete = goal.current < goal.target;
        const isNowComplete = newCurrent >= goal.target;
        
        if (wasIncomplete && isNowComplete) {
          setCelebratingGoal(goal);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
        
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const archiveGoal = (goalId) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, archived: !g.archived } : g));
  };

  const activeGoals = goals.filter(g => !g.archived);
  const archivedGoals = goals.filter(g => g.archived);

  return (
    <div style={{ animation: 'slideIn 0.3s ease', position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
          🎯 Financial Goals
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          Track your progress towards financial milestones
        </p>
      </div>

      {/* Active Goals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {activeGoals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = Math.max(goal.target - goal.current, 0);
          const isComplete = percentage >= 100;

          // Calculate time progress
          const now = new Date();
          const totalTime = goal.targetDate - goal.startDate;
          const elapsed = now - goal.startDate;
          const timePercentage = Math.min((elapsed / totalTime) * 100, 100);

          return (
            <div
              key={goal.id}
              style={{
                background: isComplete 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))'
                  : 'rgba(30, 27, 56, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                border: isComplete 
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '36px' }}>{goal.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                      {goal.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {goal.description}
                    </p>
                  </div>
                </div>
                
                {isComplete && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#10B981'
                  }}>
                    ✓ Achieved!
                  </div>
                )}
              </div>

              {/* Progress Info */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    Progress
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                </div>
                
                {/* Financial Progress Bar */}
                <div style={{
                  height: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: isComplete
                      ? 'linear-gradient(90deg, #10B981, #14B8A6)'
                      : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>{Math.round(percentage)}% complete</span>
                  {!isComplete && <span>${remaining.toLocaleString()} remaining</span>}
                </div>
              </div>

              {/* Action Buttons */}
              {!isComplete && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {[100, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => addFunds(goal.id, amount)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '8px',
                        color: '#8B5CF6',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                      }}
                    >
                      +${amount}
                    </button>
                  ))}
                </div>
              )}

              {/* Timeline */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  <span>Started {goal.startDate.toLocaleDateString()}</span>
                  <span>Target {goal.targetDate.toLocaleDateString()}</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${timePercentage}%`,
                    height: '100%',
                    background: 'rgba(251, 191, 36, 0.6)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Archive Button */}
              {isComplete && (
                <button
                  onClick={() => archiveGoal(goal.id)}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Archive Goal
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Archived Goals */}
      {archivedGoals.length > 0 && (
        <div style={{
          background: 'rgba(30, 27, 56, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
            📦 Archived Goals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {archivedGoals.map(goal => (
              <div
                key={goal.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px', opacity: 0.5 }}>{goal.emoji}</span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{goal.name}</span>
                </div>
                <button
                  onClick={() => archiveGoal(goal.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && celebratingGoal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(30, 27, 56, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '2px solid rgba(16, 185, 129, 0.5)',
          boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)',
          zIndex: 1000,
          animation: 'bounce-in 0.5s ease-out',
          textAlign: 'center',
          minWidth: '300px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
            Goal Achieved!
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
            {celebratingGoal.emoji} {celebratingGoal.name}
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            ${celebratingGoal.target.toLocaleString()} saved!
          </p>
        </div>
      )}

      {/* Confetti Overlay */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 999
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '8px',
                height: '8px',
                background: ['#8B5CF6', '#EC4899', '#10B981', '#FBBF24', '#3B82F6'][i % 5],
                borderRadius: '50%',
                animation: `confetti ${2 + Math.random()}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GoalsTimelineWithCelebration;
