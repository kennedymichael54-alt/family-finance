import React, { useState, useMemo, useEffect } from 'react';

const DEMO_DEALS = [
  { id: 1, property: '2908 Urban Avenue, Columbus, GA 31907', status: 'Closed', purchaseDate: '2025-04-14', soldDate: '2025-08-25', purchasePrice: 69000, listingPrice: 99000, soldPrice: 95000, closingCosts: 0, sellCommission: 5700, buyCommission: 0, interestPaid: 3727, renovationCosts: 0, netProfit: 15172.37, dom: 72, agent: 'Tucker Pate', agentCommission: 2850, ourCommission: 2850, ourCommissionPct: 0.03, michaelTakeHome: 9102.39, anthonyTakeHome: 9102.39 },
  { id: 2, property: '1114 Brooks Road, Columbus, GA 31903', status: 'Closed', purchaseDate: '2025-02-10', soldDate: '2025-05-15', purchasePrice: 13500, listingPrice: 25000, soldPrice: 25000, closingCosts: 0, sellCommission: 1500, buyCommission: 0, interestPaid: 0, renovationCosts: 0, netProfit: 10000, dom: 45, agent: null, agentCommission: 0, ourCommission: 0, ourCommissionPct: 0, michaelTakeHome: 5000, anthonyTakeHome: 5000 },
  { id: 3, property: '2214 Somerset Avenue, Columbus, GA 31903', status: 'Closed', purchaseDate: '2025-01-20', soldDate: '2025-04-10', purchasePrice: 0, listingPrice: 58000, soldPrice: 58000, closingCosts: 0, sellCommission: 3480, buyCommission: 0, interestPaid: 0, renovationCosts: 0, netProfit: 54520, dom: 35, agent: null, agentCommission: 0, ourCommission: 3480, ourCommissionPct: 0.06, michaelTakeHome: 27260, anthonyTakeHome: 27260 },
  { id: 4, property: '4742 Marino Drive, Columbus, GA 31907', status: 'Under Contract', purchaseDate: '2025-11-01', soldDate: null, purchasePrice: 85000, listingPrice: 125000, soldPrice: null, closingCosts: 2500, sellCommission: 0, buyCommission: 0, interestPaid: 0, renovationCosts: 15000, netProfit: null, dom: null, agent: 'Tucker Pate', agentCommission: 0, ourCommission: 0, ourCommissionPct: 0.03, michaelTakeHome: null, anthonyTakeHome: null },
  { id: 5, property: '2936 Walker Road, Columbus, GA 31904', status: 'Listed', purchaseDate: '2025-09-15', soldDate: null, purchasePrice: 72000, listingPrice: 110000, soldPrice: null, closingCosts: 1800, sellCommission: 0, buyCommission: 0, interestPaid: 2160, renovationCosts: 12000, netProfit: null, dom: 45, agent: null, agentCommission: 0, ourCommission: 0, ourCommissionPct: 0.03, michaelTakeHome: null, anthonyTakeHome: null },
];

const formatCurrency = (amount) => amount == null ? '-' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

