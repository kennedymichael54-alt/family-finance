import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// SALES TRACKER TAB - Real Estate Transaction Tracker
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Transaction statuses with colors
const STATUS_OPTIONS = [
  { value: 'Active', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  { value: 'Under Contract', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.2)' },
  { value: 'Closed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
  { value: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' }
];

// Lead sources
const LEAD_SOURCES = ['Referral', 'Mailing', 'Facebook', 'Broker', 'Cold Call', 'Website', 'Open House', 'Other'];

// Transaction types
const TRANSACTION_TYPES = ['Buyer', 'Seller', 'Listing', 'Tenant', 'Landlord', 'Dual'];

// Contingency statuses
const CONTINGENCY_STATUS = [
  { value: 'Not Started', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' },
  { value: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  { value: 'Completed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' }
];

// Month names
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SalesTrackerTab() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Load transactions from localStorage
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ff_sales_transactions') || '[]');
    } catch { return []; }
  });

  // Goals state
  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ff_sales_goals') || '{}');
    } catch { return {}; }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ff_sales_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_sales_goals', JSON.stringify(goals));
  }, [goals]);

  // New transaction form
  const emptyTransaction = {
    id: '',
    status: 'Active',
    closingDate: '',
    clientName: '',
    propertyAddress: '',
    leadSource: 'Referral',
    transactionType: 'Buyer',
    salesPrice: '',
    commissionRate: 3,
    brokerageCommission: '',
    homeInspection: 'Not Started',
    financing: 'Not Started',
    appraisal: 'Not Started'
  };
  
  const [newTransaction, setNewTransaction] = useState(emptyTransaction);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => {
      const txDate = new Date(tx.closingDate);
      return txDate.getFullYear() === selectedYear;
    });
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }
    return filtered.sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
  }, [transactions, selectedYear, filterStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const closed = filteredTransactions.filter(tx => tx.status === 'Closed');
    const totalVolume = closed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0), 0);
    const totalGrossCommission = closed.reduce((sum, tx) => {
      const price = parseFloat(tx.salesPrice) || 0;
      const rate = parseFloat(tx.commissionRate) || 3;
      return sum + (price * rate / 100);
    }, 0);
    const totalBrokerageCommission = closed.reduce((sum, tx) => sum + (parseFloat(tx.brokerageCommission) || 0), 0);
    const netCommission = totalGrossCommission - totalBrokerageCommission;
    
    // Tax estimate (25%)
    const taxesDue = netCommission * 0.25;

    // Monthly breakdown
    const monthlyData = MONTHS.map((month, i) => {
      const monthClosed = closed.filter(tx => new Date(tx.closingDate).getMonth() === i);
      return {
        month,
        volume: monthClosed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0), 0),
        grossCommission: monthClosed.reduce((sum, tx) => {
          const price = parseFloat(tx.salesPrice) || 0;
          const rate = parseFloat(tx.commissionRate) || 3;
          return sum + (price * rate / 100);
        }, 0),
        count: monthClosed.length
      };
    });

    // Status breakdown
    const statusBreakdown = STATUS_OPTIONS.map(s => ({
      ...s,
      count: filteredTransactions.filter(tx => tx.status === s.value).length,
      percent: filteredTransactions.length > 0 ? (filteredTransactions.filter(tx => tx.status === s.value).length / filteredTransactions.length * 100) : 0
    }));

    return {
      closedDeals: closed.length,
      totalVolume,
      totalGrossCommission,
      netCommission,
      taxesDue,
      monthlyData,
      statusBreakdown,
      goalTransactions: goals.transactions || 25,
      goalVolume: goals.volume || 2000000
    };
  }, [filteredTransactions, goals]);

  // Add/Update transaction
  const saveTransaction = () => {
    if (!newTransaction.clientName || !newTransaction.propertyAddress) return;
    
    if (editingTransaction) {
      setTransactions(prev => prev.map(tx => tx.id === editingTransaction.id ? { ...newTransaction, id: editingTransaction.id } : tx));
    } else {
      setTransactions(prev => [...prev, { ...newTransaction, id: Date.now().toString() }]);
    }
    setNewTransaction(emptyTransaction);
    setShowAddModal(false);
    setEditingTransaction(null);
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  };

  // Edit transaction
  const editTransaction = (tx) => {
    setNewTransaction(tx);
    setEditingTransaction(tx);
    setShowAddModal(true);
  };

  // Update goals
  const updateGoal = (field, value) => {
    setGoals(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            🏠 Sales Tracker
            <span style={{ fontSize: '12px', fontWeight: '400', color: 'rgba(255,255,255,0.5)', background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '20px' }}>Real Estate</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>Track your transactions, commissions, and contingencies</p>
        </div>
        <button onClick={() => { setNewTransaction(emptyTransaction); setEditingTransaction(null); setShowAddModal(true); }}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          + Add Transaction
        </button>
      </div>

      {/* Year Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        {years.map(year => (
          <button key={year} onClick={() => setSelectedYear(year)}
            style={{ padding: '10px 20px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>
            {year}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>📊 Closed Deals</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8B5CF6' }}>{stats.closedDeals}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Goal: {stats.goalTransactions}</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((stats.closedDeals / stats.goalTransactions) * 100, 100)}%`, height: '100%', background: '#8B5CF6', borderRadius: '2px' }} />
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>🏠 Total Volume Sold</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3B82F6' }}>{formatCurrency(stats.totalVolume)}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Goal: {formatCurrency(stats.goalVolume)}</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((stats.totalVolume / stats.goalVolume) * 100, 100)}%`, height: '100%', background: '#3B82F6', borderRadius: '2px' }} />
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>💰 Gross Commission</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(stats.totalGrossCommission)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>💵 Net Commission</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#EC4899' }}>{formatCurrency(stats.netCommission)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>📋 Taxes Due (Est.)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#EF4444' }}>{formatCurrency(stats.taxesDue)}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>25% estimated</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Gross Commission Pipeline Chart */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>📈 Gross Commission Pipeline</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px' }}>
            {stats.monthlyData.map((m, i) => {
              const maxCommission = Math.max(...stats.monthlyData.map(d => d.grossCommission), 1);
              const height = (m.grossCommission / maxCommission) * 150;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{m.grossCommission > 0 ? formatCurrency(m.grossCommission) : ''}</div>
                  <div style={{ width: '100%', height: `${Math.max(height, 4)}px`, background: m.grossCommission > 0 ? 'linear-gradient(180deg, #10B981, #059669)' : 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }} />
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{m.month.slice(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Progress */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>🎯 Goal Progress</h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Transactions</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{stats.closedDeals} / {stats.goalTransactions}</span>
            </div>
            <div style={{ height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min((stats.closedDeals / stats.goalTransactions) * 100, 100)}%`, background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '600' }}>{stats.closedDeals}</span>
              </div>
              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{stats.goalTransactions - stats.closedDeals} to go</div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Transaction Goal</label>
            <input type="number" value={goals.transactions || ''} onChange={(e) => updateGoal('transactions', e.target.value)} placeholder="25"
              style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Volume Goal ($)</label>
            <input type="number" value={goals.volume || ''} onChange={(e) => updateGoal('volume', e.target.value)} placeholder="2000000"
              style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Transaction Status */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>📊 Transaction Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.statusBreakdown.map(s => (
              <div key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color }} />
                <span style={{ flex: 1, fontSize: '12px' }}>{s.value}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: s.color }}>{s.count}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>({s.percent.toFixed(0)}%)</span>
              </div>
            ))}
          </div>
          {/* Simple Pie Visualization */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${stats.statusBreakdown.map((s, i) => `${s.color} ${stats.statusBreakdown.slice(0, i).reduce((sum, x) => sum + x.percent, 0)}% ${stats.statusBreakdown.slice(0, i + 1).reduce((sum, x) => sum + x.percent, 0)}%`).join(', ')}${stats.statusBreakdown.length === 0 ? 'rgba(255,255,255,0.1) 0% 100%' : ''})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(30, 27, 56, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>{filteredTransactions.length}</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setFilterStatus('all')}
          style={{ padding: '8px 16px', background: filterStatus === 'all' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
          All ({transactions.filter(tx => new Date(tx.closingDate).getFullYear() === selectedYear).length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            style={{ padding: '8px 16px', background: filterStatus === s.value ? s.bg : 'rgba(255,255,255,0.05)', border: `1px solid ${filterStatus === s.value ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: filterStatus === s.value ? s.color : 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer' }}>
            {s.value} ({transactions.filter(tx => tx.status === s.value && new Date(tx.closingDate).getFullYear() === selectedYear).length})
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 100px 100px 180px 1fr 100px 90px 110px 110px 90px 90px 90px 60px', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          <div>#</div>
          <div>Status</div>
          <div>Closing Date</div>
          <div>Client Name</div>
          <div>Property Address</div>
          <div>Lead Source</div>
          <div>Type</div>
          <div style={{ textAlign: 'right' }}>Sales Price</div>
          <div style={{ textAlign: 'right' }}>Gross Comm.</div>
          <div style={{ textAlign: 'center' }}>Inspection</div>
          <div style={{ textAlign: 'center' }}>Financing</div>
          <div style={{ textAlign: 'center' }}>Appraisal</div>
          <div></div>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏠</div>
              <div style={{ fontSize: '14px' }}>No transactions yet</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Add Transaction" to get started</div>
            </div>
          ) : (
            filteredTransactions.map((tx, index) => {
              const status = STATUS_OPTIONS.find(s => s.value === tx.status) || STATUS_OPTIONS[0];
              const grossComm = (parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100;
              return (
                <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '40px 100px 100px 180px 1fr 100px 90px 110px 110px 90px 90px 90px 60px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', cursor: 'pointer' }} onClick={() => editTransaction(tx)}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{index + 1}</div>
                  <div>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', background: status.bg, color: status.color }}>{tx.status}</span>
                  </div>
                  <div style={{ fontSize: '12px' }}>{tx.closingDate ? new Date(tx.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>{tx.clientName}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.propertyAddress}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{tx.leadSource}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{tx.transactionType}</div>
                  <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: '600' }}>{formatCurrency(parseFloat(tx.salesPrice) || 0)}</div>
                  <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#10B981' }}>{formatCurrency(grossComm)}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', background: CONTINGENCY_STATUS.find(c => c.value === tx.homeInspection)?.bg || 'rgba(255,255,255,0.1)', color: CONTINGENCY_STATUS.find(c => c.value === tx.homeInspection)?.color || 'white' }}>{tx.homeInspection?.slice(0, 4) || '—'}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', background: CONTINGENCY_STATUS.find(c => c.value === tx.financing)?.bg || 'rgba(255,255,255,0.1)', color: CONTINGENCY_STATUS.find(c => c.value === tx.financing)?.color || 'white' }}>{tx.financing?.slice(0, 4) || '—'}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', background: CONTINGENCY_STATUS.find(c => c.value === tx.appraisal)?.bg || 'rgba(255,255,255,0.1)', color: CONTINGENCY_STATUS.find(c => c.value === tx.appraisal)?.color || 'white' }}>{tx.appraisal?.slice(0, 4) || '—'}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); }}
                      style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', color: '#EF4444', fontSize: '10px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAddModal(false); setEditingTransaction(null); }}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '24px', padding: '32px', width: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>{editingTransaction ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Status</label>
                <select value={newTransaction.status} onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: '#1e1b38' }}>{s.value}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Closing Date</label>
                <input type="date" value={newTransaction.closingDate} onChange={(e) => setNewTransaction({ ...newTransaction, closingDate: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Client Name</label>
                <input type="text" value={newTransaction.clientName} onChange={(e) => setNewTransaction({ ...newTransaction, clientName: e.target.value })} placeholder="John & Jane Smith"
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Property Address</label>
                <input type="text" value={newTransaction.propertyAddress} onChange={(e) => setNewTransaction({ ...newTransaction, propertyAddress: e.target.value })} placeholder="123 Main Street, Atlanta, GA 30301"
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Lead Source</label>
                <select value={newTransaction.leadSource} onChange={(e) => setNewTransaction({ ...newTransaction, leadSource: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                  {LEAD_SOURCES.map(s => <option key={s} value={s} style={{ background: '#1e1b38' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Transaction Type</label>
                <select value={newTransaction.transactionType} onChange={(e) => setNewTransaction({ ...newTransaction, transactionType: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                  {TRANSACTION_TYPES.map(t => <option key={t} value={t} style={{ background: '#1e1b38' }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Sales Price ($)</label>
                <input type="number" value={newTransaction.salesPrice} onChange={(e) => setNewTransaction({ ...newTransaction, salesPrice: e.target.value })} placeholder="375000"
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Commission Rate (%)</label>
                <input type="number" step="0.1" value={newTransaction.commissionRate} onChange={(e) => setNewTransaction({ ...newTransaction, commissionRate: e.target.value })} placeholder="3"
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Brokerage Commission Split ($)</label>
                <input type="number" value={newTransaction.brokerageCommission} onChange={(e) => setNewTransaction({ ...newTransaction, brokerageCommission: e.target.value })} placeholder="2800"
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>📋 Contingencies</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Home Inspection</label>
                    <select value={newTransaction.homeInspection} onChange={(e) => setNewTransaction({ ...newTransaction, homeInspection: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px' }}>
                      {CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Financing</label>
                    <select value={newTransaction.financing} onChange={(e) => setNewTransaction({ ...newTransaction, financing: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px' }}>
                      {CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Appraisal</label>
                    <select value={newTransaction.appraisal} onChange={(e) => setNewTransaction({ ...newTransaction, appraisal: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px' }}>
                      {CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Preview */}
            {newTransaction.salesPrice && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Gross Commission ({newTransaction.commissionRate || 3}%)</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{formatCurrencyFull((parseFloat(newTransaction.salesPrice) || 0) * (parseFloat(newTransaction.commissionRate) || 3) / 100)}</span>
                </div>
                {newTransaction.brokerageCommission && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Net Commission (after split)</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#EC4899' }}>{formatCurrencyFull((parseFloat(newTransaction.salesPrice) || 0) * (parseFloat(newTransaction.commissionRate) || 3) / 100 - (parseFloat(newTransaction.brokerageCommission) || 0))}</span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => { setShowAddModal(false); setEditingTransaction(null); setNewTransaction(emptyTransaction); }}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveTransaction}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>{editingTransaction ? 'Save Changes' : 'Add Transaction'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
