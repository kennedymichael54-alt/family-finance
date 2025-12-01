import React, { useState, useMemo, useEffect, useRef } from 'react';

// ============================================================================
// SALES TRACKER TAB - Real Estate Transaction Tracker with Import & Reports
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

const STATUS_OPTIONS = [
  { value: 'Active', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  { value: 'Under Contract', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.2)' },
  { value: 'Closed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
  { value: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' }
];
const LEAD_SOURCES = ['Referral', 'Mailing', 'Facebook', 'Broker', 'Cold Call', 'Website', 'Open House', 'Other'];
const TRANSACTION_TYPES = ['Buyer', 'Seller', 'Listing', 'Tenant', 'Landlord', 'Dual'];
const CONTINGENCY_STATUS = [
  { value: 'Not Started', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' },
  { value: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  { value: 'Completed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' }
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SalesTrackerTab() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeView, setActiveView] = useState('tracker');
  const fileInputRef = useRef(null);
  
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_sales_transactions') || '[]'); } catch { return []; }
  });
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_sales_goals') || '{}'); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('ff_sales_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ff_sales_goals', JSON.stringify(goals)); }, [goals]);

  const emptyTransaction = { id: '', status: 'Active', closingDate: '', clientName: '', propertyAddress: '', leadSource: 'Referral', transactionType: 'Buyer', salesPrice: '', commissionRate: 3, brokerageCommission: '', homeInspection: 'Not Started', financing: 'Not Started', appraisal: 'Not Started' };
  const [newTransaction, setNewTransaction] = useState(emptyTransaction);

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const imported = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = []; let current = ''; let inQuotes = false;
        for (let char of line) {
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
          else current += char;
        }
        values.push(current.trim());
        const row = {}; headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
        imported.push({
          id: Date.now().toString() + i,
          status: row.status || row['transaction status'] || 'Active',
          closingDate: row['closing date'] || row.closingdate || row.date || '',
          clientName: row['client name'] || row.clientname || row.client || row.name || '',
          propertyAddress: row['property address'] || row.propertyaddress || row.address || '',
          leadSource: row['lead source'] || row.leadsource || 'Other',
          transactionType: row['transaction type'] || row.transactiontype || row.type || 'Buyer',
          salesPrice: parseFloat((row['sales price'] || row.salesprice || row.price || '0').replace(/[$,]/g, '')) || 0,
          commissionRate: parseFloat(row['commission rate'] || row.commissionrate || row.commission || '3') || 3,
          brokerageCommission: parseFloat((row['brokerage commission'] || row.brokeragecommission || row.split || '0').replace(/[$,]/g, '')) || 0,
          homeInspection: row['home inspection'] || row.homeinspection || row.inspection || 'Not Started',
          financing: row.financing || 'Not Started',
          appraisal: row.appraisal || 'Not Started'
        });
      }
      setTransactions(prev => [...prev, ...imported]);
      setShowImportModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => new Date(tx.closingDate).getFullYear() === selectedYear);
    if (filterStatus !== 'all') filtered = filtered.filter(tx => tx.status === filterStatus);
    return filtered.sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
  }, [transactions, selectedYear, filterStatus]);

  const stats = useMemo(() => {
    const closed = filteredTransactions.filter(tx => tx.status === 'Closed');
    const totalVolume = closed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0), 0);
    const totalGrossCommission = closed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100, 0);
    const totalBrokerageCommission = closed.reduce((sum, tx) => sum + (parseFloat(tx.brokerageCommission) || 0), 0);
    const netCommission = totalGrossCommission - totalBrokerageCommission;
    const taxesDue = netCommission * 0.25;
    const monthlyData = FULL_MONTHS.map((month, i) => {
      const monthClosed = closed.filter(tx => new Date(tx.closingDate).getMonth() === i);
      return {
        month: MONTHS[i], fullMonth: month,
        volume: monthClosed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0), 0),
        grossCommission: monthClosed.reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100, 0),
        netCommission: monthClosed.reduce((sum, tx) => sum + ((parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100) - (parseFloat(tx.brokerageCommission) || 0), 0),
        taxes: monthClosed.reduce((sum, tx) => sum + (((parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100) - (parseFloat(tx.brokerageCommission) || 0)) * 0.25, 0),
        count: monthClosed.length
      };
    });
    const statusBreakdown = STATUS_OPTIONS.map(s => ({ ...s, count: filteredTransactions.filter(tx => tx.status === s.value).length, percent: filteredTransactions.length > 0 ? (filteredTransactions.filter(tx => tx.status === s.value).length / filteredTransactions.length * 100) : 0 }));
    const leadSourceBreakdown = LEAD_SOURCES.map(source => ({ source, count: closed.filter(tx => tx.leadSource === source).length, volume: closed.filter(tx => tx.leadSource === source).reduce((sum, tx) => sum + (parseFloat(tx.salesPrice) || 0), 0) })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
    return { closedDeals: closed.length, totalVolume, totalGrossCommission, netCommission, taxesDue, monthlyData, statusBreakdown, leadSourceBreakdown, goalTransactions: goals.transactions || 25, goalVolume: goals.volume || 2000000 };
  }, [filteredTransactions, goals]);

  const saveTransaction = () => {
    if (!newTransaction.clientName || !newTransaction.propertyAddress) return;
    if (editingTransaction) setTransactions(prev => prev.map(tx => tx.id === editingTransaction.id ? { ...newTransaction, id: editingTransaction.id } : tx));
    else setTransactions(prev => [...prev, { ...newTransaction, id: Date.now().toString() }]);
    setNewTransaction(emptyTransaction); setShowAddModal(false); setEditingTransaction(null);
  };
  const deleteTransaction = (id) => { if (window.confirm('Delete?')) setTransactions(prev => prev.filter(tx => tx.id !== id)); };
  const editTransaction = (tx) => { setNewTransaction(tx); setEditingTransaction(tx); setShowAddModal(true); };
  const updateGoal = (field, value) => { setGoals(prev => ({ ...prev, [field]: parseFloat(value) || 0 })); };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>🏠 Sales Tracker <span style={{ fontSize: '11px', fontWeight: '400', color: 'rgba(255,255,255,0.5)', background: 'rgba(139, 92, 246, 0.2)', padding: '3px 10px', borderRadius: '16px' }}>Real Estate</span></h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowImportModal(true)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>📥 Import</button>
          <button onClick={() => { setNewTransaction(emptyTransaction); setEditingTransaction(null); setShowAddModal(true); }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setActiveView('tracker')} style={{ padding: '8px 16px', background: activeView === 'tracker' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: activeView === 'tracker' ? '600' : '400', cursor: 'pointer' }}>📋 Tracker</button>
          <button onClick={() => setActiveView('reports')} style={{ padding: '8px 16px', background: activeView === 'reports' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: activeView === 'reports' ? '600' : '400', cursor: 'pointer' }}>📊 Reports</button>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {years.map(year => (<button key={year} onClick={() => setSelectedYear(year)} style={{ padding: '6px 14px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>{year}</button>))}
        </div>
      </div>

      {activeView === 'tracker' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>📊 Closed</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>{stats.closedDeals}</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px' }}><div style={{ width: `${Math.min((stats.closedDeals / stats.goalTransactions) * 100, 100)}%`, height: '100%', background: '#8B5CF6', borderRadius: '2px' }} /></div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>🏠 Volume</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>{formatCurrency(stats.totalVolume)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>💰 Gross</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(stats.totalGrossCommission)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>💵 Net</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#EC4899' }}>{formatCurrency(stats.netCommission)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>📋 Taxes</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#EF4444' }}>{formatCurrency(stats.taxesDue)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>📈 Commission Pipeline</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
                {stats.monthlyData.map((m, i) => {
                  const maxComm = Math.max(...stats.monthlyData.map(d => d.grossCommission), 1);
                  return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{m.grossCommission > 0 ? formatCurrency(m.grossCommission) : ''}</div>
                    <div style={{ width: '100%', height: `${Math.max((m.grossCommission / maxComm) * 80, 2)}px`, background: m.grossCommission > 0 ? '#10B981' : 'rgba(255,255,255,0.1)', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{m.month}</div>
                  </div>);
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>🎯 Goals</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Transactions</span><span>{stats.closedDeals}/{stats.goalTransactions}</span></div>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${Math.min((stats.closedDeals / stats.goalTransactions) * 100, 100)}%`, height: '100%', background: '#10B981', borderRadius: '6px' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div><label style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>Tx Goal</label><input type="number" value={goals.transactions || ''} onChange={(e) => updateGoal('transactions', e.target.value)} style={{ width: '100%', padding: '4px 6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '11px', marginTop: '2px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>Vol Goal</label><input type="number" value={goals.volume || ''} onChange={(e) => updateGoal('volume', e.target.value)} style={{ width: '100%', padding: '4px 6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '11px', marginTop: '2px', boxSizing: 'border-box' }} /></div>
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>📊 Status</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: `conic-gradient(${stats.statusBreakdown.map((s, i) => `${s.color} ${stats.statusBreakdown.slice(0, i).reduce((sum, x) => sum + x.percent, 0)}% ${stats.statusBreakdown.slice(0, i + 1).reduce((sum, x) => sum + x.percent, 0)}%`).join(', ')}${stats.statusBreakdown.every(s => s.count === 0) ? 'rgba(255,255,255,0.1) 0% 100%' : ''})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(30, 27, 56, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '14px', fontWeight: '700' }}>{filteredTransactions.length}</span></div></div>
                <div style={{ flex: 1 }}>{stats.statusBreakdown.map(s => (<div key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} /><span style={{ fontSize: '9px', flex: 1 }}>{s.value.split(' ')[0]}</span><span style={{ fontSize: '9px', fontWeight: '600', color: s.color }}>{s.count}</span></div>))}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            <button onClick={() => setFilterStatus('all')} style={{ padding: '5px 12px', background: filterStatus === 'all' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>All ({transactions.filter(tx => new Date(tx.closingDate).getFullYear() === selectedYear).length})</button>
            {STATUS_OPTIONS.map(s => (<button key={s.value} onClick={() => setFilterStatus(s.value)} style={{ padding: '5px 12px', background: filterStatus === s.value ? s.bg : 'rgba(255,255,255,0.05)', border: `1px solid ${filterStatus === s.value ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '5px', color: filterStatus === s.value ? s.color : 'rgba(255,255,255,0.7)', fontSize: '10px', cursor: 'pointer' }}>{s.value.split(' ')[0]} ({transactions.filter(tx => tx.status === s.value && new Date(tx.closingDate).getFullYear() === selectedYear).length})</button>))}
          </div>

          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '30px 75px 70px 140px 1fr 70px 60px 80px 80px 55px 55px 55px 35px', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', gap: '6px' }}>
              <div>#</div><div>Status</div><div>Date</div><div>Client</div><div>Address</div><div>Source</div><div>Type</div><div style={{ textAlign: 'right' }}>Price</div><div style={{ textAlign: 'right' }}>Comm.</div><div style={{ textAlign: 'center' }}>Insp</div><div style={{ textAlign: 'center' }}>Fin</div><div style={{ textAlign: 'center' }}>Appr</div><div></div>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredTransactions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}><div style={{ fontSize: '32px', marginBottom: '6px' }}>🏠</div><div style={{ fontSize: '12px' }}>No transactions</div></div>
              ) : filteredTransactions.map((tx, index) => {
                const status = STATUS_OPTIONS.find(s => s.value === tx.status) || STATUS_OPTIONS[0];
                const grossComm = (parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100;
                return (
                  <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '30px 75px 70px 140px 1fr 70px 60px 80px 80px 55px 55px 55px 35px', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', cursor: 'pointer', gap: '6px' }} onClick={() => editTransaction(tx)}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{index + 1}</div>
                    <div><span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '500', background: status.bg, color: status.color }}>{tx.status.split(' ')[0]}</span></div>
                    <div style={{ fontSize: '10px' }}>{tx.closingDate ? new Date(tx.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</div>
                    <div style={{ fontSize: '10px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.clientName}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.propertyAddress}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>{tx.leadSource}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>{tx.transactionType}</div>
                    <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '600' }}>{formatCurrency(parseFloat(tx.salesPrice) || 0)}</div>
                    <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '600', color: '#10B981' }}>{formatCurrency(grossComm)}</div>
                    <div style={{ textAlign: 'center' }}><span style={{ padding: '2px 4px', borderRadius: '3px', fontSize: '7px', background: CONTINGENCY_STATUS.find(c => c.value === tx.homeInspection)?.bg, color: CONTINGENCY_STATUS.find(c => c.value === tx.homeInspection)?.color }}>{(tx.homeInspection || '—').slice(0, 4)}</span></div>
                    <div style={{ textAlign: 'center' }}><span style={{ padding: '2px 4px', borderRadius: '3px', fontSize: '7px', background: CONTINGENCY_STATUS.find(c => c.value === tx.financing)?.bg, color: CONTINGENCY_STATUS.find(c => c.value === tx.financing)?.color }}>{(tx.financing || '—').slice(0, 4)}</span></div>
                    <div style={{ textAlign: 'center' }}><span style={{ padding: '2px 4px', borderRadius: '3px', fontSize: '7px', background: CONTINGENCY_STATUS.find(c => c.value === tx.appraisal)?.bg, color: CONTINGENCY_STATUS.find(c => c.value === tx.appraisal)?.color }}>{(tx.appraisal || '—').slice(0, 4)}</span></div>
                    <div style={{ textAlign: 'center' }}><button onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); }} style={{ padding: '2px 5px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '3px', color: '#EF4444', fontSize: '8px', cursor: 'pointer' }}>✕</button></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}># Transactions by Month</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {stats.monthlyData.map((m, i) => {
                  const maxCount = Math.max(...stats.monthlyData.map(d => d.count), 1);
                  return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '50px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{m.fullMonth}</span><div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${(m.count / maxCount) * 100}%`, height: '100%', background: '#D4A574', borderRadius: '3px' }} /></div><span style={{ width: '16px', fontSize: '10px', textAlign: 'right' }}>{m.count}</span></div>);
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Volume Sold Per Month</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px' }}>
                {stats.monthlyData.map((m, i) => {
                  const maxVol = Math.max(...stats.monthlyData.map(d => d.volume), 1);
                  return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{m.volume > 0 ? formatCurrency(m.volume) : ''}</div><div style={{ width: '100%', height: `${Math.max((m.volume / maxVol) * 120, 3)}px`, background: m.volume > 0 ? '#D4A574' : 'rgba(255,255,255,0.1)', borderRadius: '3px 3px 0 0' }} /><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{m.month}</div></div>);
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Gross Commission by Month</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px' }}>
                {stats.monthlyData.map((m, i) => {
                  const maxComm = Math.max(...stats.monthlyData.map(d => d.grossCommission), 1);
                  return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{m.grossCommission > 0 ? formatCurrency(m.grossCommission) : ''}</div><div style={{ width: '100%', height: `${Math.max((m.grossCommission / maxComm) * 120, 3)}px`, background: m.grossCommission > 0 ? '#D4A574' : 'rgba(255,255,255,0.1)', borderRadius: '3px 3px 0 0' }} /><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{m.month}</div></div>);
                })}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Net Commission (After Taxes)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {stats.monthlyData.map((m, i) => {
                  const netAfterTax = m.netCommission * 0.75;
                  const maxNet = Math.max(...stats.monthlyData.map(d => d.netCommission * 0.75), 1);
                  return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{netAfterTax > 0 ? formatCurrency(netAfterTax) : ''}</div><div style={{ width: '100%', height: `${Math.max((netAfterTax / maxNet) * 100, 3)}px`, background: netAfterTax > 0 ? '#10B981' : 'rgba(255,255,255,0.1)', borderRadius: '3px 3px 0 0' }} /><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{m.month}</div></div>);
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Taxes Per Month</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {stats.monthlyData.map((m, i) => {
                  const maxTax = Math.max(...stats.monthlyData.map(d => d.taxes), 1);
                  return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{m.taxes > 0 ? formatCurrency(m.taxes) : ''}</div><div style={{ width: '100%', height: `${Math.max((m.taxes / maxTax) * 100, 3)}px`, background: m.taxes > 0 ? '#EF4444' : 'rgba(255,255,255,0.1)', borderRadius: '3px 3px 0 0' }} /><div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{m.month}</div></div>);
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Lead Sources</h3>
              {stats.leadSourceBreakdown.length === 0 ? (<div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '16px', fontSize: '11px' }}>No closed deals</div>) : stats.leadSourceBreakdown.slice(0, 5).map((s, i) => (<div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}><div style={{ width: '20px', height: '20px', borderRadius: '4px', background: ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'][i % 5], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{s.count}</div><span style={{ flex: 1, fontSize: '11px' }}>{s.source}</span><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{formatCurrency(s.volume)}</span></div>))}
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowImportModal(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '16px', padding: '24px', width: '420px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>📥 Import Transactions</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Import CSV, Excel, or Google Sheets export with columns: Client Name, Property Address, Closing Date, Sales Price, Commission Rate, Status, Lead Source, Transaction Type.</p>
            <div style={{ border: '2px dashed rgba(139, 92, 246, 0.5)', borderRadius: '10px', padding: '30px', textAlign: 'center', marginBottom: '16px', background: 'rgba(139, 92, 246, 0.05)', position: 'relative' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
              <div style={{ fontSize: '12px', marginBottom: '6px' }}>Drop file or click to browse</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>.csv, .xlsx, .xls</div>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileImport} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
            <button onClick={() => setShowImportModal(false)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAddModal(false); setEditingTransaction(null); }}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '16px', padding: '24px', width: '480px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{editingTransaction ? '✏️ Edit' : '➕ Add'} Transaction</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Status</label><select value={newTransaction.status} onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px' }}>{STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: '#1e1b38' }}>{s.value}</option>)}</select></div>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Closing Date</label><input type="date" value={newTransaction.closingDate} onChange={(e) => setNewTransaction({ ...newTransaction, closingDate: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Client Name</label><input type="text" value={newTransaction.clientName} onChange={(e) => setNewTransaction({ ...newTransaction, clientName: e.target.value })} placeholder="John Smith" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Property Address</label><input type="text" value={newTransaction.propertyAddress} onChange={(e) => setNewTransaction({ ...newTransaction, propertyAddress: e.target.value })} placeholder="123 Main St, Atlanta, GA" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Lead Source</label><select value={newTransaction.leadSource} onChange={(e) => setNewTransaction({ ...newTransaction, leadSource: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px' }}>{LEAD_SOURCES.map(s => <option key={s} value={s} style={{ background: '#1e1b38' }}>{s}</option>)}</select></div>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Type</label><select value={newTransaction.transactionType} onChange={(e) => setNewTransaction({ ...newTransaction, transactionType: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px' }}>{TRANSACTION_TYPES.map(t => <option key={t} value={t} style={{ background: '#1e1b38' }}>{t}</option>)}</select></div>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Sales Price ($)</label><input type="number" value={newTransaction.salesPrice} onChange={(e) => setNewTransaction({ ...newTransaction, salesPrice: e.target.value })} placeholder="375000" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Commission %</label><input type="number" step="0.1" value={newTransaction.commissionRate} onChange={(e) => setNewTransaction({ ...newTransaction, commissionRate: e.target.value })} placeholder="3" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Brokerage Split ($)</label><input type="number" value={newTransaction.brokerageCommission} onChange={(e) => setNewTransaction({ ...newTransaction, brokerageCommission: e.target.value })} placeholder="2800" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '4px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>📋 Contingencies</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Inspection</label><select value={newTransaction.homeInspection} onChange={(e) => setNewTransaction({ ...newTransaction, homeInspection: e.target.value })} style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', color: 'white', fontSize: '10px' }}>{CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}</select></div>
                  <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Financing</label><select value={newTransaction.financing} onChange={(e) => setNewTransaction({ ...newTransaction, financing: e.target.value })} style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', color: 'white', fontSize: '10px' }}>{CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}</select></div>
                  <div><label style={{ display: 'block', marginBottom: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Appraisal</label><select value={newTransaction.appraisal} onChange={(e) => setNewTransaction({ ...newTransaction, appraisal: e.target.value })} style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', color: 'white', fontSize: '10px' }}>{CONTINGENCY_STATUS.map(c => <option key={c.value} value={c.value} style={{ background: '#1e1b38' }}>{c.value}</option>)}</select></div>
                </div>
              </div>
            </div>
            {newTransaction.salesPrice && (<div style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Gross ({newTransaction.commissionRate || 3}%)</span><span style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>{formatCurrencyFull((parseFloat(newTransaction.salesPrice) || 0) * (parseFloat(newTransaction.commissionRate) || 3) / 100)}</span></div></div>)}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => { setShowAddModal(false); setEditingTransaction(null); setNewTransaction(emptyTransaction); }} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveTransaction} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{editingTransaction ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
