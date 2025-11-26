import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Search, LogOut, User, Loader2 } from 'lucide-react';
import { NetWorthDashboard } from './components/NetWorthDashboard';
import { FIRECalculator } from './components/FIRECalculator';
import { GoalsTracker } from './components/GoalsTracker';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { useUserData } from './hooks/useUserData';

// Main Dashboard Component - only rendered when authenticated
const Dashboard = ({ user, signOut }) => {
  const {
    budgetData,
    billDates,
    transactions,
    investments,
    marketData,
    lastImportDate,
    loading: dataLoading,
    saving,
    error,
    setBudgetData,
    addTransaction,
    deleteTransaction,
    bulkImportTransactions,
    addBillDate,
    deleteBillDate,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  } = useUserData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate] = useState(new Date());
  const [transactionFilter, setTransactionFilter] = useState('');
  const [transactionSort, setTransactionSort] = useState('date-desc');
  const [cpaFilter, setCpaFilter] = useState('');
  const [cpaSort, setCpaSort] = useState('date-desc');
  const [selectedRetirementAccountType, setSelectedRetirementAccountType] = useState('');
  const [cpaExportSoftware, setCpaExportSoftware] = useState('xero');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    vendor: '',
    amount: '',
    type: 'expense',
    category: '',
    source: '',
    institution: '',
    recurring: false,
    frequency: 'monthly'
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Income', 'Other Income'],
    expense: ['Housing', 'Food', 'Utilities', 'Transportation', 'Insurance', 'Healthcare', 'Entertainment', 'Other']
  };

  const retirementAccountTypes = ['401k', 'Roth IRA', 'Traditional IRA', 'VUL', 'IUL'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  // ALL useMemo hooks MUST be defined before any conditional returns
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    if (selectedMonth === -1) {
      return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === selectedYear;
      });
    }
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    return { income, expenses, netIncome: income - expenses };
  }, [filteredTransactions]);

  const incomeBySource = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'income').forEach(t => {
      const source = t.source || 'Other';
      grouped[source] = (grouped[source] || 0) + (t.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const expensesByCategory = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const category = t.category || 'Other';
      grouped[category] = (grouped[category] || 0) + Math.abs(t.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions.filter(t => {
      if (!transactionFilter) return true;
      const searchTerm = transactionFilter.toLowerCase();
      return (
        (t.description || '').toLowerCase().includes(searchTerm) ||
        (t.vendor || '').toLowerCase().includes(searchTerm) ||
        (t.category || '').toLowerCase().includes(searchTerm) ||
        (t.source || '').toLowerCase().includes(searchTerm)
      );
    });
    return filtered.sort((a, b) => {
      switch (transactionSort) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc': return Math.abs(a.amount) - Math.abs(b.amount);
        case 'vendor': return (a.vendor || '').localeCompare(b.vendor || '');
        case 'category': return (a.category || '').localeCompare(b.category || '');
        default: return 0;
      }
    });
  }, [transactions, transactionFilter, transactionSort]);

  const cpaFilteredAndSorted = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions.filter(t => {
      if (!cpaFilter) return true;
      const searchTerm = cpaFilter.toLowerCase();
      return (
        (t.description || '').toLowerCase().includes(searchTerm) ||
        (t.vendor || '').toLowerCase().includes(searchTerm)
      );
    });
    return filtered.sort((a, b) => {
      switch (cpaSort) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc': return Math.abs(a.amount) - Math.abs(b.amount);
        default: return 0;
      }
    });
  }, [transactions, cpaFilter, cpaSort]);

  // Helper function for GL Account mapping
  const mapToGLAccount = (description, category, type) => {
    const desc = (description || '').toLowerCase();
    if (desc.includes('mortgage')) return { number: '2001', description: 'Mortgage' };
    if (desc.includes('insurance')) return { number: '6006', description: 'Insurance' };
    if (desc.includes('utilities') || desc.includes('electric') || desc.includes('gas')) return { number: '6013', description: 'Utilities' };
    if (desc.includes('salary')) return { number: '4007', description: 'Payroll' };
    if (category === 'Housing') return { number: '2001', description: 'Mortgage' };
    if (category === 'Food') return { number: '6016', description: 'Meals & Entertainment' };
    if (type === 'income') return { number: '4008', description: 'Revenue' };
    return { number: '1007', description: 'Cash' };
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  };

  // Event handlers
  const handleAddTransaction = async () => {
    if (newTransaction.date && newTransaction.description && newTransaction.amount && newTransaction.vendor) {
      const transaction = {
        date: newTransaction.date,
        description: newTransaction.description,
        vendor: newTransaction.vendor,
        amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1),
        type: newTransaction.type,
        category: newTransaction.category,
        source: newTransaction.source,
        institution: newTransaction.institution,
        recurring: newTransaction.recurring,
        frequency: newTransaction.frequency
      };
      
      await addTransaction(transaction);
      
      if (newTransaction.recurring && newTransaction.type === 'expense') {
        const transactionDate = new Date(newTransaction.date);
        const nextDueDate = new Date(transactionDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        
        await addBillDate({
          name: newTransaction.description,
          amount: Math.abs(parseFloat(newTransaction.amount)),
          dueDate: nextDueDate.toISOString().split('T')[0]
        });
        alert(`✅ Transaction added and scheduled as recurring bill`);
      }
      
      setNewTransaction({ date: '', description: '', vendor: '', amount: '', type: 'expense', category: '', source: '', institution: '', recurring: false, frequency: 'monthly' });
    }
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          const parsed = parseCSV(text);
          const newTransactions = parsed
            .filter(row => row.date || row.Date)
            .map(row => ({
              date: row.date || row.Date,
              description: row.description || row.Description || 'Transaction',
              vendor: row.vendor || row.Vendor || 'Unknown',
              amount: parseFloat(row.amount || row.Amount || '0'),
              type: parseFloat(row.amount || row.Amount || '0') > 0 ? 'income' : 'expense',
              category: row.category || row.Category || 'Uncategorized',
              source: row.source || row.Source || 'Import',
              institution: '',
              recurring: false,
              frequency: 'monthly'
            }));
          
          if (newTransactions.length > 0) {
            await bulkImportTransactions(newTransactions);
            alert(`Successfully imported ${newTransactions.length} transactions`);
          }
        } catch (error) {
          alert('Error parsing CSV file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleRetirementFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedRetirementAccountType) {
      alert('Please select an account type first');
      return;
    }
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          const parsed = parseCSV(text);
          let totalValue = 0;
          parsed.forEach(row => {
            const value = parseFloat(row.value || row.Value || row.balance || row.Balance || row.amount || row.Amount || '0');
            if (!isNaN(value)) totalValue += Math.abs(value);
          });
          
          if (totalValue > 0) {
            await addInvestment({
              type: selectedRetirementAccountType,
              accountType: selectedRetirementAccountType,
              currentValue: totalValue,
              targetValue: totalValue * 2
            });
            alert(`Successfully imported ${selectedRetirementAccountType} with value $${totalValue.toLocaleString()}`);
            setSelectedRetirementAccountType('');
          }
        } catch (error) {
          alert('Error parsing file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteBill = async (id) => {
    await deleteBillDate(id);
  };

  const exportCPAData = () => {
    const headers = ['Date', 'Description', 'Vendor', 'Amount', 'Type', 'Category'];
    const rows = cpaFilteredAndSorted.map(t => [
      t.date, t.description, t.vendor, Math.abs(t.amount).toFixed(2), 
      t.amount < 0 ? 'Expense' : 'Income', t.category
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpa-export.csv';
    a.click();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // NOW we can have conditional returns - AFTER all hooks
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Data</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg mr-2">Retry</button>
          <button onClick={handleSignOut} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {saving && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </div>
      )}

      <div className="container mx-auto p-6">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HomeBudget Hub</h1>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white">BETA</div>
              </div>
              <p className="text-slate-300">🌱 Grow your finances now, safeguard your family forever.</p>
            </div>
            <div className="text-right">
              <div className="relative mb-3">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg"
                >
                  <User size={18} />
                  <span className="text-sm max-w-[150px] truncate">{user.email}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-slate-700 rounded-lg">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <Calendar size={20} />
                <span className="text-sm">Current Date</span>
              </div>
              <p className="text-xl font-semibold text-white">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 overflow-x-auto">
          {['dashboard', 'transactions', 'billHistory', 'budget', 'retirement', 'cpa', 'netWorth', 'fire', 'goals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'cpa' ? 'CPA Export' : tab === 'billHistory' ? 'Bills' : tab === 'netWorth' ? 'Net Worth' : tab === 'fire' ? 'FIRE' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Select Period</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-slate-300 mb-2">Month</label>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                    <option value={-1}>All Months</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-slate-300 mb-2">Year</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                    {[2023, 2024, 2025, 2026].map(year => (<option key={year} value={year}>{year}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-green-300">Total Income</h3>
                  <TrendingUp className="text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">${totals.income.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-red-300">Total Expenses</h3>
                  <TrendingDown className="text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">${totals.expenses.toLocaleString()}</p>
              </div>
              <div className={`bg-gradient-to-br ${totals.netIncome >= 0 ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'} border rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${totals.netIncome >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>Net Income</h3>
                  <DollarSign className={totals.netIncome >= 0 ? 'text-blue-400' : 'text-orange-400'} />
                </div>
                <p className="text-3xl font-bold text-white">${totals.netIncome.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Income by Source</h3>
                {incomeBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={incomeBySource} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {incomeBySource.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (<div className="h-[300px] flex items-center justify-center text-slate-400">No income data</div>)}
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (<div className="h-[300px] flex items-center justify-center text-slate-400">No expense data</div>)}
              </div>
            </div>

            {transactions.length === 0 && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Welcome to HomeBudget Hub! 🎉</h3>
                <p className="text-slate-300 mb-6">Get started by adding your first transaction.</p>
                <button onClick={() => setActiveTab('transactions')} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold">
                  Add Your First Transaction
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input type="text" placeholder="Description" value={newTransaction.description} onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input type="text" placeholder="Vendor" value={newTransaction.vendor} onChange={(e) => setNewTransaction({...newTransaction, vendor: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input type="number" placeholder="Amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <select value={newTransaction.type} onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={newTransaction.category} onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value="">Select Category</option>
                  {categories[newTransaction.type].map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <input type="text" placeholder="Source" value={newTransaction.source} onChange={(e) => setNewTransaction({...newTransaction, source: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <label className="flex items-center gap-2 px-4 py-2">
                  <input type="checkbox" checked={newTransaction.recurring} onChange={(e) => setNewTransaction({...newTransaction, recurring: e.target.checked})} className="w-5 h-5" />
                  <span>Recurring</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button onClick={handleAddTransaction} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg disabled:opacity-50">
                  <Plus size={20} /> Add Transaction
                </button>
                <label className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer">
                  <Upload size={20} /><span>Import CSV</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Transactions ({filteredAndSortedTransactions.length})</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="Search..." value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                  </div>
                  <select value={transactionSort} onChange={(e) => setTransactionSort(e.target.value)} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="amount-desc">Amount (High)</option>
                    <option value="amount-asc">Amount (Low)</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Vendor</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedTransactions.slice(0, 20).map(t => (
                      <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4">{t.date}</td>
                        <td className="py-3 px-4">{t.description}</td>
                        <td className="py-3 px-4">{t.vendor}</td>
                        <td className="py-3 px-4">{t.category}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleDeleteTransaction(t.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAndSortedTransactions.length === 0 && (
                <p className="text-slate-400 text-center py-8">No transactions yet. Add your first one above!</p>
              )}
            </div>
          </div>
        )}

        {/* Bill History Tab */}
        {activeTab === 'billHistory' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Bills</h3>
            {billDates && billDates.length > 0 ? (
              <div className="space-y-3">
                {billDates.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-semibold">{bill.name}</p>
                      <p className="text-sm text-slate-400">Due: {bill.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-red-400">${bill.amount?.toLocaleString()}</span>
                      <button onClick={() => handleDeleteBill(bill.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No upcoming bills. Add recurring transactions to see them here!</p>
            )}
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Monthly Income</h3>
              <div className="space-y-3">
                {budgetData?.income?.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span>{item.name}</span>
                    <span className="text-green-400 font-semibold">${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-lg font-semibold">Total: <span className="text-green-400">${budgetData?.income?.reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString()}</span></p>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
              <div className="space-y-3">
                {budgetData?.expenses?.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span>{item.name}</span>
                    <span className="text-red-400 font-semibold">${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-lg font-semibold">Total: <span className="text-red-400">${budgetData?.expenses?.reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Retirement Tab */}
        {activeTab === 'retirement' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Import Retirement Account</h3>
              <div className="mb-4">
                <select value={selectedRetirementAccountType} onChange={(e) => setSelectedRetirementAccountType(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value="">Select account type...</option>
                  {retirementAccountTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <label className="flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">
                <Upload size={24} />
                <span className="text-lg font-semibold">Upload Statement (CSV)</span>
                <input type="file" accept=".csv" onChange={handleRetirementFileUpload} className="hidden" />
              </label>
            </div>
            
            {investments && investments.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investments.map(inv => (
                    <div key={inv.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{inv.type}</h3>
                          <p className="text-sm text-slate-400">{inv.accountType}</p>
                        </div>
                        <Target className="text-purple-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current</span>
                          <span className="font-semibold">${inv.currentValue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target</span>
                          <span className="font-semibold">${inv.targetValue?.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: `${Math.min((inv.currentValue / inv.targetValue) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-semibold mb-4">Total Retirement Value</h3>
                  <p className="text-5xl font-bold">${investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0).toLocaleString()}</p>
                </div>
              </>
            )}
            
            {(!investments || investments.length === 0) && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">No retirement accounts yet. Upload a statement above!</p>
              </div>
            )}
          </div>
        )}

        {/* CPA Export Tab */}
        {activeTab === 'cpa' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-4">CPA Export</h3>
              <p className="text-slate-300 mb-6">Export your transactions for your accountant.</p>
              <button onClick={exportCPAData} disabled={!transactions || transactions.length === 0} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold disabled:opacity-50">
                <Download size={20} /> Export CSV
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Preview ({cpaFilteredAndSorted.length} transactions)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-2 px-3">Date</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-left py-2 px-3">Vendor</th>
                      <th className="text-right py-2 px-3">Amount</th>
                      <th className="text-left py-2 px-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cpaFilteredAndSorted.slice(0, 10).map(t => (
                      <tr key={t.id} className="border-b border-slate-700">
                        <td className="py-2 px-3">{t.date}</td>
                        <td className="py-2 px-3">{t.description}</td>
                        <td className="py-2 px-3">{t.vendor}</td>
                        <td className="py-2 px-3 text-right">${Math.abs(t.amount).toFixed(2)}</td>
                        <td className="py-2 px-3">{t.amount < 0 ? 'Expense' : 'Income'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Net Worth Tab */}
        {activeTab === 'netWorth' && <NetWorthDashboard />}

        {/* FIRE Calculator Tab */}
        {activeTab === 'fire' && <FIRECalculator />}

        {/* Goals Tab */}
        {activeTab === 'goals' && <GoalsTracker />}
      </div>
    </div>
  );
};

// Wrapper component handles auth state
const FinanceDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard user={user} signOut={signOut} />;
};

export default FinanceDashboard;