export default function BizBudgetHub({ theme, lastImportDate, userEmail, initialTab = 'dashboard', profile, onUpdateProfile }) {
  const isDark = theme?.mode === 'dark';
  const activeTab = initialTab;
  const [businessName, setBusinessName] = useState(() => profile?.bizbudgetBusinessName || 'KM GA LLC - HomeVestors Franchise Management');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [deals] = useState(DEMO_DEALS);
  
  useEffect(() => { if (profile?.bizbudgetBusinessName) setBusinessName(profile.bizbudgetBusinessName); }, [profile?.bizbudgetBusinessName]);
  
  const saveBusinessName = async () => {
    if (tempBusinessName.trim()) {
      setBusinessName(tempBusinessName.trim());
      setIsEditingName(false);
      if (onUpdateProfile) await onUpdateProfile({ ...profile, bizbudgetBusinessName: tempBusinessName.trim() });
    }
  };
  
  const toggleSection = (s) => setCollapsedSections(prev => ({ ...prev, [s]: !prev[s] }));
  
  const stats = useMemo(() => {
    const closed = deals.filter(d => d.status === 'Closed');
    const pending = deals.filter(d => d.status !== 'Closed');
    const totalRevenue = closed.reduce((s, d) => s + (d.soldPrice || 0), 0);
    const totalProfit = closed.reduce((s, d) => s + (d.netProfit || 0), 0);
    const totalCommissions = closed.reduce((s, d) => s + (d.ourCommission || 0), 0);
    const avgDOM = closed.length > 0 ? closed.reduce((s, d) => s + (d.dom || 0), 0) / closed.length : 0;
    const michaelTotal = closed.reduce((s, d) => s + (d.michaelTakeHome || 0), 0);
    const anthonyTotal = closed.reduce((s, d) => s + (d.anthonyTakeHome || 0), 0);
    const pipelineValue = pending.reduce((s, d) => s + Math.max(0, (d.listingPrice || 0) - (d.purchasePrice || 0) - (d.closingCosts || 0) - (d.renovationCosts || 0)), 0);
    const months = Math.max(new Date().getMonth(), 1);
    return { closedCount: closed.length, pendingCount: pending.length, totalRevenue, totalProfit, totalCommissions, avgDOM: Math.round(avgDOM), michaelTotal, anthonyTotal, pipelineValue, commissionTaxReserve: totalCommissions * 0.46, profitTaxReserve: totalProfit * 0.31, projectedAnnualProfit: (totalProfit / months) * 12, projectedAnnualRevenue: (totalRevenue / months) * 12 };
  }, [deals]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed': return { bg: '#D1FAE5', color: '#059669', text: 'Closed' };
      case 'Under Contract': return { bg: '#FEF3C7', color: '#D97706', text: 'Under Contract' };
      case 'Listed': return { bg: '#DBEAFE', color: '#2563EB', text: 'Listed' };
      default: return { bg: '#F3F4F6', color: '#6B7280', text: status };
    }
  };

  const MiniSparkline = ({ data, color, height = 40 }) => {
    const max = Math.max(...data), min = Math.min(...data), range = max - min || 1, width = 120;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 8)}`).join(' ');
    return <svg width={width} height={height}><polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  };

  return (
    <div>
      {/* Header with Editable Business Name */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '24px' }}>🏢</span></div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>BizBudget Hub</h1>
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input type="text" value={tempBusinessName} onChange={(e) => setTempBusinessName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveBusinessName(); if (e.key === 'Escape') { setTempBusinessName(businessName); setIsEditingName(false); } }} autoFocus style={{ fontSize: '14px', color: theme.textSecondary, background: theme.bgCard, border: `1px solid ${theme.primary}`, borderRadius: '6px', padding: '4px 10px', outline: 'none', width: '300px' }} />
                <button onClick={saveBusinessName} style={{ padding: '4px 12px', background: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Save</button>
                <button onClick={() => { setTempBusinessName(businessName); setIsEditingName(false); }} style={{ padding: '4px 12px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.borderLight}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
              </div>
            ) : (
              <p onClick={() => { setTempBusinessName(businessName); setIsEditingName(true); }} style={{ fontSize: '14px', color: theme.textMuted, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>{businessName}<span style={{ fontSize: '12px', opacity: 0.5 }}>✏️</span></p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          {lastImportDate && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#10B98115', borderRadius: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /><span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #164E63, #0E4A5C)' : 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)', border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div><span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Active Deals</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{stats.pendingCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#67E8F9' : '#00838F', marginTop: '4px' }}>Pipeline: {formatCurrency(stats.pipelineValue)}</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #14532D, #115E2B)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)', border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div><span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Total Profit</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{formatCurrency(stats.totalProfit)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#86EFAC' : '#2E7D32', marginTop: '4px' }}>{stats.closedCount} closed deals YTD</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #4A1D6B, #3D1A5A)' : 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)', border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤝</div><span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Commissions</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>{formatCurrency(stats.totalCommissions)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#D8B4FE' : '#7B1FA2', marginTop: '4px' }}>Avg DOM: {stats.avgDOM} days</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #7C2D12, #6B2A0F)' : 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)', border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👥</div><span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Partner Splits</span></div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}><div>M: {formatCurrency(stats.michaelTotal)}</div><div style={{ marginTop: '2px' }}>A: {formatCurrency(stats.anthonyTotal)}</div></div>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <div onClick={() => toggleSection('kpiOverview')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsedSections.kpiOverview ? '24px' : '16px', cursor: 'pointer', userSelect: 'none' }}>
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #8B5CF6, #EC4899)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Key Performance Indicators</h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsedSections.kpiOverview ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </div>
          {!collapsedSections.kpiOverview && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual Revenue</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.projectedAnnualRevenue)}</div>
                <div style={{ marginTop: '8px' }}><MiniSparkline data={[45000, 52000, 48000, 58000, 55000, 62000]} color="#8B5CF6" /></div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual Profit</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.projectedAnnualProfit)}</div>
                <div style={{ marginTop: '8px' }}><MiniSparkline data={[12000, 15000, 13000, 18000, 16000, 20000]} color="#10B981" /></div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Tax Reserves (Total)</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.commissionTaxReserve + stats.profitTaxReserve)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Commissions: {formatCurrency(stats.commissionTaxReserve)} | Profit: {formatCurrency(stats.profitTaxReserve)}</div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #EC4899, #8B5CF6)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Deal Velocity</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{(stats.closedCount / Math.max(new Date().getMonth(), 1)).toFixed(1)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Deals per month · Avg {stats.avgDOM} DOM</div>
              </div>
            </div>
          )}

          <div onClick={() => toggleSection('dealsPipeline')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsedSections.dealsPipeline ? '24px' : '16px', cursor: 'pointer', userSelect: 'none' }}>
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #F59E0B, #EF4444)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Pipeline Overview</h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>{stats.pendingCount} active · {stats.closedCount} closed</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsedSections.dealsPipeline ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </div>
          {!collapsedSections.dealsPipeline && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Active Deals</h4>
                {deals.filter(d => d.status !== 'Closed').map(deal => (
                  <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</div><span style={{ padding: '2px 8px', borderRadius: '12px', background: getStatusColor(deal.status).bg, color: getStatusColor(deal.status).color, fontSize: '10px', fontWeight: '500' }}>{deal.status}</span></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(deal.listingPrice)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>List Price</div></div>
                  </div>
                ))}
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Recent Closed</h4>
                {deals.filter(d => d.status === 'Closed').map(deal => (
                  <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{deal.soldDate}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '13px', fontWeight: '600', color: theme.success }}>{formatCurrency(deal.netProfit)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>Net Profit</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div onClick={() => toggleSection('taxReserves')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsedSections.taxReserves ? '0' : '16px', cursor: 'pointer', userSelect: 'none' }}>
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #3B82F6, #8B5CF6)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Tax Reserve Summary</h2>
            <span style={{ fontSize: '12px', color: '#3B82F6', background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '6px', fontWeight: '500' }}>For Novo Banking</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsedSections.taxReserves ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </div>
          {!collapsedSections.taxReserves && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Commission Tax (46%)</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.commissionTaxReserve)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>From {formatCurrency(stats.totalCommissions)} earned</div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Profit Tax (31%)</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.profitTaxReserve)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>From {formatCurrency(stats.totalProfit)} profit</div>
              </div>
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '13px', color: theme.warning, marginBottom: '8px', fontWeight: '600' }}>💡 Novo Auto-Transfer</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary }}>Set up automatic transfers: <strong>46%</strong> of commissions and <strong>31%</strong> of profits to tax savings account.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEAL PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>+ Add New Deal</button>
          </div>
          <div onClick={() => toggleSection('pendingDeals')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsedSections.pendingDeals ? '24px' : '16px', cursor: 'pointer', userSelect: 'none' }}>
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #F59E0B, #EF4444)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Pending Transactions</h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>{deals.filter(d => d.status !== 'Closed').length} deals</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsedSections.pendingDeals ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </div>
          {!collapsedSections.pendingDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Status</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>List Price</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Renovation</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Est. Profit</th><th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>DOM</th></tr></thead>
                <tbody>{deals.filter(d => d.status !== 'Closed').map(deal => {
                  const statusStyle = getStatusColor(deal.status);
                  const estProfit = (deal.listingPrice || 0) - (deal.purchasePrice || 0) - (deal.closingCosts || 0) - (deal.renovationCosts || 0) - (deal.interestPaid || 0);
                  return (<tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}><td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td><td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', background: statusStyle.bg, color: statusStyle.color, fontSize: '12px', fontWeight: '500' }}>{statusStyle.text}</span></td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.listingPrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.danger }}>{formatCurrency(deal.renovationCosts)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: estProfit >= 0 ? theme.success : theme.danger }}>{formatCurrency(estProfit)}</td><td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', color: theme.textMuted }}>{deal.dom || '-'}</td></tr>);
                })}</tbody>
              </table>
            </div>
          )}
          <div onClick={() => toggleSection('closedDeals')} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsedSections.closedDeals ? '0' : '16px', cursor: 'pointer', userSelect: 'none' }}>
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #10B981, #06B6D4)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Closed Deals</h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>{deals.filter(d => d.status === 'Closed').length} deals</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsedSections.closedDeals ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </div>
          {!collapsedSections.closedDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold Date</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Net Profit</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Michael</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Anthony</th></tr></thead>
                <tbody>{deals.filter(d => d.status === 'Closed').map(deal => (<tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}><td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td><td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{deal.soldDate}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.soldPrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.success }}>{formatCurrency(deal.netProfit)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.primary }}>{formatCurrency(deal.michaelTakeHome)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.secondary }}>{formatCurrency(deal.anthonyTakeHome)}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Other tabs show placeholder */}
      {['forecast', 'tax', 'history', 'statements', 'budget'].includes(activeTab) && (
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '40px', textAlign: 'center', border: `1px solid ${theme.borderLight}` }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{activeTab === 'forecast' ? '📊' : activeTab === 'tax' ? '💰' : activeTab === 'history' ? '📅' : activeTab === 'statements' ? '📈' : '⚖️'}</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>{activeTab === 'forecast' ? 'Revenue Forecast' : activeTab === 'tax' ? 'Tax Planning' : activeTab === 'history' ? 'Deal History' : activeTab === 'statements' ? 'Financial Statements' : 'Budget vs Actuals'}</h3>
          <p style={{ fontSize: '14px', color: theme.textMuted }}>This section will show detailed {activeTab === 'forecast' ? 'commission and franchise revenue forecasts' : activeTab === 'tax' ? 'tax breakdowns for Novo banking integration' : activeTab === 'history' ? 'transaction history and anniversaries' : activeTab === 'statements' ? 'P&L and cash flow statements' : 'budget comparison metrics'}.</p>
        </div>
      )}
    </div>
  );
}
