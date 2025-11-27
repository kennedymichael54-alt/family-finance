import React, { useState } from 'react';

// ============================================================================
// DATA UPLOAD SYSTEM - FINAL VERSION WITH STYLED BANK IMPORT
// ============================================================================

export default function DataUploadSystem({ onImportComplete }) {
  const [importMethod, setImportMethod] = useState('manual'); // 'manual' or 'bank'
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // CSV Template data
  const csvTemplate = `Date,Description,Amount,Category,Type
2024-11-26,Grocery Store,-127.43,Food,expense
2024-11-25,Salary Deposit,4250.00,Income,income
2024-11-24,Netflix,-15.99,Entertainment,expense
2024-11-23,Gas Station,-45.20,Transport,expense`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-finance-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setImported(false);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const processImport = () => {
    if (!file) return;
    
    setImporting(true);
    
    // Simulate processing
    setTimeout(() => {
      // Parse CSV and create sample transactions
      const sampleTransactions = [
        { id: 1, date: '2024-11-26', description: 'Grocery Store', amount: -127.43, category: 'Food', type: 'expense' },
        { id: 2, date: '2024-11-25', description: 'Salary Deposit', amount: 4250.00, category: 'Income', type: 'income' },
        { id: 3, date: '2024-11-24', description: 'Netflix', amount: -15.99, category: 'Entertainment', type: 'expense' },
        { id: 4, date: '2024-11-23', description: 'Gas Station', amount: -45.20, category: 'Transport', type: 'expense' },
        { id: 5, date: '2024-11-22', description: 'Coffee Shop', amount: -6.50, category: 'Food', type: 'expense' },
        { id: 6, date: '2024-11-21', description: 'Amazon', amount: -89.99, category: 'Shopping', type: 'expense' },
        { id: 7, date: '2024-11-20', description: 'Uber', amount: -24.00, category: 'Transport', type: 'expense' },
        { id: 8, date: '2024-11-19', description: 'Restaurant', amount: -67.80, category: 'Food', type: 'expense' },
      ];
      
      setTransactions(sampleTransactions);
      setImporting(false);
      setImported(true);
      
      if (onImportComplete) {
        onImportComplete(sampleTransactions);
      }
    }, 2000);
  };

  const resetImport = () => {
    setFile(null);
    setImported(false);
    setTransactions([]);
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Food': '🍔',
      'Income': '💰',
      'Entertainment': '🎬',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Health': '🏥',
      'Utilities': '💡',
      'Housing': '🏠'
    };
    return emojiMap[category] || '📦';
  };

  // Bank data with emojis/icons
  const banks = [
    { name: 'Chase', emoji: '🏦', color: 'rgba(0, 117, 201, 0.2)' },
    { name: 'Bank of America', emoji: '🇺🇸', color: 'rgba(227, 24, 55, 0.2)' },
    { name: 'Wells Fargo', emoji: '🐴', color: 'rgba(213, 43, 30, 0.2)' },
    { name: 'Citi', emoji: '🏛️', color: 'rgba(0, 45, 114, 0.2)' },
    { name: 'Capital One', emoji: '💳', color: 'rgba(200, 16, 46, 0.2)' },
    { name: 'Amex', emoji: '💎', color: 'rgba(0, 119, 200, 0.2)' }
  ];

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'white' }}>
        📂 Import Transactions
      </h2>

      {/* Two-Column Layout: Selector on Left, Content on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        
        {/* Left: Import Method Selector (Vertical Stack) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setImportMethod('manual')}
            style={{
              padding: '16px 20px',
              background: importMethod === 'manual' 
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                : 'rgba(30, 27, 56, 0.8)',
              border: importMethod === 'manual'
                ? '2px solid rgba(139, 92, 246, 0.6)'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: importMethod === 'manual' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(20px)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              if (importMethod !== 'manual') {
                e.currentTarget.style.background = 'rgba(30, 27, 56, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (importMethod !== 'manual') {
                e.currentTarget.style.background = 'rgba(30, 27, 56, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
            <div>Manual Import</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Upload CSV</div>
          </button>

          <button
            onClick={() => setImportMethod('bank')}
            style={{
              padding: '16px 20px',
              background: importMethod === 'bank' 
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                : 'rgba(30, 27, 56, 0.8)',
              border: importMethod === 'bank'
                ? '2px solid rgba(139, 92, 246, 0.6)'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: importMethod === 'bank' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(20px)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              if (importMethod !== 'bank') {
                e.currentTarget.style.background = 'rgba(30, 27, 56, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (importMethod !== 'bank') {
                e.currentTarget.style.background = 'rgba(30, 27, 56, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏦</div>
            <div>Bank Import</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Via Plaid</div>
          </button>
        </div>

        {/* Right: Content Area */}
        <div>
          {/* Manual Import View */}
          {importMethod === 'manual' && (
            <>
              {/* Upload Card with Purple Outline */}
              <div style={{ 
                background: 'rgba(30, 27, 56, 0.8)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: '2px solid rgba(139, 92, 246, 0.6)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
                marginBottom: '24px',
                position: 'relative'
              }}>
                
                {!imported ? (
                  <>
                    {/* Template Download Section */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px', color: 'white' }}>
                          📋 Need a template?
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                          Download our CSV template to get started
                        </div>
                      </div>
                      <button
                        onClick={downloadTemplate}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                          border: 'none',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'transform 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        ⬇️ Download
                      </button>
                    </div>

                    {/* Drag & Drop Area - Compact */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      style={{
                        border: dragActive 
                          ? '2px solid rgba(139, 92, 246, 0.8)' 
                          : '2px dashed rgba(139, 92, 246, 0.4)',
                        borderRadius: '16px',
                        padding: '40px 32px',
                        textAlign: 'center',
                        background: dragActive 
                          ? 'rgba(139, 92, 246, 0.15)' 
                          : 'rgba(139, 92, 246, 0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        marginBottom: '20px'
                      }}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        {file ? '✅' : '📁'}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                        {file ? file.name : 'Drag & drop your CSV file'}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                      </div>
                      
                      {!file && (
                        <button
                          style={{
                            padding: '10px 24px',
                            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Choose File
                        </button>
                      )}
                      
                      <input
                        id="fileInput"
                        type="file"
                        accept=".csv"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {/* Format Help */}
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '20px',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                        📝 CSV Format Requirements:
                      </div>
                      <code style={{ 
                        display: 'block', 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '12px', 
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.8)'
                      }}>
                        Date, Description, Amount, Category, Type
                      </code>
                    </div>

                    {/* Action Buttons */}
                    {file && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={resetImport}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={processImport}
                          disabled={importing}
                          style={{
                            flex: 2,
                            padding: '14px',
                            background: importing 
                              ? 'rgba(139, 92, 246, 0.5)' 
                              : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: importing ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {importing ? '⏳ Processing...' : '✨ Import Transactions'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Success State */
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                    <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'white' }}>
                      Import Successful!
                    </div>
                    
                    {/* Stats Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: '16px', 
                      margin: '24px 0'
                    }}>
                      <div style={{ 
                        background: 'rgba(139, 92, 246, 0.2)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                          {transactions.length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          Total
                        </div>
                      </div>
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.2)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                          {transactions.filter(t => t.amount > 0).length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          Income
                        </div>
                      </div>
                      <div style={{ 
                        background: 'rgba(239, 68, 68, 0.2)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                          {transactions.filter(t => t.amount < 0).length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          Expenses
                        </div>
                      </div>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                          {[...new Set(transactions.map(t => t.category))].length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          Categories
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={resetImport}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Import Another File
                    </button>
                  </div>
                )}
              </div>

              {/* Transactions Table */}
              {transactions.length > 0 && (
                <div style={{
                  background: 'rgba(30, 27, 56, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '2px solid rgba(139, 92, 246, 0.6)',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                      📊 Imported Transactions ({transactions.length})
                    </h3>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      Total: ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'separate',
                      borderSpacing: '0 8px'
                    }}>
                      <thead>
                        <tr style={{ 
                          borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Date</th>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Description</th>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Category</th>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} style={{
                            background: 'rgba(139, 92, 246, 0.05)',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                          >
                            <td style={{ 
                              padding: '16px', 
                              borderTopLeftRadius: '12px',
                              borderBottomLeftRadius: '12px',
                              fontSize: '14px',
                              color: 'rgba(255,255,255,0.7)'
                            }}>
                              {transaction.date}
                            </td>
                            <td style={{ 
                              padding: '16px',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: 'white'
                            }}>
                              {transaction.description}
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: 'rgba(139, 92, 246, 0.2)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                color: 'white'
                              }}>
                                <span>{getCategoryEmoji(transaction.category)}</span>
                                {transaction.category}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '16px', 
                              textAlign: 'right',
                              borderTopRightRadius: '12px',
                              borderBottomRightRadius: '12px',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: transaction.amount >= 0 ? '#10B981' : 'white'
                            }}>
                              {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bank Import View (Coming Soon) - IMPROVED */}
          {importMethod === 'bank' && (
            <div style={{
              background: 'rgba(30, 27, 56, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '60px 40px',
              border: '2px solid rgba(139, 92, 246, 0.6)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                borderRadius: '24px'
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Coming Soon Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '6px 20px',
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '14px' }}>✨</span>
                  Coming Soon
                </div>

                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏦</div>
                <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px', color: 'white' }}>
                  Bank Import
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: 'rgba(255,255,255,0.7)', 
                  maxWidth: '500px',
                  margin: '0 auto 32px',
                  lineHeight: '1.6'
                }}>
                  We're working on secure bank integrations via Plaid to automatically sync your transactions. Stay tuned!
                </p>
                
                {/* Supported Banks */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>🎯</span>
                    Supported Banks (Soon)
                  </div>
                  
                  {/* Styled Bank Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    {banks.map((bank) => (
                      <button
                        key={bank.name}
                        style={{
                          padding: '16px 20px',
                          background: 'rgba(30, 27, 56, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '2px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'not-allowed',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          opacity: 0.7
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                          e.currentTarget.style.background = 'rgba(30, 27, 56, 1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                          e.currentTarget.style.background = 'rgba(30, 27, 56, 0.9)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.opacity = '0.7';
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{bank.emoji}</span>
                        <span>{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  marginTop: '32px',
                  padding: '16px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: '500px',
                  margin: '32px auto 0'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: 'white' }}>
                    🔒 Bank-Level Security
                  </div>
                  256-bit encryption · OAuth 2.0 · Read-only access
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
