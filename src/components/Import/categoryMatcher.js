/**
 * Category Matcher Utility
 * Auto-detects categories from merchant/transaction descriptions
 */

// Merchant patterns for auto-categorization
const merchantPatterns = {
  // Groceries
  groceries: [
    /KROGER/i, /PUBLIX/i, /WALMART\s*(GROCERY)?/i, /ALDI/i, /WHOLE FOODS/i,
    /TRADER JOE/i, /SAFEWAY/i, /ALBERTSONS/i, /FOOD LION/i, /GIANT/i,
    /WEGMANS/i, /HEB/i, /SPROUTS/i, /COSTCO/i, /SAM'S CLUB/i,
  ],
  
  // Dining
  dining: [
    /MCDONALD/i, /BURGER KING/i, /WENDY/i, /CHICK-FIL-A/i, /CHIPOTLE/i,
    /STARBUCKS/i, /DUNKIN/i, /SUBWAY/i, /TACO BELL/i, /PIZZA HUT/i,
    /DOMINO/i, /PANERA/i, /OLIVE GARDEN/i, /APPLEBEE/i, /CHILI'S/i,
    /GRUBHUB/i, /DOORDASH/i, /UBER\s*EATS/i, /POSTMATES/i,
  ],
  
  // Entertainment
  entertainment: [
    /AMC\s*THEATRE/i, /REGAL/i, /CINEMARK/i, /NETFLIX/i, /HULU/i,
    /DISNEY\+/i, /DISNEY PLUS/i, /HBO/i, /SPOTIFY/i, /APPLE\s*MUSIC/i,
    /YOUTUBE\s*PREMIUM/i, /AMAZON\s*PRIME\s*VIDEO/i, /PARAMOUNT/i,
    /PEACOCK/i, /TWITCH/i, /STEAM/i, /PLAYSTATION/i, /XBOX/i, /NINTENDO/i,
  ],
  
  // Subscriptions
  subscriptions: [
    /NETFLIX/i, /HULU/i, /SPOTIFY/i, /APPLE\.COM\/BILL/i, /AMAZON\s*PRIME/i,
    /DISNEY\+/i, /HBO\s*MAX/i, /YOUTUBE\s*PREMIUM/i, /PARAMOUNT\+/i,
    /PEACOCK/i, /ADOBE/i, /MICROSOFT\s*365/i, /DROPBOX/i, /GOOGLE\s*STORAGE/i,
    /ICLOUD/i, /AUDIBLE/i, /KINDLE/i, /PATREON/i, /SUBSTACK/i,
  ],
  
  // Transportation
  transportation: [
    /SHELL/i, /CHEVRON/i, /EXXON/i, /BP\s/i, /SPEEDWAY/i, /WAWA/i,
    /UBER(?!\s*EATS)/i, /LYFT/i, /PARKING/i, /TOLL/i, /DMV/i,
    /AUTO\s*PARTS/i, /JIFFY\s*LUBE/i, /AUTOZONE/i, /O'REILLY/i,
  ],
  
  // Utilities
  utilities: [
    /AT&T/i, /VERIZON/i, /T-MOBILE/i, /SPRINT/i, /COMCAST/i, /XFINITY/i,
    /SPECTRUM/i, /COX/i, /DUKE\s*ENERGY/i, /GEORGIA\s*POWER/i, /FPL/i,
    /WATER\s*BILL/i, /GAS\s*COMPANY/i, /ELECTRIC/i, /INTERNET/i,
  ],
  
  // Healthcare
  healthcare: [
    /CVS/i, /WALGREENS/i, /RITE\s*AID/i, /PHARMACY/i, /HOSPITAL/i,
    /DOCTOR/i, /MEDICAL/i, /HEALTH/i, /DENTAL/i, /VISION/i,
    /URGENT\s*CARE/i, /CLINIC/i, /LABCORP/i, /QUEST\s*DIAGNOSTIC/i,
  ],
  
  // Shopping
  shopping: [
    /AMAZON(?!\s*PRIME)/i, /TARGET/i, /WALMART(?!\s*GROCERY)/i, /BEST\s*BUY/i,
    /HOME\s*DEPOT/i, /LOWES/i, /IKEA/i, /BED\s*BATH/i, /KOHLS/i,
    /MACY/i, /NORDSTROM/i, /TJ\s*MAXX/i, /MARSHALLS/i, /ROSS/i,
    /OLD\s*NAVY/i, /GAP/i, /NIKE/i, /ADIDAS/i, /FOOT\s*LOCKER/i,
  ],
  
  // Housing
  housing: [
    /RENT/i, /MORTGAGE/i, /HOA/i, /PROPERTY\s*TAX/i, /HOME\s*INSURANCE/i,
    /LANDLORD/i, /APARTMENT/i, /LEASE/i,
  ],
  
  // Insurance
  insurance: [
    /STATE\s*FARM/i, /GEICO/i, /PROGRESSIVE/i, /ALLSTATE/i, /LIBERTY\s*MUTUAL/i,
    /NATIONWIDE/i, /FARMERS/i, /USAA/i, /INSURANCE/i,
  ],
  
  // Income
  income: [
    /PAYROLL/i, /DIRECT\s*DEP/i, /DEPOSIT/i, /SALARY/i, /WAGE/i,
    /PAY\s*CHECK/i, /EMPLOYER/i, /INCOME/i, /REIMBURSEMENT/i,
  ],
  
  // Transfer
  transfer: [
    /TRANSFER/i, /ZELLE/i, /VENMO/i, /PAYPAL/i, /CASH\s*APP/i,
    /WIRE/i, /ACH/i,
  ],
  
  // Business categories
  revenue: [
    /INVOICE\s*PAYMENT/i, /CLIENT\s*PAYMENT/i, /STRIPE/i, /SQUARE/i,
    /PAYMENT\s*RECEIVED/i, /SALES/i, /REVENUE/i,
  ],
  
  payroll: [
    /ADP/i, /GUSTO/i, /PAYCHEX/i, /PAYROLL/i, /EMPLOYEE\s*PAY/i,
  ],
  
  software: [
    /QUICKBOOKS/i, /XERO/i, /FRESHBOOKS/i, /SLACK/i, /ZOOM/i,
    /MICROSOFT/i, /GOOGLE\s*WORKSPACE/i, /SALESFORCE/i, /HUBSPOT/i,
    /MAILCHIMP/i, /NOTION/i, /ASANA/i, /MONDAY\.COM/i,
  ],
  
  marketing: [
    /FACEBOOK\s*ADS/i, /GOOGLE\s*ADS/i, /LINKEDIN\s*ADS/i, /TWITTER\s*ADS/i,
    /INSTAGRAM\s*ADS/i, /MAILCHIMP/i, /CONSTANT\s*CONTACT/i, /HUBSPOT/i,
  ],
  
  travel: [
    /AMERICAN\s*AIRLINES/i, /DELTA/i, /UNITED/i, /SOUTHWEST/i, /JETBLUE/i,
    /MARRIOTT/i, /HILTON/i, /HYATT/i, /AIRBNB/i, /VRBO/i,
    /EXPEDIA/i, /BOOKING\.COM/i, /KAYAK/i, /HOPPER/i,
  ],
};

