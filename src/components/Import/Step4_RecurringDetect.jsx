import React, { useState, useEffect } from 'react';

const Step4_RecurringDetect = ({ hubType, importData, updateImportData, onNext, onBack }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Known recurring merchant patterns
  const recurringPatterns = [
    { pattern: /NETFLIX/i, name: 'Netflix', type: 'subscription' },
    { pattern: /SPOTIFY/i, name: 'Spotify', type: 'subscription' },
    { pattern: /HULU/i, name: 'Hulu', type: 'subscription' },
    { pattern: /DISNEY\+|DISNEY PLUS/i, name: 'Disney+', type: 'subscription' },
    { pattern: /HBO|MAX/i, name: 'HBO Max', type: 'subscription' },
    { pattern: /AMAZON PRIME/i, name: 'Amazon Prime', type: 'subscription' },
    { pattern: /APPLE\.COM\/BILL|APPLE MUSIC/i, name: 'Apple', type: 'subscription' },
    { pattern: /YOUTUBE PREMIUM/i, name: 'YouTube Premium', type: 'subscription' },
    { pattern: /AT&T|ATT/i, name: 'AT&T', type: 'utility' },
    { pattern: /VERIZON/i, name: 'Verizon', type: 'utility' },
    { pattern: /T-MOBILE|TMOBILE/i, name: 'T-Mobile', type: 'utility' },
    { pattern: /COMCAST|XFINITY/i, name: 'Xfinity', type: 'utility' },
    { pattern: /SPECTRUM/i, name: 'Spectrum', type: 'utility' },
    { pattern: /DUKE ENERGY/i, name: 'Duke Energy', type: 'utility' },
    { pattern: /STATE FARM/i, name: 'State Farm', type: 'insurance' },
    { pattern: /GEICO/i, name: 'Geico', type: 'insurance' },
    { pattern: /PROGRESSIVE/i, name: 'Progressive', type: 'insurance' },
    { pattern: /ALLSTATE/i, name: 'Allstate', type: 'insurance' },
    { pattern: /PLANET FITNESS|GYM/i, name: 'Gym Membership', type: 'subscription' },
    { pattern: /QUICKBOOKS/i, name: 'QuickBooks', type: 'software' },
    { pattern: /SLACK/i, name: 'Slack', type: 'software' },
    { pattern: /ZOOM/i, name: 'Zoom', type: 'software' },
    { pattern: /MICROSOFT 365|OFFICE 365/i, name: 'Microsoft 365', type: 'software' },
    { pattern: /ADOBE/i, name: 'Adobe', type: 'software' },
    { pattern: /RENT|MORTGAGE/i, name: 'Housing Payment', type: 'housing' },
  ];

  useEffect(() => {
    analyzeRecurring();
  }, [importData.categorizedTransactions]);

  const analyzeRecurring = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const transactions = importData.categorizedTransactions;
    const detected = [];
    const processed = new Set();

    transactions.forEach(transaction => {
      // Check against known patterns
      for (const pattern of recurringPatterns) {
        if (pattern.pattern.test(transaction.description) && !processed.has(pattern.name)) {
          processed.add(pattern.name);
          
          // Find all matching transactions for this merchant
          const matches = transactions.filter(t => pattern.pattern.test(t.description));
          const avgAmount = matches.reduce((sum, t) => sum + Math.abs(t.amount), 0) / matches.length;
          
          // Detect frequency based on dates
          const frequency = detectFrequency(matches);
          
          detected.push({
            id: `recurring-${detected.length}`,
            merchantName: pattern.name,
            originalDescription: transaction.description,
            type: pattern.type,
            averageAmount: avgAmount,
            frequency: frequency,
            occurrences: matches.length,
            lastDate: matches[matches.length - 1]?.date || transaction.date,
            addToBills: true,
            estimatedDueDay: extractDueDay(matches),
          });
        }
      }
      
      // Also detect by similar amounts and descriptions (for patterns not in known list)
      // This is a simplified version - production would have more sophisticated matching
    });

    setRecurringTransactions(detected);
    setIsAnalyzing(false);
  };

  const detectFrequency = (transactions) => {
    if (transactions.length < 2) return 'monthly';
    
    // Simple frequency detection based on date differences
    // Production version would be more sophisticated
    return 'monthly';
  };

  const extractDueDay = (transactions) => {
    if (transactions.length === 0) return 15;
    
    // Extract day from most recent transaction
    const lastDate = transactions[transactions.length - 1]?.date;
    if (lastDate) {
      const day = new Date(lastDate).getDate();
      return day || 15;
    }
    return 15;
  };

  const handleToggleBill = (id) => {
    setRecurringTransactions(prev =>
      prev.map(r =>
        r.id === id ? { ...r, addToBills: !r.addToBills } : r
      )
    );
  };

  const handleFrequencyChange = (id, frequency) => {
    setRecurringTransactions(prev =>
      prev.map(r =>
        r.id === id ? { ...r, frequency } : r
      )
    );
  };

  const handleDueDayChange = (id, day) => {
    setRecurringTransactions(prev =>
      prev.map(r =>
        r.id === id ? { ...r, estimatedDueDay: parseInt(day) } : r
      )
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeIcon = (type) => {
    const icons = {
      subscription: '📱',
      utility: '💡',
      insurance: '🛡️',
      software: '💻',
      housing: '🏠',
      other: '📋',
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type) => {
    const colors = {
      subscription: '#c084fc',
      utility: '#fbbf24',
      insurance: '#60a5fa',
      software: '#4ade80',
      housing: '#f472b6',
      other: '#94a3b8',
    };
    return colors[type] || '#94a3b8';
  };

  const billsToAdd = recurringTransactions.filter(r => r.addToBills);

  const handleNext = () => {
    updateImportData({
      recurringTransactions,
      billsToCreate: billsToAdd,
    });
    onNext();
  };

  if (isAnalyzing) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <span style={styles.pennyIcon}>🪙</span>
          <div style={styles.spinner}></div>
          <h3 style={styles.loadingTitle}>Penny is detecting recurring transactions...</h3>
          <p style={styles.loadingText}>Looking for subscriptions, bills, and regular payments</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerCard}>
        <span style={styles.headerIcon}>🔁</span>
        <div>
          <h3 style={styles.headerTitle}>
            {recurringTransactions.length > 0
              ? `Found ${recurringTransactions.length} recurring transactions!`
              : 'No recurring transactions detected'
            }
          </h3>
          <p style={styles.headerText}>
            {recurringTransactions.length > 0
              ? 'Select which ones to add to your Bills tab for automatic tracking.'
              : 'Penny didn\'t find any recurring patterns. You can manually add bills later.'
            }
          </p>
        </div>
      </div>

      {/* Recurring List */}
      {recurringTransactions.length > 0 && (
        <div style={styles.recurringList}>
          {recurringTransactions.map(item => (
            <div
              key={item.id}
              style={{
                ...styles.recurringCard,
                ...(item.addToBills ? styles.recurringCardSelected : {})
              }}
            >
              <div style={styles.recurringMain}>
                <div style={styles.recurringCheckbox}>
                  <input
                    type="checkbox"
                    checked={item.addToBills}
                    onChange={() => handleToggleBill(item.id)}
                    style={styles.checkbox}
                  />
                </div>
                
                <div style={styles.recurringIcon}>
                  <span style={{
                    ...styles.typeIcon,
                    background: `${getTypeColor(item.type)}20`,
                    color: getTypeColor(item.type),
                  }}>
                    {getTypeIcon(item.type)}
                  </span>
                </div>
                
                <div style={styles.recurringInfo}>
                  <h4 style={styles.recurringName}>{item.merchantName}</h4>
                  <p style={styles.recurringDesc}>
                    Found {item.occurrences}x • Last: {item.lastDate}
                  </p>
                </div>
                
                <div style={styles.recurringAmount}>
                  <span style={styles.amountValue}>{formatCurrency(item.averageAmount)}</span>
                  <span style={styles.amountFreq}>/month</span>
                </div>
              </div>
              
              {item.addToBills && (
                <div style={styles.recurringOptions}>
                  <div style={styles.optionGroup}>
                    <label style={styles.optionLabel}>Frequency</label>
                    <select
                      style={styles.optionSelect}
                      value={item.frequency}
                      onChange={(e) => handleFrequencyChange(item.id, e.target.value)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every 2 Weeks</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div style={styles.optionGroup}>
                    <label style={styles.optionLabel}>Due Day</label>
                    <select
                      style={styles.optionSelect}
                      value={item.estimatedDueDay}
                      onChange={(e) => handleDueDayChange(item.id, e.target.value)}
                    >
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}{getOrdinalSuffix(i + 1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {billsToAdd.length > 0 && (
        <div style={styles.summaryBox}>
          <span style={styles.summaryIcon}>📋</span>
          <div style={styles.summaryContent}>
            <p style={styles.summaryTitle}>
              {billsToAdd.length} bills will be added to your Bills tab
            </p>
            <p style={styles.summaryTotal}>
              Estimated monthly total: {' '}
              <strong>
                {formatCurrency(billsToAdd.reduce((sum, b) => sum + b.averageAmount, 0))}
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {recurringTransactions.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📭</span>
          <h4 style={styles.emptyTitle}>No recurring transactions found</h4>
          <p style={styles.emptyText}>
            This could be because your import doesn't span enough time, 
            or the transactions don't match common recurring patterns.
            You can always add bills manually later!
          </p>
        </div>
      )}

      {/* Penny Tip */}
      <div style={styles.pennyTip}>
        <span style={styles.pennyTipIcon}>🪙</span>
        <p style={styles.pennyTipText}>
          <strong>Penny says:</strong> Bills added here will show up in your Bills tab with 
          due date reminders. I'll also track them against your budget automatically!
        </p>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <button style={styles.nextBtn} onClick={handleNext}>
          Continue to Review →
        </button>
      </div>
    </div>
  );
};

// Helper function for ordinal suffixes
const getOrdinalSuffix = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  loadingContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  pennyIcon: {
    fontSize: '48px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#c44dff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  headerCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    border: '1px solid rgba(102, 126, 234, 0.2)',
  },
  headerIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  headerTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  headerText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
  },
  recurringList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  recurringCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '16px 18px',
    transition: 'all 0.2s ease',
  },
  recurringCardSelected: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    background: 'rgba(74, 222, 128, 0.05)',
  },
  recurringMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  recurringCheckbox: {
    flexShrink: 0,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    accentColor: '#4ade80',
    cursor: 'pointer',
  },
  recurringIcon: {
    flexShrink: 0,
  },
  typeIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },
  recurringInfo: {
    flex: 1,
    minWidth: 0,
  },
  recurringName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  recurringDesc: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  recurringAmount: {
    textAlign: 'right',
    flexShrink: 0,
  },
  amountValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f87171',
  },
  amountFreq: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  recurringOptions: {
    display: 'flex',
    gap: '16px',
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingLeft: '34px',
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  optionLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  optionSelect: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#ffffff',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '120px',
  },
  summaryBox: {
    background: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  summaryIcon: {
    fontSize: '24px',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: '500',
  },
  summaryTotal: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    maxWidth: '400px',
    marginInline: 'auto',
    lineHeight: '1.5',
  },
  pennyTip: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  pennyTipIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  pennyTipText: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '8px',
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
  nextBtn: {
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c44dff 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 28px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(196, 77, 255, 0.3)',
  },
};

export default Step4_RecurringDetect;
