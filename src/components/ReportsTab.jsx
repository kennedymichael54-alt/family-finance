import React, { useState, useEffect } from 'react';

// Default themes
const defaultLightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
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
  info: '#3B82F6',
  bgMain: '#0c0a1d',
  bgCard: '#1e1b38',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  border: 'rgba(139, 92, 246, 0.2)',
  borderLight: 'rgba(255,255,255,0.1)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const reportCategories = [
  { id: 'income', label: 'Income', icon: '💵', color: '#10B981' },
  { id: 'expenses', label: 'Expenses', icon: '💳', color: '#EF4444' },
  { id: 'savings', label: 'Savings', icon: '💰', color: '#10B981' },
  { id: 'trends', label: 'Trends', icon: '📈', color: '#3B82F6' },
  { id: 'cashflow', label: 'Cash Flow', icon: '💸', color: '#8B5CF6' },
  { id: 'budget', label: 'Budget', icon: '🎯', color: '#F59E0B' },
];

export default function ReportsTab({ transactions = [], onNavigateToImport, theme: propTheme }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeReport, setActiveReport] = useState('income');

  const hasData = transactions && transactions.length > 0;

  return (
    <div>
      {/* Report Type Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {reportCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveReport(cat.id)}
            style={{
              padding: '10px 16px',
              background: activeReport === cat.id ? cat.color : theme.bgCard,
              color: activeReport === cat.id ? 'white' : theme.textSecondary,
              border: `1px solid ${activeReport === cat.id ? cat.color : theme.border}`,
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Report Content - Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Personal Report */}
        <div>
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Monthly {reportCategories.find(c => c.id === activeReport)?.label} Trend
            </h3>
            
            {hasData ? (
              <div style={{
                height: '200px',
                background: isDark ? 'rgba(139, 92, 246, 0.1)' : '#F5F6FA',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textMuted
              }}>
                Chart will appear here
              </div>
            ) : (
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textMuted
              }}>
                No data
              </div>
            )}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${theme.borderLight}` }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginBottom: '12px' }}>
                {reportCategories.find(c => c.id === activeReport)?.label} Sources
              </div>
              {hasData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Sample source items would go here */}
                </div>
              ) : (
                <div style={{ color: theme.textMuted, fontSize: '14px' }}>No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Side Hustle Report */}
        <div>
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Monthly {reportCategories.find(c => c.id === activeReport)?.label} Trend
            </h3>
            
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.textMuted
            }}>
              No data
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${theme.borderLight}` }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginBottom: '12px' }}>
                {reportCategories.find(c => c.id === activeReport)?.label} Sources
              </div>
              <div style={{ color: theme.textMuted, fontSize: '14px' }}>No data available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {!hasData && (
        <div style={{
          marginTop: '24px',
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>No Data Available</h3>
          <p style={{ color: theme.textMuted, marginBottom: '20px' }}>Import your transactions to see detailed reports</p>
          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              style={{
                padding: '12px 24px',
                background: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Import Transactions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