/**
 * Match a transaction description to a category
 * @param {string} description - Transaction description
 * @param {string} hubType - 'home' or 'biz'
 * @returns {string|null} Category ID or null if no match
 */
export const matchCategory = (description, hubType = 'home') => {
  if (!description) return null;
  
  const upperDesc = description.toUpperCase();
  
  // Priority order for matching (most specific first)
  const homeCategories = [
    'income', 'transfer', 'subscriptions', 'groceries', 'dining',
    'entertainment', 'transportation', 'utilities', 'healthcare',
    'shopping', 'housing', 'insurance'
  ];
  
  const bizCategories = [
    'revenue', 'payroll', 'software', 'marketing', 'travel',
    'utilities', 'insurance', 'transfer'
  ];
  
  const categoriesToCheck = hubType === 'home' ? homeCategories : bizCategories;
  
  for (const category of categoriesToCheck) {
    const patterns = merchantPatterns[category];
    if (patterns) {
      for (const pattern of patterns) {
        if (pattern.test(upperDesc)) {
          return category;
        }
      }
    }
  }
  
  return null;
};

/**
 * Get category icon
 * @param {string} categoryId - Category ID
 * @param {Array} categoryOptions - Array of category objects
 * @returns {string} Emoji icon
 */
export const getCategoryIcon = (categoryId, categoryOptions = []) => {
  const category = categoryOptions.find(c => c.id === categoryId);
  if (category) return category.icon;
  
  // Fallback icons
  const fallbackIcons = {
    groceries: '🛒',
    dining: '🍽️',
    entertainment: '🎬',
    utilities: '💡',
    transportation: '🚗',
    healthcare: '🏥',
    shopping: '🛍️',
    subscriptions: '📱',
    income: '💰',
    transfer: '🔄',
    housing: '🏠',
    insurance: '🛡️',
    personal: '💅',
    education: '📚',
    pets: '🐾',
    gifts: '🎁',
    revenue: '💰',
    payroll: '👥',
    rent: '🏢',
    supplies: '📦',
    equipment: '🔧',
    marketing: '📣',
    professional: '💼',
    travel: '✈️',
    meals: '🍽️',
    software: '💻',
    taxes: '📋',
    franchise: '🏪',
    vehicle: '🚗',
    other: '📦',
  };
  
  return fallbackIcons[categoryId] || '📦';
};

/**
 * Get category name
 * @param {string} categoryId - Category ID
 * @returns {string} Human-readable name
 */
export const getCategoryName = (categoryId) => {
  const names = {
    groceries: 'Groceries',
    dining: 'Dining Out',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    transportation: 'Transportation',
    healthcare: 'Healthcare',
    shopping: 'Shopping',
    subscriptions: 'Subscriptions',
    income: 'Income',
    transfer: 'Transfer',
    housing: 'Housing',
    insurance: 'Insurance',
    personal: 'Personal Care',
    education: 'Education',
    pets: 'Pets',
    gifts: 'Gifts & Donations',
    revenue: 'Revenue',
    payroll: 'Payroll',
    rent: 'Rent/Lease',
    supplies: 'Supplies',
    equipment: 'Equipment',
    marketing: 'Marketing',
    professional: 'Professional Services',
    travel: 'Travel',
    meals: 'Meals & Entertainment',
    software: 'Software/Tech',
    taxes: 'Taxes',
    franchise: 'Franchise Fees',
    vehicle: 'Vehicle',
    other: 'Other',
  };
  
  return names[categoryId] || categoryId;
};

export default {
  matchCategory,
  getCategoryIcon,
  getCategoryName,
};
