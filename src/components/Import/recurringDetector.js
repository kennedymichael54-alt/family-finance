/**
 * Recurring Transaction Detector
 * Identifies recurring payments from transaction history
 */

// Known recurring merchant patterns
const recurringMerchants = [
  // Subscriptions
  { pattern: /NETFLIX/i, name: 'Netflix', type: 'subscription', typical: 15.99 },
  { pattern: /SPOTIFY/i, name: 'Spotify', type: 'subscription', typical: 10.99 },
  { pattern: /HULU/i, name: 'Hulu', type: 'subscription', typical: 17.99 },
  { pattern: /DISNEY\+|DISNEY PLUS/i, name: 'Disney+', type: 'subscription', typical: 13.99 },
  { pattern: /HBO|MAX/i, name: 'Max (HBO)', type: 'subscription', typical: 15.99 },
  { pattern: /AMAZON PRIME/i, name: 'Amazon Prime', type: 'subscription', typical: 14.99 },
  { pattern: /APPLE\.COM\/BILL|APPLE MUSIC/i, name: 'Apple Services', type: 'subscription', typical: 10.99 },
  { pattern: /YOUTUBE PREMIUM/i, name: 'YouTube Premium', type: 'subscription', typical: 13.99 },
  { pattern: /PARAMOUNT\+/i, name: 'Paramount+', type: 'subscription', typical: 11.99 },
  { pattern: /PEACOCK/i, name: 'Peacock', type: 'subscription', typical: 5.99 },
  { pattern: /ADOBE/i, name: 'Adobe', type: 'subscription', typical: 54.99 },
  { pattern: /MICROSOFT 365|OFFICE 365/i, name: 'Microsoft 365', type: 'subscription', typical: 9.99 },
  
  // Utilities
  { pattern: /AT&T|ATT MOBILITY/i, name: 'AT&T', type: 'utility', typical: null },
  { pattern: /VERIZON/i, name: 'Verizon', type: 'utility', typical: null },
  { pattern: /T-MOBILE|TMOBILE/i, name: 'T-Mobile', type: 'utility', typical: null },
  { pattern: /COMCAST|XFINITY/i, name: 'Xfinity', type: 'utility', typical: null },
  { pattern: /SPECTRUM/i, name: 'Spectrum', type: 'utility', typical: null },
  { pattern: /DUKE ENERGY/i, name: 'Duke Energy', type: 'utility', typical: null },
  { pattern: /GEORGIA POWER/i, name: 'Georgia Power', type: 'utility', typical: null },
  { pattern: /FPL|FLORIDA POWER/i, name: 'FPL', type: 'utility', typical: null },
  
  // Insurance
  { pattern: /STATE FARM/i, name: 'State Farm', type: 'insurance', typical: null },
  { pattern: /GEICO/i, name: 'Geico', type: 'insurance', typical: null },
  { pattern: /PROGRESSIVE/i, name: 'Progressive', type: 'insurance', typical: null },
  { pattern: /ALLSTATE/i, name: 'Allstate', type: 'insurance', typical: null },
  { pattern: /LIBERTY MUTUAL/i, name: 'Liberty Mutual', type: 'insurance', typical: null },
  
  // Fitness
  { pattern: /PLANET FITNESS/i, name: 'Planet Fitness', type: 'subscription', typical: 24.99 },
  { pattern: /LA FITNESS/i, name: 'LA Fitness', type: 'subscription', typical: 34.99 },
  { pattern: /ORANGETHEORY/i, name: 'Orangetheory', type: 'subscription', typical: 169 },
  { pattern: /PELOTON/i, name: 'Peloton', type: 'subscription', typical: 44 },
  
  // Software (Business)
  { pattern: /QUICKBOOKS/i, name: 'QuickBooks', type: 'software', typical: 30 },
  { pattern: /SLACK/i, name: 'Slack', type: 'software', typical: 8.75 },
  { pattern: /ZOOM/i, name: 'Zoom', type: 'software', typical: 15.99 },
  { pattern: /DROPBOX/i, name: 'Dropbox', type: 'software', typical: 11.99 },
  { pattern: /GOOGLE WORKSPACE/i, name: 'Google Workspace', type: 'software', typical: 12 },
  
  // Housing
  { pattern: /RENT PAYMENT/i, name: 'Rent', type: 'housing', typical: null },
  { pattern: /MORTGAGE/i, name: 'Mortgage', type: 'housing', typical: null },
  { pattern: /HOA/i, name: 'HOA Fees', type: 'housing', typical: null },
];

/**
 * Detect recurring transactions from a list
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of detected recurring transactions
 */
