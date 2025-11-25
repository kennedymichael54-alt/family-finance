import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';

export function FIRECalculator({ currentNetWorth = 0 }) {
  const [inputs, setInputs] = useState({
    currentSavings: currentNetWorth,
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    monthlySavings: 1500,
    currentAge: 30,
    retirementAge: 65,
    expectedReturn: 7,
    inflationRate: 3,
    safeWithdrawalRate: 4
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateFIRE();
  }, [inputs]);

  function calculateFIRE() {
    const {
      currentSavings,
      monthlySavings,
      monthlyExpenses,
      currentAge,
      expectedReturn,
      inflationRate,
      safeWithdrawalRate
    } = inputs;

    // FIRE number = Annual expenses / Safe withdrawal rate
    const annualExpenses = monthlyExpenses * 12;
    const fireNumber = annualExpenses / (safeWithdrawalRate / 100);

    // Calculate years to FIRE
    const monthlyReturn = expectedReturn / 100 / 12;
    const monthsToFIRE = Math.log(
      (fireNumber * monthlyReturn) / monthlySavings + 1
    ) / Math.log(1 + monthlyReturn);
    const yearsToFIRE = Math.ceil(monthsToFIRE / 12);
    const fireAge = currentAge + yearsToFIRE;

    // Generate projection data
    const projectionData = [];
    let balance = currentSavings;
    
    for (let year = 0; year <= Math.min(yearsToFIRE + 5, 40); year++) {
      projectionData.push({
        year: currentAge + year,
        balance: Math.round(balance),
        fireNumber: Math.round(fireNumber)
      });
      
      // Compound for next year
      balance = balance * (1 + expectedReturn / 100) + (monthlySavings * 12);
    }

    // Calculate coast FIRE (stop contributing, let it grow)
    const coastFIREYears = Math.log(fireNumber / currentSavings) / Math.log(1 + expectedReturn / 100);
    const coastFIREAge = currentAge + Math.ceil(coastFIREYears);

    // Lean vs Fat FIRE scenarios
    const leanFIRE = (annualExpenses * 0.7) / (safeWithdrawalRate / 100);
    const fatFIRE = (annualExpenses * 1.5) / (safeWithdrawalRate / 100);

    setResults({
      fireNumber,
      yearsToFIRE,
      fireAge,
      monthsToFIRE: Math.ceil(monthsToFIRE),
      projectionData,
      coastFIREAge,
      leanFIRE,
      fatFIRE,
      savingsRate: ((monthlySavings / inputs.monthlyIncome) * 100).toFixed(1)
    });
  }

  function handleInputChange(field, value) {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }

  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">FIRE Number</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${(results.fireNumber / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">25x annual expenses</p>
            </div>
            <Target className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Years to FIRE</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {results.yearsToFIRE}
              </p>
              <p className="text-xs text-gray-500 mt-1">{results.monthsToFIRE} months</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">FIRE Age</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {results.fireAge}
              </p>
              <p className="text-xs text-gray-500 mt-1">vs {inputs.retirementAge} traditional</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {results.savingsRate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">${inputs.monthlySavings}/mo</p>
            </div>
            <DollarSign className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Path to FIRE</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={results.projectionData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorBalance)"
              name="Portfolio Balance"
            />
            <Line
              type="monotone"
              dataKey="fireNumber"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="FIRE Number"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Input Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adjust Your Numbers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Savings</label>
            <input
              type="number"
              value={inputs.currentSavings}
              onChange={(e) => handleInputChange('currentSavings', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Income</label>
            <input
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Expenses</label>
            <input
              type="number"
              value={inputs.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Savings</label>
            <input
              type="number"
              value={inputs.monthlySavings}
              onChange={(e) => handleInputChange('monthlySavings', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Age</label>
            <input
              type="number"
              value={inputs.currentAge}
              onChange={(e) => handleInputChange('currentAge', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Return (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.expectedReturn}
              onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </Card>

      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h4 className="font-semibold text-green-700 mb-2">Lean FIRE</h4>
          <p className="text-2xl font-bold">${(results.leanFIRE / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600 mt-1">70% of current expenses</p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-blue-700 mb-2">Regular FIRE</h4>
          <p className="text-2xl font-bold">${(results.fireNumber / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600 mt-1">Current lifestyle</p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-purple-700 mb-2">Fat FIRE</h4>
          <p className="text-2xl font-bold">${(results.fatFIRE / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600 mt-1">150% of current expenses</p>
        </Card>
      </div>

      {/* Coast FIRE Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h4 className="font-semibold text-lg mb-2">🏖️ Coast FIRE</h4>
        <p className="text-gray-700">
          You could stop saving at age <strong>{results.coastFIREAge}</strong> and still reach FIRE by {inputs.retirementAge} 
          if you maintain a {inputs.expectedReturn}% return.
        </p>
      </Card>
    </div>
  );
}
