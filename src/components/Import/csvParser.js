/**
 * CSV Parser Utility
 * Handles parsing CSV and Excel files for import
 */

/**
 * Parse CSV file content
 * @param {File} file - File object
 * @returns {Promise<Array>} Array of row objects
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          resolve([]);
          return;
        }
        
        const headers = parseCSVLine(lines[0]);
        
        const data = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const row = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          return row;
        }).filter(row => Object.values(row).some(v => v)); // Filter empty rows
        
        resolve(data);
      } catch (err) {
        reject(new Error('Failed to parse CSV: ' + err.message));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array<string>} Array of values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
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

/**
 * Parse Excel file (simplified - in production use SheetJS)
 * @param {File} file - File object
 * @returns {Promise<Array>} Array of row objects
 */
export const parseExcel = async (file) => {
  // In production, this would use SheetJS (xlsx library)
  // For now, return a promise that simulates Excel parsing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data for demo purposes
      resolve([
        { Date: '2024-12-01', Description: 'Sample Transaction', Amount: '-50.00' },
      ]);
    }, 500);
  });
};

/**
 * Auto-detect column mappings based on header names
 * @param {Array<string>} columns - Column headers
 * @returns {Object} Mapping object { date, amount, description, category }
 */
export const detectColumns = (columns) => {
  const mappings = { date: '', amount: '', description: '', category: '' };
  
  const patterns = {
    date: ['date', 'transaction date', 'trans date', 'posted', 'posting date', 'trans_date', 'txn_date'],
    amount: ['amount', 'debit', 'credit', 'value', 'sum', 'total', 'amt'],
    description: ['description', 'desc', 'memo', 'payee', 'merchant', 'name', 'details', 'narrative'],
    category: ['category', 'cat', 'type', 'classification', 'tag'],
  };
  
  columns.forEach(col => {
    const colLower = col.toLowerCase().trim();
    
    for (const [field, fieldPatterns] of Object.entries(patterns)) {
      if (!mappings[field]) {
        for (const pattern of fieldPatterns) {
          if (colLower.includes(pattern) || colLower === pattern) {
            mappings[field] = col;
            break;
          }
        }
      }
    }
  });
  
  return mappings;
};

/**
 * Validate file type
 * @param {File} file - File object
 * @returns {Object} { valid: boolean, type: string, error: string }
 */
export const validateFile = (file) => {
  const validTypes = {
    'text/csv': 'csv',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  };
  
  // Check by MIME type
  if (validTypes[file.type]) {
    return { valid: true, type: validTypes[file.type], error: null };
  }
  
  // Fallback to extension check
  const ext = file.name.split('.').pop().toLowerCase();
  if (['csv', 'xlsx', 'xls'].includes(ext)) {
    return { valid: true, type: ext, error: null };
  }
  
  return { 
    valid: false, 
    type: null, 
    error: 'Please upload a CSV or Excel file (.csv, .xlsx, .xls)' 
  };
};

export default {
  parseCSV,
  parseExcel,
  detectColumns,
  validateFile,
};
