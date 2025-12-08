import React, { useState } from 'react';

const Step2_AccountTag = ({ hubType, importData, updateImportData, onNext, onBack }) => {
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  // Account options based on hub type
  const accountOptions = hubType === 'home' 
    ? [
        { id: 'personal', name: 'Personal', icon: '💳', description: 'Personal checking, savings, credit cards', color: '#4ade80' },
        { id: 'side_hustle', name: 'Side Hustle', icon: '💼', description: 'Freelance income, gig work, small projects', color: '#fbbf24' },
        { id: 'joint', name: 'Joint Account', icon: '👥', description: 'Shared accounts with partner or family', color: '#60a5fa' },
      ]
    : [
        { id: 'operating', name: 'Operating', icon: '🏦', description: 'Main business checking account', color: '#4ade80' },
        { id: 'payroll', name: 'Payroll', icon: '💵', description: 'Employee wages and benefits', color: '#60a5fa' },
        { id: 'savings', name: 'Business Savings', icon: '🏧', description: 'Business reserves and emergency fund', color: '#fbbf24' },
        { id: 'franchise', name: 'Franchise', icon: '🏢', description: 'Franchise-specific transactions', color: '#c084fc' },
        { id: 'credit', name: 'Business Credit', icon: '💳', description: 'Business credit cards', color: '#f472b6' },
      ];

  const handleAccountSelect = (accountId) => {
    updateImportData({ accountTag: accountId });
  };

  const handleAddNewAccount = () => {
    if (newAccountName.trim()) {
      // In production, this would save to database
      updateImportData({ accountTag: newAccountName.toLowerCase().replace(/\s+/g, '_') });
      setShowNewAccount(false);
      setNewAccountName('');
    }
  };

  const canProceed = () => {
    return importData.accountTag !== '';
  };

  const handleNext = () => {
    if (canProceed()) {
      // Apply account tag to all transactions
      const taggedTransactions = importData.transactions.map(t => ({
        ...t,
        accountTag: importData.accountTag
      }));
      updateImportData({ transactions: taggedTransactions });
      onNext();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Info */}
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>🏷️</span>
        <div style={styles.infoContent}>
          <h3 style={styles.infoTitle}>Tag Your Account</h3>
          <p style={styles.infoText}>
            Which account did these <strong>{importData.transactions.length} transactions</strong> come from? 
            This helps organize your data and powers the filters across your dashboard.
          </p>
        </div>
      </div>

      {/* Account Selection Grid */}
      <div style={styles.accountGrid}>
        {accountOptions.map(account => (
          <button
            key={account.id}
            style={{
              ...styles.accountCard,
              ...(importData.accountTag === account.id ? {
                ...styles.accountCardSelected,
                borderColor: account.color,
                boxShadow: `0 0 20px ${account.color}40`,
              } : {})
            }}
            onClick={() => handleAccountSelect(account.id)}
          >
            <div style={styles.accountIconWrapper}>
              <span style={styles.accountIcon}>{account.icon}</span>
              {importData.accountTag === account.id && (
                <div style={{...styles.checkBadge, background: account.color}}>✓</div>
              )}
            </div>
            <h4 style={styles.accountName}>{account.name}</h4>
            <p style={styles.accountDesc}>{account.description}</p>
          </button>
        ))}

        {/* Add New Account Card */}
        <button
          style={{
            ...styles.accountCard,
            ...styles.addNewCard,
            ...(showNewAccount ? styles.accountCardSelected : {})
          }}
          onClick={() => setShowNewAccount(true)}
        >
          <div style={styles.accountIconWrapper}>
            <span style={styles.accountIcon}>➕</span>
          </div>
          <h4 style={styles.accountName}>Add New</h4>
          <p style={styles.accountDesc}>Create a custom account</p>
        </button>
      </div>

      {/* New Account Input */}
      {showNewAccount && (
        <div style={styles.newAccountSection}>
          <div style={styles.newAccountInput}>
            <input
              type="text"
              placeholder="Enter account name..."
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              style={styles.input}
              autoFocus
            />
            <button 
              style={styles.addBtn}
              onClick={handleAddNewAccount}
              disabled={!newAccountName.trim()}
            >
              Add Account
            </button>
            <button 
              style={styles.cancelNewBtn}
              onClick={() => {
                setShowNewAccount(false);
                setNewAccountName('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Selected Account Summary */}
      {importData.accountTag && (
        <div style={styles.summaryBox}>
          <span style={styles.summaryIcon}>✨</span>
          <p style={styles.summaryText}>
            All <strong>{importData.transactions.length} transactions</strong> will be tagged as{' '}
            <span style={styles.summaryTag}>
              {accountOptions.find(a => a.id === importData.accountTag)?.name || importData.accountTag}
            </span>
          </p>
        </div>
      )}

      {/* Quick Tip */}
      <div style={styles.tipBox}>
        <span style={styles.tipIcon}>💡</span>
        <p style={styles.tipText}>
          <strong>Pro tip:</strong> Account tags power your filter buttons. You'll be able to filter by{' '}
          {hubType === 'home' 
            ? '"All Accounts / Personal / Side Hustle"' 
            : '"All Accounts / Operating / Payroll"'
          } across all tabs in your hub.
        </p>
      </div>

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
          Continue to Categorize →
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  infoBox: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    border: '1px solid rgba(102, 126, 234, 0.2)',
  },
  infoIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  infoText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  accountCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  accountCardSelected: {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'scale(1.02)',
  },
  addNewCard: {
    borderStyle: 'dashed',
  },
  accountIconWrapper: {
    position: 'relative',
  },
  accountIcon: {
    fontSize: '36px',
  },
  checkBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-8px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#000',
    fontWeight: 'bold',
  },
  accountName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  accountDesc: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: '1.4',
  },
  newAccountSection: {
    marginTop: '-8px',
  },
  newAccountInput: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '200px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    color: '#000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cancelNewBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '12px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  summaryBox: {
    background: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  summaryIcon: {
    fontSize: '20px',
  },
  summaryText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryTag: {
    background: 'rgba(74, 222, 128, 0.2)',
    padding: '2px 10px',
    borderRadius: '6px',
    color: '#4ade80',
    fontWeight: '600',
  },
  tipBox: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  tipIcon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  tipText: {
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(196, 77, 255, 0.3)',
  },
  nextBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};

export default Step2_AccountTag;
