import React, { useState, useEffect } from 'react';

// Default themes
const defaultLightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgMain: '#F5F6FA',
  bgCard: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const defaultDarkTheme = {
  mode: 'dark',
  primary: '#8B5CF6',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgMain: '#0c0a1d',
  bgCard: '#1e1b38',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  border: 'rgba(139, 92, 246, 0.2)',
  borderLight: 'rgba(255,255,255,0.1)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const defaultGoals = [
  { id: 1, name: 'Emergency Fund', description: '6 months of expenses', icon: '🛡️', current: 12500, target: 15000, startDate: '12/31/2023', targetDate: '12/30/2024' },
  { id: 2, name: 'Vacation Fund', description: 'Dream vacation to Europe', icon: '✈️', current: 2800, target: 5000, startDate: '2/26/2024', targetDate: '7/31/2024' },
  { id: 3, name: 'New Car', description: 'Down payment for new vehicle', icon: '🚗', current: 8500, target: 25000, startDate: '5/31/2023', targetDate: '5/01/2025' },
];

export default function GoalsTimelineWithCelebration({ goals: propGoals, onUpdateGoals, theme: propTheme }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const goals = propGoals && propGoals.length > 0 ? propGoals : defaultGoals;

  const milestones = [100, 300, 500, 1000];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ fontSize: '28px' }}>🎯</span>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Financial Goals</h1>
      </div>

      {/* Goals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {goals.map((goal, index) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          const remaining = goal.target - goal.current;
          
          return (
            <div
              key={goal.id}
              style={{
                background: theme.bgCard,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${theme.borderLight}`,
                boxShadow: theme.cardShadow
              }}
            >
              {/* Goal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {goal.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>{goal.name}</h3>
                  <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>{goal.description}</p>
                </div>
              </div>

              {/* Progress Section */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: theme.textSecondary }}>Progress</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: theme.primary }}>
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  height: '12px',
                  background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    background: `linear-gradient(90deg, ${theme.success}, ${theme.primary})`,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: theme.success }}>{progress}% complete</span>
                  <span style={{ color: theme.textMuted }}>{formatCurrency(remaining)} remaining</span>
                </div>
              </div>

              {/* Milestones */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {milestones.map((milestone, i) => {
                  const isReached = goal.current >= milestone;
                  return (
                    <div
                      key={milestone}
                      style={{
                        padding: '12px',
                        background: isReached 
                          ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5')
                          : (isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain),
                        border: `1px solid ${isReached ? theme.success : theme.borderLight}`,
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '600', color: isReached ? theme.success : theme.textMuted }}>
                        +${milestone}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dates */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: theme.textMuted }}>
                <span>Started {goal.startDate}</span>
                <span>Target {goal.targetDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Button */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button style={{
          padding: '12px 24px',
          background: theme.primary,
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          + Add New Goal
        </button>
      </div>
    </div>
  );
}
