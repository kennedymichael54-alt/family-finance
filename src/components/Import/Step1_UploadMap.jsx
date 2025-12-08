import React, { useState, useRef, useCallback } from 'react';
import { parseCSV, parseExcel, detectColumns } from './utils/csvParser';

const Step1_UploadMap = ({ hubType, importData, updateImportData, onNext, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState([]);
  const fileInputRef = useRef(null);

  // Mock saved templates - would come from database
  const savedTemplates = [
    { id: '1', name: 'Chase Bank CSV', bankName: 'Chase', mappings: { date: 'Transaction Date', amount: 'Amount', description: 'Description' } },
    { id: '2', name: 'Bank of America', bankName: 'BoA', mappings: { date: 'Date', amount: 'Amount', description: 'Payee' } },
  ];

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setError('');

    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      setIsProcessing(false);
      return;
    }

    try {
      let data;
      if (fileExt === '.csv') {
        data = await parseCSVFile(file);
      } else {
        data = await parseExcelFile(file);
      }

      if (data.length === 0) {
        setError('The file appears to be empty');
        setIsProcessing(false);
        return;
      }

      // Get column headers
      const columns = Object.keys(data[0]);
      setDetectedColumns(columns);
      
      // Auto-detect column mappings
      const autoMappings = autoDetectMappings(columns);
      
      // Show preview (first 5 rows)
      setPreviewData(data.slice(0, 5));

      updateImportData({
        file: file,
        fileName: file.name,
        rawData: data,
        columnMappings: autoMappings,
      });

      setIsProcessing(false);
    } catch (err) {
      setError('Error reading file: ' + err.message);
      setIsProcessing(false);
    }
  };

  const parseCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = parseCSVLine(lines[0]);
          
          const data = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const row = {};
            headers.forEach((header, index) => {
              row[header.trim()] = values[index]?.trim() || '';
            });
            return row;
          });
          
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const parseExcelFile = (file) => {
    // For now, return mock data - would use SheetJS in production
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { Date: '2024-01-15', Description: 'KROGER #1234', Amount: '-85.42', Category: '' },
          { Date: '2024-01-14', Description: 'PAYROLL DEPOSIT', Amount: '2125.00', Category: '' },
          { Date: '2024-01-13', Description: 'NETFLIX.COM', Amount: '-15.99', Category: '' },
        ]);
      }, 500);
    });
  };

  const autoDetectMappings = (columns) => {
    const mappings = { date: '', amount: '', description: '', category: '' };
    
    const datePatterns = ['date', 'transaction date', 'trans date', 'posted', 'posting date'];
    const amountPatterns = ['amount', 'debit', 'credit', 'value', 'sum'];
    const descPatterns = ['description', 'desc', 'memo', 'payee', 'merchant', 'name', 'details'];
    const catPatterns = ['category', 'cat', 'type', 'classification'];

    columns.forEach(col => {
      const colLower = col.toLowerCase();
      if (!mappings.date && datePatterns.some(p => colLower.includes(p))) {
        mappings.date = col;
      }
      if (!mappings.amount && amountPatterns.some(p => colLower.includes(p))) {
        mappings.amount = col;
      }
      if (!mappings.description && descPatterns.some(p => colLower.includes(p))) {
        mappings.description = col;
      }
      if (!mappings.category && catPatterns.some(p => colLower.includes(p))) {
        mappings.category = col;
      }
    });

    return mappings;
  };

  const handleMappingChange = (field, value) => {
    updateImportData({
      columnMappings: {
        ...importData.columnMappings,
        [field]: value
      }
    });
  };

  const handleTemplateSelect = (template) => {
    updateImportData({
      savedTemplate: template,
      columnMappings: template.mappings
    });
  };

  const canProceed = () => {
    const { columnMappings, rawData } = importData;
    return rawData.length > 0 && columnMappings.date && columnMappings.amount && columnMappings.description;
  };

  const handleNext = () => {
    if (canProceed()) {
      // Transform raw data into transactions format
      const transactions = importData.rawData.map((row, index) => ({
        id: `temp-${index}`,
        date: row[importData.columnMappings.date] || '',
        amount: parseFloat(row[importData.columnMappings.amount]?.replace(/[,$]/g, '') || 0),
        description: row[importData.columnMappings.description] || '',
        originalCategory: row[importData.columnMappings.category] || '',
        category: null,
        isRecurring: false,
        accountTag: '',
      }));
      
      updateImportData({ transactions });
      onNext();
    }
  };

  return (
    <div style={styles.container}>
      {/* Saved Templates */}
      {savedTemplates.length > 0 && !importData.file && (
        <div style={styles.templatesSection}>
          <h3 style={styles.sectionTitle}>📋 Use a Saved Template</h3>
          <div style={styles.templateGrid}>
            {savedTemplates.map(template => (
              <button
                key={template.id}
                style={styles.templateCard}
                onClick={() => handleTemplateSelect(template)}
              >
                <span style={styles.templateIcon}>🏦</span>
                <span style={styles.templateName}>{template.name}</span>
              </button>
            ))}
          </div>
          <div style={styles.divider}>
            <span style={styles.dividerText}>or upload a new file</span>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      {!importData.file && (
        <div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneActive : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            style={styles.fileInput}
          />
          
          {isProcessing ? (
            <div style={styles.processing}>
              <div style={styles.spinner}></div>
              <p style={styles.processingText}>Processing your file...</p>
            </div>
          ) : (
            <>
              <div style={styles.uploadIcon}>📤</div>
              <h3 style={styles.dropTitle}>
                {isDragging ? 'Drop your file here!' : 'Drag & drop your file here'}
              </h3>
              <p style={styles.dropSubtitle}>
                or <span style={styles.browseLink}>browse</span> to select a file
              </p>
              <p style={styles.fileTypes}>Supports CSV, XLSX, XLS</p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* File Selected - Show Mapping */}
      {importData.file && (
        <div style={styles.mappingSection}>
          {/* File Info */}
          <div style={styles.fileInfo}>
            <div style={styles.fileIcon}>📄</div>
            <div style={styles.fileDetails}>
              <span style={styles.fileName}>{importData.fileName}</span>
              <span style={styles.fileStats}>
                {importData.rawData.length} transactions found
              </span>
            </div>
            <button
              style={styles.changeFileBtn}
              onClick={() => {
                updateImportData({
                  file: null,
                  fileName: '',
                  rawData: [],
                  columnMappings: { date: '', amount: '', description: '', category: '' }
                });
                setPreviewData([]);
                setDetectedColumns([]);
              }}
            >
              Change File
            </button>
          </div>

          {/* Column Mapping */}
          <div style={styles.mappingGrid}>
            <h3 style={styles.sectionTitle}>🔗 Map Your Columns</h3>
            <p style={styles.mappingSubtitle}>
              Match your file's columns to the right data types
            </p>
            
            <div style={styles.mappingFields}>
              <div style={styles.mappingField}>
                <label style={styles.mappingLabel}>
                  <span style={styles.requiredDot}>●</span> Date Column
                </label>
                <select
                  style={styles.mappingSelect}
                  value={importData.columnMappings.date}
                  onChange={(e) => handleMappingChange('date', e.target.value)}
                >
                  <option value="">Select column...</option>
                  {detectedColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div style={styles.mappingField}>
                <label style={styles.mappingLabel}>
                  <span style={styles.requiredDot}>●</span> Amount Column
                </label>
                <select
                  style={styles.mappingSelect}
                  value={importData.columnMappings.amount}
                  onChange={(e) => handleMappingChange('amount', e.target.value)}
                >
                  <option value="">Select column...</option>
                  {detectedColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div style={styles.mappingField}>
                <label style={styles.mappingLabel}>
                  <span style={styles.requiredDot}>●</span> Description Column
                </label>
                <select
                  style={styles.mappingSelect}
                  value={importData.columnMappings.description}
                  onChange={(e) => handleMappingChange('description', e.target.value)}
                >
                  <option value="">Select column...</option>
                  {detectedColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div style={styles.mappingField}>
                <label style={styles.mappingLabel}>
                  Category Column <span style={styles.optionalTag}>Optional</span>
                </label>
                <select
                  style={styles.mappingSelect}
                  value={importData.columnMappings.category}
                  onChange={(e) => handleMappingChange('category', e.target.value)}
                >
                  <option value="">Select column...</option>
                  {detectedColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div style={styles.previewSection}>
              <h3 style={styles.sectionTitle}>👁️ Preview</h3>
              <div style={styles.previewTableContainer}>
                <table style={styles.previewTable}>
                  <thead>
                    <tr>
                      <th style={styles.previewTh}>Date</th>
                      <th style={styles.previewTh}>Description</th>
                      <th style={styles.previewTh}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td style={styles.previewTd}>
                          {importData.columnMappings.date ? row[importData.columnMappings.date] : '—'}
                        </td>
                        <td style={styles.previewTd}>
                          {importData.columnMappings.description ? row[importData.columnMappings.description] : '—'}
                        </td>
                        <td style={{
                          ...styles.previewTd,
                          color: parseFloat(row[importData.columnMappings.amount]?.replace(/[,$]/g, '') || 0) >= 0 ? '#4ade80' : '#f87171'
                        }}>
                          {importData.columnMappings.amount ? row[importData.columnMappings.amount] : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Save Template Option */}
          <div style={styles.saveTemplateSection}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={importData.saveAsTemplate}
                onChange={(e) => updateImportData({ saveAsTemplate: e.target.checked })}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Save this mapping as a template for future imports</span>
            </label>
            
            {importData.saveAsTemplate && (
              <input
                type="text"
                placeholder="Template name (e.g., Chase Checking)"
                value={importData.templateName}
                onChange={(e) => updateImportData({ templateName: e.target.value })}
                style={styles.templateInput}
              />
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={styles.navigation}>
        <button style={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button
          style={{
            ...styles.nextBtn,
            ...(canProceed() ? {} : styles.nextBtnDisabled)
          }}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          Continue to Account Tag →
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
  templatesSection: {
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '12px',
  },
  templateGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  templateCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#ffffff',
  },
  templateIcon: {
    fontSize: '20px',
  },
  templateName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  dropZone: {
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  dropZoneActive: {
    border: '2px dashed #c44dff',
    background: 'rgba(196, 77, 255, 0.1)',
  },
  fileInput: {
    display: 'none',
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  dropTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  },
  dropSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '16px',
  },
  browseLink: {
    color: '#c44dff',
    textDecoration: 'underline',
  },
  fileTypes: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  processing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#c44dff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  processingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
  },
  errorBox: {
    background: 'rgba(248, 113, 113, 0.1)',
    border: '1px solid rgba(248, 113, 113, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#f87171',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  mappingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  fileInfo: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  fileIcon: {
    fontSize: '32px',
  },
  fileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  fileStats: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  changeFileBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mappingGrid: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  mappingSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '20px',
  },
  mappingFields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  mappingField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mappingLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  requiredDot: {
    color: '#ff6b9d',
    fontSize: '8px',
  },
  optionalTag: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '400',
  },
  mappingSelect: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  previewSection: {
    marginTop: '8px',
  },
  previewTableContainer: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  previewTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  previewTh: {
    textAlign: 'left',
    padding: '12px 16px',
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  previewTd: {
    padding: '12px 16px',
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  saveTemplateSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
  templateInput: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '8px',
  },
  cancelBtn: {
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

export default Step1_UploadMap;
