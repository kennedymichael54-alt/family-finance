import React, { useState, useEffect, useRef } from 'react';

// Default themes for standalone usage
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Mini Sparkline Component (matching Dashboard)
const Sparkline = ({ data, color, width = 70, height = 35 }) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} />;
  }
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
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

export default function SalesTrackerTab({ theme: propTheme }) {
  // Use provided theme or detect from localStorage
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeView, setActiveView] = useState('tracker');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sales, setSales] = useState([]);
  const [goals, setGoals] = useState({ transactions: 0, volume: 0 });
  
  // Collapsible sections (matching Dashboard pattern)
  const [collapsedSections, setCollapsedSections] = useState({
    commissionPipeline: false,
    transactions: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedSales = localStorage.getItem('pn_sales');
      const savedGoals = localStorage.getItem('pn_sales_goals');
      if (savedSales) setSales(JSON.parse(savedSales));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (e) {
      console.error('Error loading sales data:', e);
    }
  }, []);

  const totalTransactions = sales.length;
  const totalVolume = sales.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalCommission = sales.reduce((sum, s) => sum + (s.commission || 0), 0);
  const avgCommission = sales.length > 0 ? totalCommission / sales.length : 0;
  
  // Generate sparkline data (simulated monthly data)
  const generateSparklineData = (total, variance = 0.3) => {
    const months = 12;
    const avg = total / months;
    return Array.from({ length: months }, () => 
      Math.max(0, avg * (1 + (Math.random() - 0.5) * variance))
    );
  };
  
  const transactionSparkline = generateSparklineData(totalTransactions * 3);
  const volumeSparkline = generateSparklineData(totalVolume);
  const commissionSparkline = generateSparklineData(totalCommission);
  const avgCommissionSparkline = generateSparklineData(avgCommission * 12);

  return (
    <div>
      {/* Header - matching Dashboard style */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Sales Tracker</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              Track your real estate transactions and commissions
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: isDark ? 'rgba(139, 92, 246, 0.15)' : '#EEF2FF', borderRadius: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.primary }} />
              <span style={{ fontSize: '12px', color: theme.primary, fontWeight: '500' }}>
                {selectedYear}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: theme.bgCard, padding: '4px', borderRadius: '12px', boxShadow: theme.cardShadow }}>
            {['tracker', 'analytics'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: activeView === view ? theme.primary : 'transparent',
                  color: activeView === view ? 'white' : theme.textSecondary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>{view === 'tracker' ? '🎯' : '📊'}</span>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: '10px 16px',
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: theme.cardShadow
            }}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {/* Add Button */}
          <button style={{
            padding: '10px 20px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: `0 4px 12px ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(79, 70, 229, 0.3)'}`
          }}>
            + Add Transaction
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TOP STATS ROW - Soft Gradient Cards (matching Dashboard) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Transactions Card - Cyan */}
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
            }}>📊</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Transactions</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064', marginBottom: '8px' }}>
            {totalTransactions}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: isDark ? '#67E8F9' : '#00695C' }}>vs goal</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ {goals.transactions > 0 ? Math.round((totalTransactions / goals.transactions) * 100) : 0}%
              </span>
            </div>
            <Sparkline data={transactionSparkline} color="#00BCD4" width={70} height={40} />
          </div>
        </div>

        {/* Volume Card - Orange */}
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
            }}>🏠</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Volume</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C', marginBottom: '8px' }}>
            {formatCurrency(totalVolume)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: isDark ? '#FDBA74' : '#E65100' }}>vs goal</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ {goals.volume > 0 ? Math.round((totalVolume / goals.volume) * 100) : 0}%
              </span>
            </div>
            <Sparkline data={volumeSparkline} color="#FF9800" width={70} height={40} />
          </div>
        </div>

        {/* Commission Card - Green */}
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
            }}>💵</div>
            <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Commission</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20', marginBottom: '8px' }}>
            {formatCurrency(totalCommission)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: isDark ? '#86EFAC' : '#2E7D32' }}>earned</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ 100%
              </span>
            </div>
            <Sparkline data={commissionSparkline} color="#4CAF50" width={70} height={40} />
          </div>
        </div>

        {/* Avg Commission Card - Purple */}
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
            }}>📈</div>
            <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Avg Commission</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C', marginBottom: '8px' }}>
            {formatCurrency(avgCommission)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: isDark ? '#D8B4FE' : '#7B1FA2' }}>per deal</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ avg
              </span>
            </div>
            <Sparkline data={avgCommissionSparkline} color="#9C27B0" width={70} height={40} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* COMMISSION PIPELINE (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('commissionPipeline')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.commissionPipeline ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #EC4899 0%, #8B5CF6 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Commission Pipeline</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>Performance overview</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.commissionPipeline ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Main Content Grid - 3 Equal Columns (matching Dashboard Quick Actions) */}
      {!collapsedSections.commissionPipeline && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Commission Pipeline Chart */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent (matching Dashboard) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Commission Pipeline</h3>
            <span style={{ padding: '3px 8px', background: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EEF2FF', color: theme.primary, borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{selectedYear}</span>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sales.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📊</span>
                <span style={{ color: theme.textMuted, fontSize: '13px' }}>No data to display</span>
              </div>
            ) : (
              <span style={{ color: theme.textMuted }}>Chart will appear here</span>
            )}
          </div>
        </div>

        {/* Goals Card */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`,
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
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Goals</h3>
            <span style={{ padding: '3px 8px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5', color: theme.success, borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{selectedYear}</span>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Transactions</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{totalTransactions}/{goals.transactions || 0}</span>
            </div>
            <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${goals.transactions > 0 ? Math.min((totalTransactions / goals.transactions) * 100, 100) : 0}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)', 
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Volume Goal</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(totalVolume)}/{formatCurrency(goals.volume || 0)}</span>
            </div>
            <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${goals.volume > 0 ? Math.min((totalVolume / goals.volume) * 100, 100) : 0}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)', 
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`,
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
            background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Status</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              color: theme.primary,
              border: `3px solid ${theme.primary}20`
            }}>
              {totalTransactions}
            </div>
            <div style={{ fontSize: '13px' }}>
              {[
                { label: 'Active', color: theme.success, count: sales.filter(s => s.status === 'active').length || 0 },
                { label: 'Under', color: theme.warning, count: sales.filter(s => s.status === 'under').length || 0 },
                { label: 'Closed', color: theme.primary, count: sales.filter(s => s.status === 'closed').length || 0 },
                { label: 'Cancelled', color: theme.danger, count: sales.filter(s => s.status === 'cancelled').length || 0 }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ color: theme.textSecondary }}>{item.label}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: '600', color: theme.textPrimary }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ALL TRANSACTIONS (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('transactions')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.transactions ? '0' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #3B82F6 0%, #06B6D4 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>All Transactions</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>{sales.length} total</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.transactions ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Transactions Table */}
      {!collapsedSections.transactions && (
      <div style={{
        background: theme.bgCard,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${theme.borderLight}`,
        boxShadow: theme.cardShadow
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain }}>
              {['#', 'Status', 'Date', 'Client', 'Address', 'Source', 'Type', 'Price', 'Comm.', 'Side', 'Fee', 'Apps'].map(header => (
                <th key={header} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>No transactions yet</div>
                  <div style={{ color: theme.textMuted, marginBottom: '20px' }}>Add your first transaction to start tracking</div>
                  <button style={{
                    padding: '12px 24px',
                    background: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    + Add Transaction
                  </button>
                </td>
              </tr>
            ) : (
              sales.map((sale, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      background: sale.status === 'active' ? '#ECFDF5' : sale.status === 'closed' ? '#EEF2FF' : sale.status === 'cancelled' ? '#FEF2F2' : '#FEF3C7',
                      color: sale.status === 'active' ? '#059669' : sale.status === 'closed' ? '#6366F1' : sale.status === 'cancelled' ? '#DC2626' : '#D97706'
                    }}>
                      {sale.status?.charAt(0).toUpperCase() + sale.status?.slice(1) || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.date}</td>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary, fontWeight: '500' }}>{sale.client}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.address}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.source}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.type}</td>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary, fontWeight: '600' }}>{formatCurrency(sale.price)}</td>
                  <td style={{ padding: '12px 16px', color: theme.success, fontWeight: '600' }}>{formatCurrency(sale.commission)}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.side}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.fee}%</td>
                  <td style={{ padding: '12px 16px' }}>-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