export const detectRecurring = (transactions) => {
  const detected = [];
  const processedMerchants = new Set();
  
  transactions.forEach(transaction => {
    for (const merchant of recurringMerchants) {
      if (merchant.pattern.test(transaction.description) && !processedMerchants.has(merchant.name)) {
        processedMerchants.add(merchant.name);
        
        // Find all matching transactions
        const matches = transactions.filter(t => merchant.pattern.test(t.description));
        
        if (matches.length > 0) {
          const avgAmount = matches.reduce((sum, t) => sum + Math.abs(t.amount), 0) / matches.length;
          const frequency = detectFrequency(matches);
          const dueDay = extractDueDay(matches);
          
          detected.push({
            id: `recurring-${detected.length}`,
            merchantName: merchant.name,
            originalDescription: transaction.description,
            type: merchant.type,
            averageAmount: avgAmount,
            typicalAmount: merchant.typical,
            frequency: frequency,
            occurrences: matches.length,
            lastDate: matches[matches.length - 1]?.date || transaction.date,
            estimatedDueDay: dueDay,
            confidence: calculateConfidence(matches, merchant),
          });
        }
      }
    }
  });
  
  // Also detect by amount patterns (for unknown merchants)
  const unknownRecurring = detectByAmountPattern(transactions, processedMerchants);
  detected.push(...unknownRecurring);
  
  return detected.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Detect frequency based on transaction dates
 * @param {Array} transactions - Matching transactions
 * @returns {string} Frequency type
 */
const detectFrequency = (transactions) => {
  if (transactions.length < 2) return 'monthly';
  
  // Sort by date
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate average days between transactions
  let totalDays = 0;
  for (let i = 1; i < sorted.length; i++) {
    const days = (new Date(sorted[i].date) - new Date(sorted[i-1].date)) / (1000 * 60 * 60 * 24);
    totalDays += days;
  }
  const avgDays = totalDays / (sorted.length - 1);
  
  // Determine frequency
  if (avgDays <= 8) return 'weekly';
  if (avgDays <= 16) return 'biweekly';
  if (avgDays <= 35) return 'monthly';
  if (avgDays <= 100) return 'quarterly';
  return 'yearly';
};

/**
 * Extract the most common due day from transactions
 * @param {Array} transactions - Matching transactions
 * @returns {number} Day of month (1-31)
 */
const extractDueDay = (transactions) => {
  if (transactions.length === 0) return 15;
  
  const dayCounts = {};
  transactions.forEach(t => {
    const day = new Date(t.date).getDate();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  // Find most common day
  let maxCount = 0;
  let mostCommonDay = 15;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonDay = parseInt(day);
    }
  }
  
  return mostCommonDay;
};

/**
 * Calculate confidence score for recurring detection
 * @param {Array} matches - Matching transactions
 * @param {Object} merchant - Merchant pattern object
 * @returns {number} Confidence score 0-100
 */
const calculateConfidence = (matches, merchant) => {
  let confidence = 50; // Base confidence
  
  // More occurrences = higher confidence
  confidence += Math.min(matches.length * 10, 30);
  
  // Known merchant pattern = higher confidence
  if (merchant.typical) {
    const avgAmount = matches.reduce((sum, t) => sum + Math.abs(t.amount), 0) / matches.length;
    const variance = Math.abs(avgAmount - merchant.typical) / merchant.typical;
    if (variance < 0.1) confidence += 15;
    else if (variance < 0.25) confidence += 10;
  }
  
  // Consistent amounts = higher confidence
  const amounts = matches.map(t => Math.abs(t.amount));
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const amountVariance = amounts.reduce((sum, amt) => sum + Math.abs(amt - avgAmount), 0) / amounts.length;
  if (amountVariance / avgAmount < 0.05) confidence += 10;
  
  return Math.min(confidence, 100);
};

/**
 * Detect recurring by amount patterns for unknown merchants
 * @param {Array} transactions - All transactions
 * @param {Set} processedMerchants - Already processed merchant names
 * @returns {Array} Additional recurring transactions
 */
const detectByAmountPattern = (transactions, processedMerchants) => {
  const detected = [];
  
  // Group by similar amounts (within 5%)
  const amountGroups = {};
  transactions.forEach(t => {
    if (t.amount >= 0) return; // Skip income
    
    const amount = Math.abs(t.amount);
    const key = Math.round(amount * 20) / 20; // Round to nearest 0.05
    
    if (!amountGroups[key]) {
      amountGroups[key] = [];
    }
    amountGroups[key].push(t);
  });
  
  // Check for recurring patterns in amount groups
  for (const [amount, group] of Object.entries(amountGroups)) {
    if (group.length >= 2) {
      // Check if same/similar merchant
      const descriptions = group.map(t => t.description.substring(0, 15));
      const uniqueDescs = new Set(descriptions);
      
      if (uniqueDescs.size === 1 || (uniqueDescs.size <= 2 && group.length >= 3)) {
        const merchantName = extractMerchantName(group[0].description);
        if (!processedMerchants.has(merchantName)) {
          detected.push({
            id: `recurring-pattern-${detected.length}`,
            merchantName: merchantName,
            originalDescription: group[0].description,
            type: 'other',
            averageAmount: parseFloat(amount),
            frequency: detectFrequency(group),
            occurrences: group.length,
            lastDate: group[group.length - 1]?.date,
            estimatedDueDay: extractDueDay(group),
            confidence: 40 + (group.length * 5),
          });
        }
      }
    }
  }
  
  return detected;
};

/**
 * Extract a clean merchant name from description
 * @param {string} description - Transaction description
 * @returns {string} Cleaned merchant name
 */
const extractMerchantName = (description) => {
  // Remove common suffixes and clean up
  let name = description
    .replace(/\s*#\d+/g, '')
    .replace(/\s*\d{4,}/g, '')
    .replace(/\s*(PURCHASE|PAYMENT|DEBIT|POS|ACH)/gi, '')
    .trim();
  
  // Take first 2-3 words
  const words = name.split(/\s+/).slice(0, 3);
  return words.join(' ');
};

export default {
  detectRecurring,
  detectFrequency,
  extractDueDay,
};
