import React, { useState, useEffect } from 'react';
import { matchCategory, getCategoryIcon } from './utils/categoryMatcher';

const Step3_Categorize = ({ hubType, importData, updateImportData, onNext, onBack }) => {
  const [categorizedTransactions, setCategorizedTransactions] = useState([]);
  const [rememberChoices, setRememberChoices] = useState(true);
  const [filter, setFilter] = useState('all'); // all, categorized, uncategorized
  const [isProcessing, setIsProcessing] = useState(true);

  // Category options based on hub type
  const categoryOptions = hubType === 'home'
    ? [
        { id: 'groceries', name: 'Groceries', icon: '🛒' },
        { id: 'dining', name: 'Dining Out', icon: '🍽️' },
        { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
        { id: 'utilities', name: 'Utilities', icon: '💡' },
        { id: 'transportation', name: 'Transportation', icon: '🚗' },
        { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️' },
        { id: 'subscriptions', name: 'Subscriptions', icon: '📱' },
        { id: 'income', name: 'Income', icon: '💰' },
        { id: 'transfer', name: 'Transfer', icon: '🔄' },
        { id: 'housing', name: 'Housing', icon: '🏠' },
        { id: 'insurance', name: 'Insurance', icon: '🛡️' },
        { id: 'personal', name: 'Personal Care', icon: '💅' },
        { id: 'education', name: 'Education', icon: '📚' },
        { id: 'pets', name: 'Pets', icon: '🐾' },
        { id: 'gifts', name: 'Gifts & Donations', icon: '🎁' },
        { id: 'other', name: 'Other', icon: '📦' },
      ]
    : [
        { id: 'revenue', name: 'Revenue', icon: '💰' },
        { id: 'payroll', name: 'Payroll', icon: '👥' },
        { id: 'rent', name: 'Rent/Lease', icon: '🏢' },
        { id: 'utilities', name: 'Utilities', icon: '💡' },
        { id: 'supplies', name: 'Supplies', icon: '📦' },
        { id: 'equipment', name: 'Equipment', icon: '🔧' },
        { id: 'marketing', name: 'Marketing', icon: '📣' },
        { id: 'insurance', name: 'Insurance', icon: '🛡️' },
        { id: 'professional', name: 'Professional Services', icon: '💼' },
        { id: 'travel', name: 'Travel', icon: '✈️' },
        { id: 'meals', name: 'Meals & Entertainment', icon: '🍽️' },
        { id: 'software', name: 'Software/Tech', icon: '💻' },
        { id: 'taxes', name: 'Taxes', icon: '📋' },
        { id: 'franchise', name: 'Franchise Fees', icon: '🏪' },
        { id: 'vehicle', name: 'Vehicle', icon: '🚗' },
        { id: 'transfer', name: 'Transfer', icon: '🔄' },
        { id: 'other', name: 'Other', icon: '📦' },
      ];

  // Merchant pattern matching for auto-categorization
  const merchantPatterns = {
    // Home patterns
    'KROGER|PUBLIX|WALMART GROCERY|ALDI|WHOLE FOODS|TRADER JOE': 'groceries',
    'MCDONALD|BURGER KING|CHIPOTLE|STARBUCKS|SUBWAY|WENDY|CHICK-FIL': 'dining',
    'NETFLIX|HULU|SPOTIFY|DISNEY|AMAZON PRIME|HBO|APPLE\\.COM/BILL': 'subscriptions',
    'SHELL|CHEVRON|EXXON|BP|SPEEDWAY|UBER|LYFT': 'transportation',
    'AMAZON|TARGET|WALMART|COSTCO|BEST BUY|HOME DEPOT|LOWES': 'shopping',
    'AT&T|VERIZON|T-MOBILE|COMCAST|SPECTRUM|DUKE ENERGY|WATER': 'utilities',
    'CVS|WALGREENS|PHARMACY|HOSPITAL|DOCTOR|MEDICAL': 'healthcare',
    'PAYROLL|DEPOSIT|DIRECT DEP|SALARY|WAGE': 'income',
    'TRANSFER|ZELLE|VENMO|PAYPAL': 'transfer',
    // Business patterns
    'PAYROLL|ADP|GUSTO|PAYCHEX': 'payroll',
    'FACEBOOK ADS|GOOGLE ADS|MAILCHIMP|HUBSPOT': 'marketing',
    'QUICKBOOKS|XERO|FRESHBOOKS|SLACK|ZOOM|MICROSOFT': 'software',
    'AMERICAN AIRLINES|DELTA|UNITED|MARRIOTT|HILTON|AIRBNB': 'travel',
  };

  useEffect(() => {
    // Auto-categorize transactions on mount
    const categorize = async () => {
      setIsProcessing(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const processed = importData.transactions.map(transaction => {
        const matchedCategory = autoMatchCategory(transaction.description);
        return {
          ...transaction,
          suggestedCategory: matchedCategory,
          category: matchedCategory,
          categoryConfirmed: !!matchedCategory,
        };
      });
      
      setCategorizedTransactions(processed);
      setIsProcessing(false);
    };
    
    categorize();
  }, [importData.transactions]);

  const autoMatchCategory = (description) => {
    const upperDesc = description.toUpperCase();
    
    for (const [pattern, category] of Object.entries(merchantPatterns)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(upperDesc)) {
        return category;
      }
    }
    
    return null;
  };

  const handleCategoryChange = (transactionId, categoryId) => {
    setCategorizedTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, category: categoryId, categoryConfirmed: true }
          : t
      )
    );
  };

  const handleAcceptSuggestion = (transactionId) => {
    setCategorizedTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, categoryConfirmed: true }
          : t
      )
    );
  };

  const handleAcceptAll = () => {
    setCategorizedTransactions(prev => 
      prev.map(t => ({ ...t, categoryConfirmed: true }))
    );
  };

  const getFilteredTransactions = () => {
    switch (filter) {
      case 'categorized':
        return categorizedTransactions.filter(t => t.category);
      case 'uncategorized':
        return categorizedTransactions.filter(t => !t.category);
      default:
        return categorizedTransactions;
    }
  };

  const stats = {
    total: categorizedTransactions.length,
    categorized: categorizedTransactions.filter(t => t.category).length,
    uncategorized: categorizedTransactions.filter(t => !t.category).length,
  };

  const canProceed = () => {
    // Allow proceeding if all have categories OR user explicitly continues
    return categorizedTransactions.length > 0;
  };

  const handleNext = () => {
    // Build merchant rules from user's category choices
    const merchantRules = [];
    if (rememberChoices) {
      categorizedTransactions.forEach(t => {
        if (t.categoryConfirmed && t.category) {
          // Extract merchant pattern from description
          const merchantPattern = extractMerchantPattern(t.description);
          if (merchantPattern) {
            merchantRules.push({
              pattern: merchantPattern,
              categoryId: t.category,
            });
          }
        }
      });
    }

    updateImportData({
      categorizedTransactions,
      merchantRules,
    });
    onNext();
  };

  const extractMerchantPattern = (description) => {
    // Simple extraction - take first 2-3 words
    const words = description.split(/\s+/).slice(0, 3);
    return words.join(' ').toUpperCase();
  };

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  if (isProcessing) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <span style={styles.pennyIcon}>🪙</span>
          <div style={styles.spinner}></div>
          <h3 style={styles.loadingTitle}>Penny is analyzing your transactions...</h3>
          <p style={styles.loadingText}>Auto-detecting categories based on merchant names</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Header */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{stats.total}</span>
          <span style={styles.statLabel}>Total</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={{...styles.statNumber, color: '#4ade80'}}>{stats.categorized}</span>
          <span style={styles.statLabel}>Categorized</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={{...styles.statNumber, color: stats.uncategorized > 0 ? '#fbbf24' : '#4ade80'}}>
            {stats.uncategorized}
          </span>
          <span style={styles.statLabel}>Need Review</span>
        </div>
      </div>

      {/* Filter & Actions Bar */}
      <div style={styles.actionsBar}>
        <div style={styles.filterTabs}>
          <button
            style={{...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {})}}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            style={{...styles.filterTab, ...(filter === 'categorized' ? styles.filterTabActive : {})}}
            onClick={() => setFilter('categorized')}
          >
            ✓ Categorized ({stats.categorized})
          </button>
          <button
            style={{...styles.filterTab, ...(filter === 'uncategorized' ? styles.filterTabActive : {})}}
            onClick={() => setFilter('uncategorized')}
          >
            ⚠ Need Review ({stats.uncategorized})
          </button>
        </div>
        
        {stats.categorized > 0 && (
          <button style={styles.acceptAllBtn} onClick={handleAcceptAll}>
            ✓ Accept All Suggestions
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div style={styles.transactionsList}>
        {getFilteredTransactions().map(transaction => (
          <div 
            key={transaction.id} 
            style={{
              ...styles.transactionRow,
              ...(transaction.categoryConfirmed ? styles.transactionConfirmed : {}),
              ...(!transaction.category ? styles.transactionNeedsReview : {})
            }}
          >
            <div style={styles.transactionMain}>
              <div style={styles.transactionInfo}>
                <span style={styles.transactionDate}>{transaction.date}</span>
                <span style={styles.transactionDesc}>{transaction.description}</span>
              </div>
              <span style={{
                ...styles.transactionAmount,
                color: transaction.amount >= 0 ? '#4ade80' : '#f87171'
              }}>
                {formatAmount(transaction.amount)}
              </span>
            </div>
            
            <div style={styles.categorySection}>
              {transaction.suggestedCategory && !transaction.categoryConfirmed && (
                <div style={styles.suggestionBox}>
                  <span style={styles.suggestionLabel}>Suggested:</span>
                  <span style={styles.suggestionCategory}>
                    {getCategoryIcon(transaction.suggestedCategory, categoryOptions)}{' '}
                    {categoryOptions.find(c => c.id === transaction.suggestedCategory)?.name}
                  </span>
                  <button 
                    style={styles.acceptBtn}
                    onClick={() => handleAcceptSuggestion(transaction.id)}
                  >
                    ✓ Accept
                  </button>
                </div>
              )}
              
              <select
                style={{
                  ...styles.categorySelect,
                  ...(transaction.category ? styles.categorySelectFilled : {})
                }}
                value={transaction.category || ''}
                onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
              >
                <option value="">Select category...</option>
                {categoryOptions.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Remember Choices */}
      <div style={styles.rememberSection}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={rememberChoices}
            onChange={(e) => setRememberChoices(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.checkboxText}>
            Remember my choices for future imports (Learn merchant → category mappings)
          </span>
        </label>
      </div>

      {/* Penny Tip */}
      {stats.uncategorized > 0 && (
        <div style={styles.pennyTip}>
          <span style={styles.pennyTipIcon}>🪙</span>
          <p style={styles.pennyTipText}>
            <strong>Penny says:</strong> {stats.uncategorized} transactions need categories. 
            Don't worry—you can continue and categorize them later in the Transactions tab!
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={styles.navigation}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <button
          style={{
            ...styles.nextBtn,
            ...(canProceed() ? {} : styles.nextBtnDisabled)
          }}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          Continue to Recurring Detection →
        </button>
      </div>
    </div>
  );
};

// Helper function exported for use
const getCategoryIcon = (categoryId, options) => {
  const cat = options.find(c => c.id === categoryId);
  return cat?.icon || '📦';
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
    animation: 'bounce 1s infinite',
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
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
  },
  filterTab: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '8px 14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterTabActive: {
    background: 'rgba(196, 77, 255, 0.2)',
    borderColor: 'rgba(196, 77, 255, 0.4)',
    color: '#ffffff',
  },
  acceptAllBtn: {
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#000',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  transactionRow: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  transactionConfirmed: {
    borderColor: 'rgba(74, 222, 128, 0.3)',
    background: 'rgba(74, 222, 128, 0.05)',
  },
  transactionNeedsReview: {
    borderColor: 'rgba(251, 191, 36, 0.3)',
    background: 'rgba(251, 191, 36, 0.05)',
  },
  transactionMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  transactionDate: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  transactionDesc: {
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: '15px',
    fontWeight: '600',
  },
  categorySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  suggestionBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(102, 126, 234, 0.15)',
    borderRadius: '8px',
    padding: '6px 12px',
  },
  suggestionLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  suggestionCategory: {
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: '500',
  },
  acceptBtn: {
    background: 'rgba(74, 222, 128, 0.2)',
    border: '1px solid rgba(74, 222, 128, 0.4)',
    borderRadius: '6px',
    padding: '4px 10px',
    color: '#4ade80',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  categorySelect: {
    flex: 1,
    minWidth: '180px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },
  categorySelectFilled: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    color: '#ffffff',
  },
  rememberSection: {
    paddingTop: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#c44dff',
  },
  checkboxText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
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
  nextBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};

export default Step3_Categorize;
