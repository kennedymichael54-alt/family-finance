import React, { useState } from 'react';

/**
 * DataUploadSystem - REDESIGNED for clean, modern look
 * 
 * Simple CSV import with drag-and-drop
 */

const DataUploadSystem = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [stats, setStats] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    
    // Simulate import
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockStats = {
      total: 47,
      income: 12,
      expenses: 35,
      categories: 8
    };
    
    setStats(mockStats);
    setImporting(false);
    setImported(true);
    
    if (onImportComplete) {
      onImportComplete([/* transactions */]);
    }
  };

  const reset = () => {
    setFile(null);
    setImported(false);
    setStats(null);
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
          📂 Import Transactions
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          Upload CSV files from your bank or financial apps
        </p>
      </div>

      {!imported ? (
        <div style={{
          background: 'rgba(30, 27, 56, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive 
                ? '2px dashed rgba(139, 92, 246, 0.6)' 
                : '2px dashed rgba(255,255,255,0.2)',
              borderRadius: '16px',
              padding: '60px 40px',
              background: dragActive 
                ? 'rgba(139, 92, 246, 0.1)' 
                : 'rgba(255,255,255,0.03)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {!file ? (
              <>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {dragActive ? '🎯' : '📁'}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  {dragActive ? 'Drop your file here' : 'Drag & drop your CSV file'}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                  or click to browse
                </p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-block'
                }}>
                  Choose File
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  {file.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImport();
                    }}
                    disabled={importing}
                    style={{
                      padding: '12px 32px',
                      background: importing 
                        ? 'rgba(139, 92, 246, 0.3)'
                        : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: importing ? 'not-allowed' : 'pointer',
                      opacity: importing ? 0.6 : 1
                    }}
                  >
                    {importing ? 'Importing...' : 'Import Transactions'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    disabled={importing}
                    style={{
                      padding: '12px 32px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: importing ? 'not-allowed' : 'pointer',
                      opacity: importing ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Format Help */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
              📝 CSV Format Requirements
            </h4>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Your CSV should include these columns:<br />
              <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                Date, Description, Amount, Category, Type
              </code>
            </p>
          </div>
        </div>
      ) : (
        // Success State
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', marginBottom: '12px' }}>
            Import Successful!
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
            Your transactions have been imported
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                {stats?.total || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Total
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
                {stats?.income || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Income
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>
                {stats?.expenses || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Expenses
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6', marginBottom: '4px' }}>
                {stats?.categories || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Categories
              </div>
            </div>
          </div>

          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
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

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DataUploadSystem;
