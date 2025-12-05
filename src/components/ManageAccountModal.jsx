import React, { useState, useEffect } from 'react';

// Side Hustle Options with profession-specific configurations
const SIDE_HUSTLE_CONFIG = {
  'real-estate': {
    id: 'real-estate',
    label: 'Real Estate Agent',
    icon: '🏠',
    featured: true,
    description: 'Unlocks Real Estate Command Center',
    terminology: {
      deal: 'Transaction',
      client: 'Client',
      revenue: 'GCI',
      expense: 'Business Expense'
    },
    taxDeductions: [
      'MLS Fees & Dues',
      'Broker Splits',
      'Marketing & Advertising',
      'Vehicle Mileage',
      'Home Office',
      'Professional Development',
      'Client Entertainment',
      'Photography & Staging'
    ],
    quickTips: [
      'Track your GCI vs Net Commission',
      'Set aside 46% of commissions for taxes',
      'Log mileage for every showing',
      'Keep receipts for staging costs'
    ]
  },
  'photographer': {
    id: 'photographer',
    label: 'Photographer',
    icon: '📸',
    terminology: {
      deal: 'Session',
      client: 'Client',
      revenue: 'Session Fee',
      expense: 'Equipment Cost'
    },
    taxDeductions: [
      'Camera Equipment',
      'Lenses & Accessories',
      'Editing Software',
      'Studio Rent',
      'Props & Backdrops',
      'Travel Expenses',
      'Insurance',
      'Marketing'
    ],
    quickTips: [
      'Depreciate equipment over 5-7 years',
      'Track travel to shoot locations',
      'Keep receipts for all gear purchases',
      'Deduct software subscriptions'
    ]
  },
  'hair-stylist': {
    id: 'hair-stylist',
    label: 'Hair Stylist',
    icon: '💇',
    terminology: {
      deal: 'Appointment',
      client: 'Client',
      revenue: 'Service Fee',
      expense: 'Supplies'
    },
    taxDeductions: [
      'Styling Tools',
      'Hair Products',
      'Salon Booth Rent',
      'Continuing Education',
      'Uniforms & Aprons',
      'Sanitization Supplies',
      'Business Insurance',
      'Marketing Materials'
    ],
    quickTips: [
      'Track product costs per client',
      'Deduct booth rental fees',
      'Log education & certification costs',
      'Keep receipts for all supplies'
    ]
  },
  'makeup-artist': {
    id: 'makeup-artist',
    label: 'Makeup Artist',
    icon: '💄',
    terminology: {
      deal: 'Booking',
      client: 'Client',
      revenue: 'Service Fee',
      expense: 'Kit Supplies'
    },
    taxDeductions: [
      'Makeup & Cosmetics',
      'Brushes & Tools',
      'Sanitization Products',
      'Kit Bag & Cases',
      'Travel Expenses',
      'Portfolio Photography',
      'Website & Marketing',
      'Insurance'
    ],
    quickTips: [
      'Track product usage per booking',
      'Deduct kit maintenance costs',
      'Log mileage to client locations',
      'Keep receipts for all cosmetics'
    ]
  },
  'fitness-trainer': {
    id: 'fitness-trainer',
    label: 'Fitness Trainer',
    icon: '💪',
    terminology: {
      deal: 'Session',
      client: 'Client',
      revenue: 'Training Fee',
      expense: 'Equipment'
    },
    taxDeductions: [
      'Fitness Equipment',
      'Certifications & CEUs',
      'Gym Membership/Rent',
      'Liability Insurance',
      'Workout Apparel',
      'Nutrition Software',
      'Marketing',
      'Client Assessment Tools'
    ],
    quickTips: [
      'Track per-session revenue',
      'Deduct certification renewals',
      'Log client-related mileage',
      'Keep equipment purchase receipts'
    ]
  },
  'freelance-creative': {
    id: 'freelance-creative',
    label: 'Freelance Creative',
    icon: '🎨',
    terminology: {
      deal: 'Project',
      client: 'Client',
      revenue: 'Project Fee',
      expense: 'Supplies'
    },
    taxDeductions: [
      'Art Supplies',
      'Software Subscriptions',
      'Computer Equipment',
      'Home Office',
      'Reference Materials',
      'Portfolio Website',
      'Marketing',
      'Professional Services'
    ],
    quickTips: [
      'Track time per project',
      'Deduct software subscriptions',
      'Keep receipts for all supplies',
      'Document home office expenses'
    ]
  },
  'content-creator': {
    id: 'content-creator',
    label: 'Content Creator',
    icon: '📱',
    terminology: {
      deal: 'Campaign',
      client: 'Brand Partner',
      revenue: 'Sponsorship',
      expense: 'Production Cost'
    },
    taxDeductions: [
      'Camera & Equipment',
      'Lighting & Audio',
      'Editing Software',
      'Props & Sets',
      'Travel for Content',
      'Internet & Phone',
      'Home Studio',
      'Platform Fees'
    ],
    quickTips: [
      'Track revenue by platform',
      'Deduct equipment depreciation',
      'Log content-related travel',
      'Keep brand partnership contracts'
    ]
  },
  'music-dj': {
    id: 'music-dj',
    label: 'Musician / DJ',
    icon: '🎵',
    terminology: {
      deal: 'Gig',
      client: 'Venue/Client',
      revenue: 'Performance Fee',
      expense: 'Equipment'
    },
    taxDeductions: [
      'Instruments & Equipment',
      'Music Software',
      'Sound Equipment',
      'Vehicle for Gigs',
      'Promotional Materials',
      'Studio Time',
      'Music Licensing',
      'Performance Attire'
    ],
    quickTips: [
      'Track income per gig',
      'Deduct equipment maintenance',
      'Log mileage to performances',
      'Keep contracts for all bookings'
    ]
  },
  'consultant': {
    id: 'consultant',
    label: 'Consultant',
    icon: '💼',
    terminology: {
      deal: 'Engagement',
      client: 'Client',
      revenue: 'Consulting Fee',
      expense: 'Business Expense'
    },
    taxDeductions: [
      'Home Office',
      'Professional Development',
      'Travel Expenses',
      'Business Meals',
      'Professional Memberships',
      'Software & Tools',
      'Marketing',
      'Professional Liability Insurance'
    ],
    quickTips: [
      'Track billable hours',
      'Deduct professional memberships',
      'Log client meeting mileage',
      'Keep all expense receipts'
    ]
  },
  'event-planner': {
    id: 'event-planner',
    label: 'Event Planner',
    icon: '🎉',
    terminology: {
      deal: 'Event',
      client: 'Client',
      revenue: 'Planning Fee',
      expense: 'Event Cost'
    },
    taxDeductions: [
      'Event Supplies',
      'Vendor Deposits',
      'Travel to Venues',
      'Event Software',
      'Marketing Materials',
      'Sample Events',
      'Professional Insurance',
      'Office Supplies'
    ],
    quickTips: [
      'Track revenue per event',
      'Deduct vendor research costs',
      'Log venue visit mileage',
      'Keep all vendor contracts'
    ]
  },
  'ecommerce': {
    id: 'ecommerce',
    label: 'E-commerce Seller',
    icon: '🛒',
    terminology: {
      deal: 'Sale',
      client: 'Customer',
      revenue: 'Sales Revenue',
      expense: 'COGS'
    },
    taxDeductions: [
      'Product Inventory',
      'Shipping Supplies',
      'Platform Fees',
      'Packaging Materials',
      'Photography Equipment',
      'Storage Space',
      'Software Subscriptions',
      'Returns & Refunds'
    ],
    quickTips: [
      'Track COGS per product',
      'Deduct platform & payment fees',
      'Keep shipping receipts',
      'Document inventory costs'
    ]
  },
  'handyman': {
    id: 'handyman',
    label: 'Handyman / Contractor',
    icon: '🔧',
    terminology: {
      deal: 'Job',
      client: 'Customer',
      revenue: 'Job Fee',
      expense: 'Materials'
    },
    taxDeductions: [
      'Tools & Equipment',
      'Vehicle Expenses',
      'Materials & Supplies',
      'Licensing Fees',
      'Insurance',
      'Safety Equipment',
      'Advertising',
      'Subcontractor Payments'
    ],
    quickTips: [
      'Track materials per job',
      'Deduct tool purchases',
      'Log mileage to job sites',
      'Keep all material receipts'
    ]
  },
  'pet-services': {
    id: 'pet-services',
    label: 'Pet Services',
    icon: '🐕',
    terminology: {
      deal: 'Booking',
      client: 'Pet Parent',
      revenue: 'Service Fee',
      expense: 'Supplies'
    },
    taxDeductions: [
      'Pet Supplies',
      'Grooming Equipment',
      'Vehicle Expenses',
      'Insurance',
      'Training & Certifications',
      'Treats & Toys',
      'Cleaning Supplies',
      'Marketing'
    ],
    quickTips: [
      'Track income per pet',
      'Deduct supply costs',
      'Log mileage for walks/visits',
      'Keep certification receipts'
    ]
  },
  'notary': {
    id: 'notary',
    label: 'Notary / Mobile Services',
    icon: '📋',
    terminology: {
      deal: 'Appointment',
      client: 'Client',
      revenue: 'Service Fee',
      expense: 'Business Expense'
    },
    taxDeductions: [
      'Notary Supplies',
      'Bond & Insurance',
      'Vehicle Mileage',
      'Office Supplies',
      'Continuing Education',
      'Background Checks',
      'Marketing',
      'Technology & Equipment'
    ],
    quickTips: [
      'Track signings per month',
      'Deduct mileage to appointments',
      'Keep bond renewal receipts',
      'Document all supply costs'
    ]
  },
  'general-sales': {
    id: 'general-sales',
    label: 'General Sales',
    icon: '💰',
    terminology: {
      deal: 'Sale',
      client: 'Customer',
      revenue: 'Sales Revenue',
      expense: 'Cost'
    },
    taxDeductions: [
      'Product Costs',
      'Marketing Expenses',
      'Travel & Mileage',
      'Office Supplies',
      'Phone & Internet',
      'Professional Development',
      'Business Insurance',
      'Software Tools'
    ],
    quickTips: [
      'Track profit margins',
      'Deduct marketing costs',
      'Log customer visit mileage',
      'Keep all business receipts'
    ]
  },
  'other': {
    id: 'other',
    label: 'Other',
    icon: '✨',
    terminology: {
      deal: 'Transaction',
      client: 'Client',
      revenue: 'Revenue',
      expense: 'Expense'
    },
    taxDeductions: [
      'Business Equipment',
      'Office Supplies',
      'Professional Services',
      'Marketing',
      'Travel Expenses',
      'Insurance',
      'Continuing Education',
      'Software & Tools'
    ],
    quickTips: [
      'Track all income sources',
      'Keep organized records',
      'Save all receipts',
      'Consult a tax professional'
    ]
  }
};

