import React, { useState } from 'react';

/**
 * AccountFilterBar - Filter transactions by account type
 * Used in HomeBudget Hub tabs: Budget, Bills, Goals, Retirement, Reports
 */
const AccountFilterBar = ({ 
  selected = 'all', 
  onChange, 
  theme,
  showJoint = false // Only show Joint for couples sharing
}) => {
  const filters = [
    { id: 'all', label: 'All Accounts', icon: '📊' },
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'side_hustle', label: 'Side Hustle', icon: '💼' },
    ...(showJoint ? [{ id: 'joint', label: 'Joint', icon: '👥' }] : [])
  ];

  const isDark = theme?.mode === 'dark';

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '4px',
      background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      borderRadius: '12px',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
      width: 'fit-content'
    }}>
      {filters.map(filter => {
        const isActive = selected === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onChange?.(filter.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: isActive 
                ? 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
                : 'transparent',
              color: isActive 
                ? '#ffffff' 
                : (isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'),
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '14px' }}>{filter.icon}</span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default AccountFilterBar;
