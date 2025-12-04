import React, { useState, useEffect, useMemo } from 'react';

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

// Mini Sparkline Component
const Sparkline = ({ data, color, width = 60, height = 30 }) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} />;
  }
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function ReportsTab({ transactions = [], onNavigateToImport, theme: propTheme, lastImportDate }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeReport, setActiveReport] = useState('income');
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    personalReport: false,
    sideHustleReport: false,
    summary: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasData = transactions && transactions.length > 0;
  
  // Calculate totals
  const totals = useMemo(() => {
    const income = transactions.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    return { income, expenses, savings: income - expenses };
  }, [transactions]);
  
  // Generate sparkline data
  const generateSparklineData = (total, length = 12) => {
    const avg = total / length;
    return Array.from({ length }, () => Math.max(0, avg * (0.7 + Math.random() * 0.6)));
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Reports</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              Financial insights and analytics
            </p>
            {lastImportDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#10B98115', borderRadius: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
                  Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Type Selector Pills */}
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
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              boxShadow: activeReport === cat.id ? `0 4px 12px ${cat.color}40` : theme.cardShadow,
              transition: 'all 0.2s'
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Summary Stats Cards - 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Total Income Card - Cyan */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
          border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💰</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Total Income</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064', marginBottom: '8px' }}>
            {formatCurrency(totals.income)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>↗ 12%</span>
            <Sparkline data={generateSparklineData(totals.income)} color="#00BCD4" />
          </div>
        </div>

        {/* Total Expenses Card - Orange */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
          border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💳</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Total Expenses</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C', marginBottom: '8px' }}>
            {formatCurrency(totals.expenses)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444' }}>↗ 5%</span>
            <Sparkline data={generateSparklineData(totals.expenses)} color="#FF9800" />
          </div>
        </div>

        {/* Net Savings Card - Green */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
          border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📊</div>
            <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Net Savings</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20', marginBottom: '8px' }}>
            {formatCurrency(totals.savings)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: totals.savings >= 0 ? '#10B981' : '#EF4444' }}>
              {totals.savings >= 0 ? '↗' : '↘'} {((totals.savings / totals.income) * 100).toFixed(0) || 0}%
            </span>
            <Sparkline data={generateSparklineData(Math.abs(totals.savings))} color="#4CAF50" />
          </div>
        </div>

        {/* Transactions Card - Purple */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📑</div>
            <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Transactions</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C', marginBottom: '8px' }}>
            {transactions.length.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#8B5CF6' }}>total</span>
            <Sparkline data={generateSparklineData(transactions.length * 10)} color="#9C27B0" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PERSONAL REPORT (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('personalReport')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.personalReport ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #8B5CF6 0%, #06B6D4 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Personal {reportCategories.find(c => c.id === activeReport)?.label} Report</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>Monthly trends</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.personalReport ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Report Content - Two Column Layout */}
      {!collapsedSections.personalReport && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Personal Report */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)'
          }} />
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {/* Side Hustle Report */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)'
          }} />
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Side Hustle {reportCategories.find(c => c.id === activeReport)?.label} Trend
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
      )}

      {/* Summary Stats - Empty State or Report */}
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
