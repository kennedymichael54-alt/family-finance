import React, { useState } from 'react';

const DataUploadSystem = ({ onImportComplete }) => {
  const [uploadStep, setUploadStep] = useState('upload'); // 'upload', 'mapping', 'preview', 'complete'
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
    type: '',
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 });

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      row.id = index;
      return row;
    });

    return { headers, data };
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      
      if (file.name.endsWith('.csv')) {
        const { headers, data } = parseCSV(text);
        setFileData({ headers, data, type: 'csv' });
        setParsedData(data);
        setSelectedRows(data.map(row => row.id)); // Select all by default
        setUploadStep('mapping');
      } else if (file.name.endsWith('.pdf')) {
        // For PDF, you would use a library like pdf.js or pdf-parse
        alert('PDF parsing requires additional libraries. This is a placeholder for demonstration.');
        // Simulated PDF data
        const simulatedData = [
          { Date: '2024-01-15', Description: 'Grocery Store', Amount: '-125.50', Category: '', Type: '' },
          { Date: '2024-01-20', Description: 'Salary Deposit', Amount: '3500.00', Category: '', Type: '' },
        ];
        setFileData({ 
          headers: ['Date', 'Description', 'Amount', 'Category', 'Type'],
          data: simulatedData.map((row, index) => ({ ...row, id: index })),
          type: 'pdf' 
        });
        setParsedData(simulatedData.map((row, index) => ({ ...row, id: index })));
        setSelectedRows(simulatedData.map((_, index) => index));
        setUploadStep('mapping');
      }
    };

    reader.readAsText(file);
  };

  // Handle column mapping
  const handleMapping = (field, column) => {
    setColumnMapping({ ...columnMapping, [field]: column });
  };

  // Auto-detect column mappings
  const autoMapColumns = () => {
    if (!fileData) return;

    const { headers } = fileData;
    const newMapping = { ...columnMapping };

    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      
      if (lowerHeader.includes('date')) newMapping.date = header;
      if (lowerHeader.includes('description') || lowerHeader.includes('merchant') || lowerHeader.includes('name')) {
        newMapping.description = header;
      }
      if (lowerHeader.includes('amount') || lowerHeader.includes('value') || lowerHeader.includes('price')) {
        newMapping.amount = header;
      }
      if (lowerHeader.includes('category') || lowerHeader.includes('type') && !lowerHeader.includes('transaction')) {
        newMapping.category = header;
      }
      if (lowerHeader.includes('transaction') && lowerHeader.includes('type')) {
        newMapping.type = header;
      }
    });

    setColumnMapping(newMapping);
  };

  // Preview mapped data
  const previewData = () => {
    if (!columnMapping.date || !columnMapping.description || !columnMapping.amount) {
      alert('Please map at least Date, Description, and Amount fields');
      return;
    }

    setUploadStep('preview');
  };

  // Transform data based on mapping
  const getTransformedData = () => {
    return parsedData
      .filter(row => selectedRows.includes(row.id))
      .map(row => {
        let amount = parseFloat(row[columnMapping.amount]?.replace(/[^0-9.-]/g, '') || 0);
        
        // Determine transaction type
        let type = 'expense';
        if (columnMapping.type && row[columnMapping.type]) {
          const typeValue = row[columnMapping.type].toLowerCase();
          type = typeValue.includes('income') || typeValue.includes('credit') || typeValue.includes('deposit') 
            ? 'income' 
            : 'expense';
        } else if (amount > 0) {
          type = 'income';
        } else {
          type = 'expense';
          amount = Math.abs(amount);
        }

        return {
          date: row[columnMapping.date] || new Date().toISOString().split('T')[0],
          description: row[columnMapping.description] || 'Unknown',
          amount: amount,
          category: row[columnMapping.category] || 'Uncategorized',
          type: type,
          imported: true,
        };
      });
  };

  // Toggle row selection
  const toggleRowSelection = (rowId) => {
    setSelectedRows(prev =>
      prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Select/Deselect all rows
  const toggleAllRows = () => {
    if (selectedRows.length === parsedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(parsedData.map(row => row.id));
    }
  };

  // Import data
  const importData = () => {
    const transformedData = getTransformedData();
    
    // Simulate import with success/failure
    const successful = transformedData.length;
    const failed = 0;

    setImportStats({ success: successful, failed });
    setUploadStep('complete');

    // Call the callback to pass data to parent component
    if (onImportComplete) {
      onImportComplete(transformedData);
    }
  };

  // Reset upload
  const resetUpload = () => {
    setUploadStep('upload');
    setFileData(null);
    setFileName('');
    setParsedData([]);
    setColumnMapping({ date: '', description: '', amount: '', category: '', type: '' });
    setSelectedRows([]);
    setImportStats({ success: 0, failed: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Import Transactions</h1>
        <p className="text-gray-600">Upload CSV or PDF files to import your transaction history</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Upload', 'Map Fields', 'Preview', 'Complete'].map((step, index) => {
            const stepMap = { 0: 'upload', 1: 'mapping', 2: 'preview', 3: 'complete' };
            const currentStepIndex = Object.values(stepMap).indexOf(uploadStep);
            const isActive = currentStepIndex === index;
            const isCompleted = currentStepIndex > index;

            return (
              <div key={step} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCompleted ? 'bg-green-600 text-white' :
                    isActive ? 'bg-blue-600 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Upload */}
      {uploadStep === 'upload' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your File</h2>
            <p className="text-gray-600 mb-6">
              Supported formats: CSV, PDF
            </p>

            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".csv,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                Choose File
              </div>
            </label>

            <div className="mt-8 bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">Tips for best results:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Ensure your CSV has headers for each column</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Date format should be consistent (YYYY-MM-DD recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Amount should be numeric (negative for expenses, positive for income)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>PDF files should contain structured transaction tables</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Column Mapping */}
      {uploadStep === 'mapping' && fileData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Map Your Columns</h2>
              <p className="text-gray-600 mt-1">Match your file columns to transaction fields</p>
            </div>
            <button
              onClick={autoMapColumns}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Auto-Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date Mapping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date * <span className="text-red-500">(Required)</span>
              </label>
              <select
                value={columnMapping.date}
                onChange={(e) => handleMapping('date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {fileData.headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>

            {/* Description Mapping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description * <span className="text-red-500">(Required)</span>
              </label>
              <select
                value={columnMapping.description}
                onChange={(e) => handleMapping('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {fileData.headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>

            {/* Amount Mapping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount * <span className="text-red-500">(Required)</span>
              </label>
              <select
                value={columnMapping.amount}
                onChange={(e) => handleMapping('amount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {fileData.headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>

            {/* Category Mapping (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                value={columnMapping.category}
                onChange={(e) => handleMapping('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {fileData.headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>

            {/* Type Mapping (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                value={columnMapping.type}
                onChange={(e) => handleMapping('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column...</option>
                {fileData.headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                If not specified, we'll determine type based on amount (negative = expense)
              </p>
            </div>
          </div>

          {/* Sample Data Preview */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Sample Data Preview</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {fileData.headers.map(header => (
                      <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 3).map((row, index) => (
                    <tr key={index} className="border-t">
                      {fileData.headers.map(header => (
                        <td key={header} className="px-4 py-2 text-sm text-gray-600">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing first 3 rows of {parsedData.length} total records
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetUpload}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={previewData}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Continue to Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {uploadStep === 'preview' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Review Transactions</h2>
            <p className="text-gray-600 mt-1">
              {selectedRows.length} of {parsedData.length} transactions selected for import
            </p>
          </div>

          {/* Select All Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedRows.length === parsedData.length}
              onChange={toggleAllRows}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Select All
            </label>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6 max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Select</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Category</th>
                </tr>
              </thead>
              <tbody>
                {getTransformedData().map((transaction, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(parsedData[index].id)}
                        onChange={() => toggleRowSelection(parsedData[index].id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{transaction.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{transaction.description}</td>
                    <td className={`px-4 py-2 text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{transaction.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setUploadStep('mapping')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={importData}
              disabled={selectedRows.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {selectedRows.length} Transactions
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {uploadStep === 'complete' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Import Complete!</h2>
          <p className="text-gray-600 mb-8">
            Your transactions have been successfully imported
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-green-600 mb-1">{importStats.success}</p>
              <p className="text-sm text-gray-600">Imported</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-red-600 mb-1">{importStats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={resetUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Import More Files
            </button>
            <button
              onClick={() => window.location.href = '/budget'}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              View Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploadSystem;
