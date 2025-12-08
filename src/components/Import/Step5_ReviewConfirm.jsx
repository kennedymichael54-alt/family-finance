import React, { useState, useMemo } from 'react';

const Step5_ReviewConfirm = ({ hubType, importData, updateImportData, onComplete, onBack }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [pennyInsight, setPennyInsight] = useState(null);

  // Calculate summary stats
  const summary = useMemo(() => {
    const transactions = importData.categorizedTransactions || [];
    
    const totalTransactions = transactions.length;
    const categorized = transactions.filter(t => t.category).length;
    const uncategorized = totalTransactions - categorized;
    
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netFlow = income - expenses;
    
    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      if (t.category && t.amount < 0) {
        if (!categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] = 0;
        }
        categoryBreakdown[t.category] += Math.abs(t.amount);
      }
    });
    
    // Sort by amount
    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const billsCount = (importData.billsToCreate || []).length;
    const monthlyBillsTotal = (importData.billsToCreate || [])
      .reduce((sum, b) => sum + b.averageAmount, 0);
    
    return {
      totalTransactions,
      categorized,
      uncategorized,
      income,
      expenses,
      netFlow,
      topCategories,
      billsCount,
      monthlyBillsTotal,
      accountTag: importData.accountTag,
    };
  }, [importData]);

  // Generate Penny insights
  const pennyInsights = useMemo(() => {
    const insights = [];
    
    if (summary.netFlow > 0) {
      insights.push({
        type: 'positive',
        message: `Great news! You had a positive cash flow of ${formatCurrency(summary.netFlow)} during this period.`
      });
    } else if (summary.netFlow < 0) {
      insights.push({
        type: 'warning',
        message: `Heads up! Expenses exceeded income by ${formatCurrency(Math.abs(summary.netFlow))} during this period.`
      });
    }
    
    if (summary.topCategories.length > 0) {
      const topCat = summary.topCategories[0];
      insights.push({
        type: 'info',
        message: `Your top spending category was ${getCategoryName(topCat[0])} at ${formatCurrency(topCat[1])}.`
      });
    }
    
    if (summary.billsCount > 0) {
      insights.push({
        type: 'info',
        message: `I detected ${summary.billsCount} recurring bills totaling ~${formatCurrency(summary.monthlyBillsTotal)}/month.`
      });
    }
    
    if (summary.uncategorized > 0) {
      insights.push({
        type: 'action',
        message: `${summary.uncategorized} transactions still need categories. You can fix these in the Transactions tab.`
      });
    }
    
    return insights;
  }, [summary]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      groceries: 'Groceries',
      dining: 'Dining Out',
      entertainment: 'Entertainment',
      utilities: 'Utilities',
      transportation: 'Transportation',
      healthcare: 'Healthcare',
      shopping: 'Shopping',
      subscriptions: 'Subscriptions',
      income: 'Income',
      transfer: 'Transfer',
      housing: 'Housing',
      insurance: 'Insurance',
      personal: 'Personal Care',
      education: 'Education',
      pets: 'Pets',
      gifts: 'Gifts & Donations',
      revenue: 'Revenue',
      payroll: 'Payroll',
      rent: 'Rent/Lease',
      supplies: 'Supplies',
      equipment: 'Equipment',
      marketing: 'Marketing',
      professional: 'Professional Services',
      travel: 'Travel',
      meals: 'Meals & Entertainment',
      software: 'Software/Tech',
      taxes: 'Taxes',
      franchise: 'Franchise Fees',
      vehicle: 'Vehicle',
      other: 'Other',
    };
    return categories[categoryId] || categoryId;
  };

  const getAccountTagName = (tag) => {
    const names = {
      personal: 'Personal',
      side_hustle: 'Side Hustle',
      joint: 'Joint Account',
      operating: 'Operating',
      payroll: 'Payroll',
      savings: 'Business Savings',
      franchise: 'Franchise',
      credit: 'Business Credit',
    };
    return names[tag] || tag;
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, this would:
    // 1. Save transactions to database
    // 2. Create bill entries
    // 3. Save merchant rules
    // 4. Save template if requested
    
    const importSummary = {
      transactionsImported: summary.totalTransactions,
      billsCreated: summary.billsCount,
      income: summary.income,
      expenses: summary.expenses,
      topCategory: summary.topCategories[0],
    };
    
    setIsImporting(false);
    onComplete(importSummary);
  };

  const getInsightIcon = (type) => {
    const icons = {
      positive: '✅',
      warning: '⚠️',
      info: '💡',
      action: '👉',
    };
    return icons[type] || '💡';
  };

  const getInsightColor = (type) => {
    const colors = {
      positive: 'rgba(74, 222, 128, 0.15)',
      warning: 'rgba(251, 191, 36, 0.15)',
      info: 'rgba(96, 165, 250, 0.15)',
      action: 'rgba(196, 77, 255, 0.15)',
    };
    return colors[type] || 'rgba(96, 165, 250, 0.15)';
  };

  return (
    <div style={styles.container}>
      {/* Penny Header */}
      <div style={styles.pennyHeader}>
        <div style={styles.pennyAvatar}>🪙</div>
        <div style={styles.pennyMessage}>
          <h3 style={styles.pennyTitle}>Penny's Import Summary</h3>
          <p style={styles.pennySubtitle}>
            Here's what I found in your {importData.fileName || 'file'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📊</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{summary.totalTransactions}</span>
            <span style={styles.statLabel}>Transactions</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🏷️</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{getAccountTagName(summary.accountTag)}</span>
            <span style={styles.statLabel}>Account</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>💰</span>
          <div style={styles.statInfo}>
            <span style={{...styles.statValue, color: '#4ade80'}}>
              {formatCurrency(summary.income)}
            </span>
            <span style={styles.statLabel}>Income</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>💸</span>
          <div style={styles.statInfo}>
            <span style={{...styles.statValue, color: '#f87171'}}>
              {formatCurrency(summary.expenses)}
            </span>
            <span style={styles.statLabel}>Expenses</span>
          </div>
        </div>
      </div>

      {/* Categorization Status */}
      <div style={styles.categorizationBox}>
        <div style={styles.categorizationHeader}>
          <span style={styles.categorizationIcon}>📁</span>
          <span style={styles.categorizationTitle}>Categorization Status</span>
        </div>
        <div style={styles.categorizationBar}>
          <div 
            style={{
              ...styles.categorizationFill,
              width: `${(summary.categorized / summary.totalTransactions) * 100}%`
            }}
          />
        </div>
        <div style={styles.categorizationStats}>
          <span style={styles.categorizationStat}>
            <span style={{color: '#4ade80'}}>✓</span> {summary.categorized} categorized
          </span>
          {summary.uncategorized > 0 && (
            <span style={styles.categorizationStat}>
              <span style={{color: '#fbbf24'}}>○</span> {summary.uncategorized} need review
            </span>
          )}
        </div>
      </div>

      {/* Bills Summary */}
      {summary.billsCount > 0 && (
        <div style={styles.billsBox}>
          <div style={styles.billsHeader}>
            <span style={styles.billsIcon}>🔁</span>
            <div>
              <h4 style={styles.billsTitle}>{summary.billsCount} Bills to Add</h4>
              <p style={styles.billsSubtitle}>
                Est. {formatCurrency(summary.monthlyBillsTotal)}/month
              </p>
            </div>
          </div>
          <div style={styles.billsList}>
            {(importData.billsToCreate || []).slice(0, 4).map((bill, index) => (
              <div key={index} style={styles.billItem}>
                <span>{bill.merchantName}</span>
                <span style={{color: '#f87171'}}>{formatCurrency(bill.averageAmount)}</span>
              </div>
            ))}
            {(importData.billsToCreate || []).length > 4 && (
              <div style={styles.billsMore}>
                +{importData.billsToCreate.length - 4} more bills
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {summary.topCategories.length > 0 && (
        <div style={styles.topCategoriesBox}>
          <h4 style={styles.topCategoriesTitle}>📊 Top Spending Categories</h4>
          <div style={styles.categoriesList}>
            {summary.topCategories.map(([category, amount], index) => (
              <div key={category} style={styles.categoryItem}>
                <span style={styles.categoryRank}>#{index + 1}</span>
                <span style={styles.categoryName}>{getCategoryName(category)}</span>
                <span style={styles.categoryAmount}>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Penny Insights */}
      <div style={styles.insightsSection}>
        <h4 style={styles.insightsTitle}>🪙 Penny's Insights</h4>
        <div style={styles.insightsList}>
          {pennyInsights.map((insight, index) => (
            <div 
              key={index} 
              style={{
                ...styles.insightItem,
                background: getInsightColor(insight.type)
              }}
            >
              <span style={styles.insightIcon}>{getInsightIcon(insight.type)}</span>
              <p style={styles.insightText}>{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Import Button */}
      <div style={styles.importSection}>
        {isImporting ? (
          <div style={styles.importingState}>
            <div style={styles.spinnerSmall}></div>
            <span style={styles.importingText}>Importing your transactions...</span>
          </div>
        ) : (
          <button style={styles.importBtn} onClick={handleImport}>
            ✨ Import All Transactions
          </button>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button style={styles.backBtn} onClick={onBack} disabled={isImporting}>
          ← Back
        </button>
        <p style={styles.navNote}>
          You can edit transactions after import
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  pennyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(196, 77, 255, 0.15) 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(196, 77, 255, 0.2)',
  },
  pennyAvatar: {
    fontSize: '48px',
    filter: 'drop-shadow(0 0 10px rgba(255, 200, 100, 0.5))',
  },
  pennyMessage: {
    flex: 1,
  },
  pennyTitle: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(90deg, #ff6b9d, #c44dff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  pennySubtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    fontSize: '24px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  categorizationBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  categorizationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  categorizationIcon: {
    fontSize: '18px',
  },
  categorizationTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
  },
  categorizationBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  categorizationFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  categorizationStats: {
    display: 'flex',
    gap: '16px',
  },
  categorizationStat: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  billsBox: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  billsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  billsIcon: {
    fontSize: '24px',
  },
  billsTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  billsSubtitle: {
    margin: '2px 0 0 0',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  billsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  billItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  billsMore: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    paddingTop: '8px',
  },
  topCategoriesBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  topCategoriesTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  categoryRank: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    width: '24px',
  },
  categoryName: {
    flex: 1,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryAmount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f87171',
  },
  insightsSection: {
    marginTop: '4px',
  },
  insightsTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
  },
  insightIcon: {
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '2px',
  },
  insightText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: '1.5',
  },
  importSection: {
    marginTop: '8px',
  },
  importBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c44dff 100%)',
    border: 'none',
    borderRadius: '14px',
    padding: '18px 32px',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(196, 77, 255, 0.4)',
  },
  importingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '18px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
  },
  spinnerSmall: {
    width: '24px',
    height: '24px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#c44dff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  importingText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '12px 24px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  navNote: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
};

export default Step5_ReviewConfirm;