// Penny mascot icon component
const PennyIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="url(#pennyGradient)" />
    <circle cx="50" cy="50" r="38" fill="#FEF3C7" />
    <circle cx="38" cy="42" r="6" fill="#1F2937" />
    <circle cx="62" cy="42" r="6" fill="#1F2937" />
    <circle cx="40" cy="40" r="2" fill="white" />
    <circle cx="64" cy="40" r="2" fill="white" />
    <path d="M35 58 Q50 72 65 58" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none" />
    <ellipse cx="28" cy="52" rx="6" ry="4" fill="#FBBF24" opacity="0.5" />
    <ellipse cx="72" cy="52" rx="6" ry="4" fill="#FBBF24" opacity="0.5" />
    <defs>
      <linearGradient id="pennyGradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

export default function ManageAccountModal({ isOpen, onClose, profile, onUpdateProfile, theme, user }) {
  const isDark = theme?.mode === 'dark';
  const [activeSection, setActiveSection] = useState('profile');
  const [showSideHustlePicker, setShowSideHustlePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localProfile, setLocalProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    photoUrl: '',
    sidehustleName: '',
    sideHustle: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        photoUrl: profile.photoUrl || '',
        sidehustleName: profile.sidehustleName || '',
        sideHustle: profile.sideHustle || ''
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(localProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSideHustleSelect = (hustleId) => {
    setLocalProfile(prev => ({ ...prev, sideHustle: hustleId }));
    setShowSideHustlePicker(false);
  };

  const filteredHustles = Object.values(SIDE_HUSTLE_CONFIG).filter(hustle =>
    hustle.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedHustle = SIDE_HUSTLE_CONFIG[localProfile.sideHustle];

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}>
        <div style={{
          background: theme.bgCard,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '85vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: `1px solid ${theme.borderLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PennyIcon size={40} />
              <div>
                <h2 style={{ 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: theme.textPrimary, 
                  margin: 0 
                }}>
                  Manage Account
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.textMuted, 
                  margin: 0 
                }}>
                  Your profile and business settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: theme.textMuted,
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Section Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '16px 28px',
            borderBottom: `1px solid ${theme.borderLight}`
          }}>
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'business', label: 'Side Hustle', icon: '💼' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeSection === tab.id 
                    ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                    : 'transparent',
                  color: activeSection === tab.id ? 'white' : theme.textMuted,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: '24px 28px' 
          }}>
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: theme.textSecondary, 
                      marginBottom: '8px' 
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={localProfile.firstName}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`,
                        background: theme.bgMain,
                        color: theme.textPrimary,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: theme.textSecondary, 
                      marginBottom: '8px' 
                    }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={localProfile.lastName}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`,
                        background: theme.bgMain,
                        color: theme.textPrimary,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: theme.textSecondary, 
                    marginBottom: '8px' 
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${theme.borderLight}`,
                      background: theme.bgMain,
                      color: theme.textPrimary,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: theme.textSecondary, 
                    marginBottom: '8px' 
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={localProfile.phone}
                    onChange={(e) => setLocalProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${theme.borderLight}`,
                      background: theme.bgMain,
                      color: theme.textPrimary,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Date of Birth & Gender */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: theme.textSecondary, 
                      marginBottom: '8px' 
                    }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={localProfile.dateOfBirth}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`,
                        background: theme.bgMain,
                        color: theme.textPrimary,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: theme.textSecondary, 
                      marginBottom: '8px' 
                    }}>
                      Gender
                    </label>
                    <select
                      value={localProfile.gender}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, gender: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`,
                        background: theme.bgMain,
                        color: theme.textPrimary,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Business/Side Hustle Section */}
            {activeSection === 'business' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Side Hustle Type Selector */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: theme.textSecondary, 
                    marginBottom: '8px' 
                  }}>
                    What's Your Side Hustle?
                  </label>
                  <button
                    onClick={() => setShowSideHustlePicker(true)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: selectedHustle 
                        ? `2px solid ${selectedHustle.id === 'real-estate' ? '#10B981' : theme.primary}` 
                        : `2px dashed ${theme.borderLight}`,
                      background: selectedHustle 
                        ? (isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)') 
                        : 'transparent',
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    {selectedHustle ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{selectedHustle.icon}</span>
                        <div>
                          <div>{selectedHustle.label}</div>
                          {selectedHustle.featured && (
                            <span style={{
                              fontSize: '11px',
                              color: '#10B981',
                              fontWeight: '500'
                            }}>
                              ⭐ Real Estate Command Center Unlocked
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: theme.textMuted }}>
                        🎯 Select your profession to unlock features
                      </span>
                    )}
                    <span style={{ fontSize: '18px', color: theme.textMuted }}>›</span>
                  </button>
                </div>

                {/* Business Name */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: theme.textSecondary, 
                    marginBottom: '8px' 
                  }}>
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={localProfile.sidehustleName}
                    onChange={(e) => setLocalProfile(prev => ({ ...prev, sidehustleName: e.target.value }))}
                    placeholder={selectedHustle ? `e.g., ${selectedHustle.label} Pro` : 'Enter your business name'}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${theme.borderLight}`,
                      background: theme.bgMain,
                      color: theme.textPrimary,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Selected Hustle Info */}
                {selectedHustle && (
                  <>
                    {/* Quick Tips */}
                    <div style={{
                      background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: theme.primary, 
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        💡 Quick Tips for {selectedHustle.label}s
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedHustle.quickTips.map((tip, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '8px',
                            fontSize: '13px',
                            color: theme.textSecondary
                          }}>
                            <span style={{ color: '#10B981' }}>✓</span>
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tax Deductions Preview */}
                    <div style={{
                      background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#10B981', 
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        🧾 Common Tax Deductions
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px' 
                      }}>
                        {selectedHustle.taxDeductions.slice(0, 6).map((deduction, idx) => (
                          <span key={idx} style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {deduction}
                          </span>
                        ))}
                        {selectedHustle.taxDeductions.length > 6 && (
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            +{selectedHustle.taxDeductions.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 28px',
            borderTop: `1px solid ${theme.borderLight}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: `1px solid ${theme.borderLight}`,
                background: 'transparent',
                color: theme.textSecondary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: saveSuccess 
                  ? 'linear-gradient(135deg, #10B981, #059669)' 
                  : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '120px',
                justifyContent: 'center'
              }}
            >
              {isSaving ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <span>✓</span>
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side Hustle Picker Modal */}
      {showSideHustlePicker && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2100,
          padding: '20px'
        }}>
          <div style={{
            background: theme.bgCard,
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Picker Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: `1px solid ${theme.borderLight}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: theme.textPrimary, 
                  margin: 0 
                }}>
                  Choose Your Profession
                </h3>
                <button
                  onClick={() => setShowSideHustlePicker(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: theme.textMuted,
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search professions..."
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.borderLight}`,
                    background: theme.bgMain,
                    color: theme.textPrimary,
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '16px'
                }}>
                  🔍
                </span>
              </div>
            </div>

            {/* Picker List */}
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              padding: '16px 28px' 
            }}>
              {filteredHustles.map(hustle => (
                <button
                  key={hustle.id}
                  onClick={() => handleSideHustleSelect(hustle.id)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: hustle.featured 
                      ? '2px solid #10B981' 
                      : `1px solid ${localProfile.sideHustle === hustle.id ? theme.primary : theme.borderLight}`,
                    background: localProfile.sideHustle === hustle.id 
                      ? (isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)') 
                      : 'transparent',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {hustle.featured && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #10B981, #06B6D4)'
                    }} />
                  )}
                  <span style={{ fontSize: '28px' }}>{hustle.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      color: theme.textPrimary,
                      marginBottom: hustle.featured ? '4px' : '0'
                    }}>
                      {hustle.label}
                    </div>
                    {hustle.featured && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#10B981',
                        fontWeight: '500'
                      }}>
                        <span>⭐</span>
                        Unlocks Real Estate Command Center
                      </div>
                    )}
                  </div>
                  {localProfile.sideHustle === hustle.id && (
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export { SIDE_HUSTLE_CONFIG };
