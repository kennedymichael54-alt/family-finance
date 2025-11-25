import React, { useState } from 'react';
import { useNetWorth } from '../hooks/useNetWorth';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, Home, Briefcase } from 'lucide-react';

const ASSET_COLORS = {
  cash: '#10b981',
  investment: '#3b82f6',
  retirement: '#8b5cf6',
  real_estate: '#f59e0b',
  vehicle: '#6366f1',
  other: '#94a3b8'
};

const LIABILITY_COLORS = {
  mortgage: '#ef4444',
  student_loan: '#f97316',
  auto_loan: '#f59e0b',
  credit_card: '#dc2626',
  personal_loan: '#ec4899',
  other: '#94a3b8'
};

export function NetWorthDashboard() {
  const {
    assets,
    liabilities,
    snapshots,
    currentNetWorth,
    loading,
    addAsset,
    addLiability,
    createSnapshot
  } = useNetWorth();

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);

  // Prepare chart data
  const assetsPieData = Object.entries(
    assets.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + parseFloat(a.current_value);
      return acc;
    }, {})
  ).map(([type, value]) => ({
    name: type.replace('_', ' '),
    value,
    color: ASSET_COLORS[type]
  }));

  const liabilitiesPieData = Object.entries(
    liabilities.reduce((acc, l) => {
      acc[l.type] = (acc[l.type] || 0) + parseFloat(l.current_balance);
      return acc;
    }, {})
  ).map(([type, value]) => ({
    name: type.replace('_', ' '),
    value,
    color: LIABILITY_COLORS[type]
  }));

  const netWorthTrendData = snapshots
    .slice()
    .reverse()
    .map(s => ({
      date: new Date(s.snapshot_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      netWorth: parseFloat(s.net_worth),
      assets: parseFloat(s.total_assets),
      liabilities: parseFloat(s.total_liabilities)
    }));

  // Calculate growth
  const growth = snapshots.length >= 2
    ? ((parseFloat(snapshots[0].net_worth) - parseFloat(snapshots[1].net_worth)) / Math.abs(parseFloat(snapshots[1].net_worth))) * 100
    : 0;

  if (loading) {
    return <div className="text-center py-12">Loading net worth data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Worth</p>
              <p className="text-3xl font-bold mt-1">
                ${currentNetWorth.netWorth.toLocaleString()}
              </p>
              {growth !== 0 && (
                <div className={`flex items-center mt-2 text-sm ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(growth).toFixed(1)}% this month
                </div>
              )}
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${currentNetWorth.totalAssets.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">{assets.length} accounts</p>
            </div>
            <Wallet className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Liabilities</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                ${currentNetWorth.totalLiabilities.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">{liabilities.length} debts</p>
            </div>
            <CreditCard className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Net Worth Trend */}
      {netWorthTrendData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Net Worth Trend</h3>
            <Button onClick={createSnapshot} variant="outline" size="sm">
              Take Snapshot
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={netWorthTrendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={3} name="Net Worth" />
              <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} name="Assets" />
              <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} name="Liabilities" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Asset & Liability Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assets</h3>
            <Button onClick={() => setShowAddAsset(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Asset
            </Button>
          </div>
          {assetsPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={assetsPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {assetsPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No assets added yet</p>
          )}
          <div className="mt-4 space-y-2">
            {assets.map(asset => (
              <div key={asset.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{asset.name}</span>
                <span className="font-semibold">${parseFloat(asset.current_value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Liabilities</h3>
            <Button onClick={() => setShowAddLiability(true)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Add Liability
            </Button>
          </div>
          {liabilitiesPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={liabilitiesPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {liabilitiesPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No liabilities added yet</p>
          )}
          <div className="mt-4 space-y-2">
            {liabilities.map(liability => (
              <div key={liability.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{liability.name}</span>
                <span className="font-semibold text-red-600">${parseFloat(liability.current_balance).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Asset Modal - Implement separately */}
      {/* Add Liability Modal - Implement separately */}
    </div>
  );
}
