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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function BudgetTab({ transactions = [], onNavigateToImport, theme: propTheme }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [categories, setCategories] = useState([]);

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate totals from transactions
  const totalIncome = transactions.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = transactions.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
  const surplus = totalIncome - totalExpenses;
  const budgetTotal = 500; // Default budget
  const spent = totalExpenses;
  const healthPercent = budgetTotal > 0 ? Math.round(((budgetTotal - spent) / budgetTotal) * 100) : 100;

  return (
    <div>
      {/* Year/Month Selector Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          {[selectedYear - 2, selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                padding: '8px 16px',
                background: selectedYear === year ? 'white' : 'rgba(255,255,255,0.2)',
                color: selectedYear === year ? theme.primary : 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {year}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {months.map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              style={{
                padding: '6px 12px',
                background: selectedMonth === month ? 'white' : 'transparent',
                color: selectedMonth === month ? theme.primary : 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: selectedMonth === month ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {month === 'All' ? '📅 All' : month}
            </button>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '12px', color: 'white', fontSize: '14px' }}>
          📅 Viewing: <strong>{selectedMonth === 'All' ? `All of ${selectedYear}` : `${selectedMonth} ${selectedYear}`}</strong>
        </div>
      </div>

      {/* Two Column Layout - Personal & Side Hustle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Personal Budget */}
        <div>
          {/* Header Card */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))' : 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#C7D2FE'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: theme.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏠</div>
              <div>
                <div style={{ fontWeight: '600', color: theme.textPrimary }}>Personal Budget</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>0 categories</div>
              </div>
            </div>
            <button style={{ padding: '8px 16px', background: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              + Add Category
            </button>
          </div>

          {/* Budget Health */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏦 Budget Health Overview
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {/* Health Circle */}
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'} strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={theme.success} strokeWidth="12" strokeDasharray={`${healthPercent * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>{healthPercent}%</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>Health</div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>Actual vs Budget</span>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>0% used</span>
                </div>
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '16px' }}>
                  Spent: {formatCurrency(spent)} | Budget: {formatCurrency(budgetTotal)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>on track</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.danger }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>over budget</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EDE9FE', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.primary }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>Categories</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>+{formatCurrency(surplus)}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>Net</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Income/Expense/Surplus Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: theme.success, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💵 Income</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(totalIncome)}</div>
            </div>
            <div style={{ background: theme.danger, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💳 Expenses</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(totalExpenses)}</div>
            </div>
            <div style={{ background: theme.primary, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📈 Surplus</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>+{formatCurrency(surplus)}</div>
            </div>
          </div>

          {/* Categories */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Categories - Actual vs Budget</h3>
              <select style={{ padding: '6px 12px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '13px', color: theme.textPrimary }}>
                <option>Highest Spent</option>
                <option>Lowest Spent</option>
              </select>
            </div>
            <div style={{ textAlign: 'center', padding: '40px', color: theme.textMuted }}>
              No spending data
            </div>
          </div>
        </div>

        {/* Side Hustle Budget */}
        <div>
          {/* Header Card */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.1))' : 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            border: `1px solid ${isDark ? 'rgba(236, 72, 153, 0.3)' : '#F9A8D4'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: theme.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💼</div>
              <div>
                <div style={{ fontWeight: '600', color: theme.textPrimary }}>Side Hustle Budget</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>0 categories</div>
              </div>
            </div>
            <button style={{ padding: '8px 16px', background: theme.secondary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              + Add Category
            </button>
          </div>

          {/* Budget Health */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏦 Budget Health Overview
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'} strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={theme.warning} strokeWidth="12" strokeDasharray="157 314" strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: theme.warning }}>50%</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>Health</div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>Actual vs Budget</span>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>0% used</span>
                </div>
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '16px' }}>
                  Spent: $0.00 | Budget: $0.00
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>on track</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.danger }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>over budget</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: theme.secondary }}>0</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>Categories</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>+$0.00</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>Net</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Income/Expense/Surplus Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: theme.success, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💵 Income</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>$0.00</div>
            </div>
            <div style={{ background: theme.danger, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💳 Expenses</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>$0.00</div>
            </div>
            <div style={{ background: theme.secondary, borderRadius: '12px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📈 Surplus</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>+$0.00</div>
            </div>
          </div>

          {/* Categories */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Categories - Actual vs Budget</h3>
              <select style={{ padding: '6px 12px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '13px', color: theme.textPrimary }}>
                <option>Highest Spent</option>
                <option>Lowest Spent</option>
              </select>
            </div>
            <div style={{ textAlign: 'center', padding: '40px', color: theme.textMuted }}>
              No spending data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
