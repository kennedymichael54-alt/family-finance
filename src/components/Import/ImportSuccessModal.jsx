import React from 'react';

const ImportSuccessModal = ({ hubType, importData, onClose }) => {
  const summary = importData.importSummary || {};
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handleNavigate = (destination) => {
    onClose(destination);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Celebration Header */}
        <div style={styles.header}>
          <div style={styles.celebrationEmojis}>🎉</div>
          <h2 style={styles.title}>Import Complete!</h2>
          <p style={styles.subtitle}>
            Your data is now powering your {hubType === 'home' ? 'HomeBudget' : 'BizBudget'} Hub
          </p>
        </div>

        {/* Summary Stats */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>📊</span>
            <span style={styles.summaryValue}>{summary.transactionsImported || 0}</span>
            <span style={styles.summaryLabel}>Transactions Imported</span>
          </div>
          
          {summary.billsCreated > 0 && (
            <div style={styles.summaryCard}>
              <span style={styles.summaryIcon}>🔁</span>
              <span style={styles.summaryValue}>{summary.billsCreated}</span>
              <span style={styles.summaryLabel}>Bills Created</span>
            </div>
          )}
          
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>💰</span>
            <span style={{...styles.summaryValue, color: '#4ade80'}}>
              {formatCurrency(summary.income)}
            </span>
            <span style={styles.summaryLabel}>Income</span>
          </div>
          
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>💸</span>
            <span style={{...styles.summaryValue, color: '#f87171'}}>
              {formatCurrency(summary.expenses)}
            </span>
            <span style={styles.summaryLabel}>Expenses</span>
          </div>
        </div>

        {/* What Changed Section */}
        <div style={styles.changesSection}>
          <h3 style={styles.changesTitle}>🚀 What's New</h3>
          <div style={styles.changesList}>
            <div style={styles.changeItem}>
              <span style={styles.changeIcon}>✅</span>
              <span style={styles.changeText}>
                Dashboard metrics updated with your latest data
              </span>
            </div>
            <div style={styles.changeItem}>
              <span style={styles.changeIcon}>✅</span>
              <span style={styles.changeText}>
                Transactions tab now shows all imported entries
              </span>
            </div>
            {summary.billsCreated > 0 && (
              <div style={styles.changeItem}>
                <span style={styles.changeIcon}>✅</span>
                <span style={styles.changeText}>
                  Bills tab updated with {summary.billsCreated} recurring bills
                </span>
              </div>
            )}
            <div style={styles.changeItem}>
              <span style={styles.changeIcon}>✅</span>
              <span style={styles.changeText}>
                Budget tracking now reflects your spending
              </span>
            </div>
          </div>
        </div>

        {/* Penny Tip */}
        <div style={styles.pennyTip}>
          <span style={styles.pennyIcon}>🪙</span>
          <p style={styles.pennyText}>
            <strong>Penny says:</strong> Your data is now synced! Check your Dashboard 
            for updated insights, or review transactions to fine-tune categories.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div style={styles.buttonGrid}>
          <button 
            style={styles.primaryBtn}
            onClick={() => handleNavigate('dashboard')}
          >
            📊 View Dashboard
          </button>
          <button 
            style={styles.secondaryBtn}
            onClick={() => handleNavigate('transactions')}
          >
            📋 View Transactions
          </button>
          {summary.billsCreated > 0 && (
            <button 
              style={styles.secondaryBtn}
              onClick={() => handleNavigate('bills')}
            >
              🔁 View Bills
            </button>
          )}
          <button 
            style={styles.tertiaryBtn}
            onClick={() => handleNavigate('import')}
          >
            ➕ Import More Data
          </button>
        </div>

        {/* Close hint */}
        <p style={styles.closeHint}>
          Press anywhere outside or choose a destination above
        </p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    padding: '32px 32px 24px',
    background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  celebrationEmojis: {
    fontSize: '56px',
    marginBottom: '16px',
    animation: 'bounce 1s ease infinite',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '24px',
  },
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    textAlign: 'center',
  },
  summaryIcon: {
    fontSize: '24px',
  },
  summaryValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  changesSection: {
    padding: '0 24px 24px',
  },
  changesTitle: {
    margin: '0 0 14px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  changesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  changeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    background: 'rgba(74, 222, 128, 0.1)',
    borderRadius: '10px',
  },
  changeIcon: {
    fontSize: '16px',
  },
  changeText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pennyTip: {
    margin: '0 24px 24px',
    padding: '14px 18px',
    background: 'rgba(255, 107, 157, 0.1)',
    border: '1px solid rgba(255, 107, 157, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  pennyIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  pennyText: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.5',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '0 24px 24px',
  },
  primaryBtn: {
    gridColumn: 'span 2',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c44dff 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(196, 77, 255, 0.3)',
  },
  secondaryBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '14px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tertiaryBtn: {
    gridColumn: 'span 2',
    background: 'transparent',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '12px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  closeHint: {
    textAlign: 'center',
    margin: 0,
    padding: '16px 24px 24px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
  },
};

export default ImportSuccessModal;
