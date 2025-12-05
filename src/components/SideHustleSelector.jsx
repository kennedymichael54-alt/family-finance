import React, { useState } from 'react';

export const SIDE_HUSTLE_CONFIG = {
  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate Agent',
    icon: '🏡',
    color: '#10B981',
    description: 'Realtors, brokers, property managers',
    commandCenterName: 'Real Estate Command Center',
    incomeLabel: 'GCI',
    dealLabel: 'Listing',
    pipelineLabel: 'Active Listings',
    featured: true,
    featureBadge: '⭐ Unlocks Real Estate Command Center',
    taxDeductions: [
      { icon: '🚗', name: 'Vehicle/Mileage', rate: '67¢/mile' },
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' },
      { icon: '📢', name: 'Marketing', rate: '100%' },
      { icon: '💻', name: 'Software/MLS', rate: '100%' },
      { icon: '📱', name: 'Phone/Internet', rate: 'Business %' },
      { icon: '📚', name: 'Licensing/CE', rate: '100%' },
      { icon: '🎁', name: 'Client Gifts', rate: '$25/person' },
      { icon: '👔', name: 'Professional Dues', rate: '100%' }
    ],
    quickTips: [
      'Track mileage for every showing and listing appointment',
      'Keep receipts for staging, photography, and marketing',
      'Home office deduction if you have dedicated space',
      'NAR dues and MLS fees are fully deductible'
    ]
  },
  'photographer': {
    id: 'photographer',
    name: 'Photographer',
    icon: '📸',
    color: '#8B5CF6',
    description: 'Wedding, portrait, commercial photography',
    commandCenterName: 'Photography Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Booking',
    pipelineLabel: 'Upcoming Shoots',
    taxDeductions: [
      { icon: '📷', name: 'Equipment', rate: 'Depreciation' },
      { icon: '💻', name: 'Editing Software', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '🏠', name: 'Studio Space', rate: 'Business %' },
      { icon: '📦', name: 'Props & Backdrops', rate: '100%' },
      { icon: '🌐', name: 'Website/Portfolio', rate: '100%' },
      { icon: '📚', name: 'Workshops', rate: '100%' },
      { icon: '💼', name: 'Insurance', rate: '100%' }
    ],
    quickTips: [
      'Depreciate camera equipment over 5-7 years',
      'Adobe Creative Cloud is fully deductible',
      'Track mileage to every shoot location',
      'Second shooter payments are deductible'
    ]
  },
  'hair-stylist': {
    id: 'hair-stylist',
    name: 'Hair Stylist',
    icon: '💇',
    color: '#EC4899',
    description: 'Salon owner, booth renter, mobile stylist',
    commandCenterName: 'Salon Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Appointment',
    pipelineLabel: 'Bookings',
    taxDeductions: [
      { icon: '✂️', name: 'Tools & Equipment', rate: '100%' },
      { icon: '🧴', name: 'Products & Supplies', rate: '100%' },
      { icon: '🏠', name: 'Booth Rent', rate: '100%' },
      { icon: '📚', name: 'Continuing Ed', rate: '100%' },
      { icon: '👔', name: 'Uniforms', rate: '100%' },
      { icon: '💼', name: 'Liability Insurance', rate: '100%' },
      { icon: '📱', name: 'Booking Software', rate: '100%' },
      { icon: '🚗', name: 'Mobile Travel', rate: '67¢/mile' }
    ],
    quickTips: [
      'Track every product purchase for write-offs',
      'Booth rent is fully deductible business expense',
      'Keep tip records for accurate income reporting',
      'Specialized scissors and tools are deductible'
    ]
  },
  'makeup-artist': {
    id: 'makeup-artist',
    name: 'Makeup Artist',
    icon: '💄',
    color: '#F472B6',
    description: 'Bridal, editorial, film/TV makeup',
    commandCenterName: 'Beauty Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Booking',
    pipelineLabel: 'Upcoming Jobs',
    taxDeductions: [
      { icon: '💄', name: 'Makeup & Products', rate: '100%' },
      { icon: '🧰', name: 'Kit & Brushes', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '📸', name: 'Portfolio Shoots', rate: '100%' },
      { icon: '📚', name: 'Masterclasses', rate: '100%' },
      { icon: '💼', name: 'Insurance', rate: '100%' },
      { icon: '🌐', name: 'Website', rate: '100%' },
      { icon: '📱', name: 'Booking Apps', rate: '100%' }
    ],
    quickTips: [
      'All makeup used on clients is deductible',
      'Sanitization supplies are business expenses',
      'Track mileage to every wedding or shoot',
      'Portfolio photo sessions are write-offs'
    ]
  },
  'fitness-trainer': {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    icon: '💪',
    color: '#EF4444',
    description: 'Personal trainer, group fitness, online coaching',
    commandCenterName: 'Fitness Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Client',
    pipelineLabel: 'Active Clients',
    taxDeductions: [
      { icon: '🏋️', name: 'Equipment', rate: 'Depreciation' },
      { icon: '📚', name: 'Certifications', rate: '100%' },
      { icon: '💼', name: 'Insurance', rate: '100%' },
      { icon: '📱', name: 'Fitness Apps', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '👕', name: 'Workout Attire', rate: '100%' },
      { icon: '🎥', name: 'Video Equipment', rate: '100%' },
      { icon: '🌐', name: 'Website/Platform', rate: '100%' }
    ],
    quickTips: [
      'CPR and specialty certifications are deductible',
      'Gym membership may be deductible for trainers',
      'Track mileage to client locations',
      'Video equipment for online coaching is write-off'
    ]
  },
  'freelance-creative': {
    id: 'freelance-creative',
    name: 'Freelance Creative',
    icon: '🎨',
    color: '#F59E0B',
    description: 'Graphic design, illustration, creative services',
    commandCenterName: 'Creative Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Project',
    pipelineLabel: 'Active Projects',
    taxDeductions: [
      { icon: '💻', name: 'Computer/Hardware', rate: 'Depreciation' },
      { icon: '🎨', name: 'Design Software', rate: '100%' },
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' },
      { icon: '📚', name: 'Online Courses', rate: '100%' },
      { icon: '🌐', name: 'Portfolio Site', rate: '100%' },
      { icon: '📦', name: 'Stock Assets', rate: '100%' },
      { icon: '🖨️', name: 'Printing/Samples', rate: '100%' },
      { icon: '💼', name: 'Coworking Space', rate: '100%' }
    ],
    quickTips: [
      'Adobe, Figma, and design tools are deductible',
      'Home office is valuable for full-time freelancers',
      'Skill-building courses are business expenses',
      'Client meeting meals are 50% deductible'
    ]
  },
  'content-creator': {
    id: 'content-creator',
    name: 'Content Creator',
    icon: '🎬',
    color: '#DC2626',
    description: 'YouTube, TikTok, social media influencer',
    commandCenterName: 'Creator Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Brand Deal',
    pipelineLabel: 'Sponsorships',
    taxDeductions: [
      { icon: '📷', name: 'Camera/Equipment', rate: 'Depreciation' },
      { icon: '💡', name: 'Lighting/Studio', rate: '100%' },
      { icon: '💻', name: 'Editing Software', rate: '100%' },
      { icon: '🎤', name: 'Audio Equipment', rate: '100%' },
      { icon: '📦', name: 'Props/Products', rate: 'Content use' },
      { icon: '🏠', name: 'Studio Space', rate: 'Business %' },
      { icon: '📱', name: 'Phones/Tech', rate: 'Business %' },
      { icon: '🌐', name: 'Hosting/Tools', rate: '100%' }
    ],
    quickTips: [
      'Ring lights and camera gear are depreciable',
      'Products reviewed may be deductible',
      'Track the business percentage of your phone',
      'Editing subscriptions are fully deductible'
    ]
  },
  'music-dj': {
    id: 'music-dj',
    name: 'Musician / DJ',
    icon: '🎵',
    color: '#7C3AED',
    description: 'DJ, musician, producer, performer',
    commandCenterName: 'Music Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Gig',
    pipelineLabel: 'Upcoming Shows',
    taxDeductions: [
      { icon: '🎹', name: 'Instruments/Gear', rate: 'Depreciation' },
      { icon: '🎧', name: 'DJ Equipment', rate: '100%' },
      { icon: '💻', name: 'Production Software', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '📚', name: 'Music Lessons', rate: '100%' },
      { icon: '🎵', name: 'Sample Packs', rate: '100%' },
      { icon: '🏠', name: 'Studio Space', rate: 'Business %' },
      { icon: '💼', name: 'Liability Insurance', rate: '100%' }
    ],
    quickTips: [
      'Instruments depreciate over 5-7 years',
      'Ableton, Logic, and plugins are deductible',
      'Track mileage to every gig and rehearsal',
      'Venue rental for practice is deductible'
    ]
  },
  'consultant': {
    id: 'consultant',
    name: 'Consultant',
    icon: '💼',
    color: '#0EA5E9',
    description: 'Business, IT, management consulting',
    commandCenterName: 'Consulting Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Engagement',
    pipelineLabel: 'Active Projects',
    taxDeductions: [
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' },
      { icon: '💻', name: 'Tech/Software', rate: '100%' },
      { icon: '✈️', name: 'Business Travel', rate: '100%' },
      { icon: '📚', name: 'Professional Dev', rate: '100%' },
      { icon: '👔', name: 'Professional Attire', rate: 'If required' },
      { icon: '📱', name: 'Phone/Internet', rate: 'Business %' },
      { icon: '🍽️', name: 'Client Meals', rate: '50%' },
      { icon: '💼', name: 'Professional Dues', rate: '100%' }
    ],
    quickTips: [
      'Track all client meeting expenses',
      'Business travel is fully deductible',
      'Professional certifications are write-offs',
      'Coworking space memberships are deductible'
    ]
  },
  'event-planner': {
    id: 'event-planner',
    name: 'Event Planner',
    icon: '🎉',
    color: '#D946EF',
    description: 'Wedding, corporate, party planning',
    commandCenterName: 'Events Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Event',
    pipelineLabel: 'Upcoming Events',
    taxDeductions: [
      { icon: '📦', name: 'Decor/Supplies', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '💻', name: 'Planning Software', rate: '100%' },
      { icon: '📱', name: 'Phone/Internet', rate: 'Business %' },
      { icon: '💼', name: 'Insurance', rate: '100%' },
      { icon: '🍽️', name: 'Client Tastings', rate: '50%' },
      { icon: '📚', name: 'Certifications', rate: '100%' },
      { icon: '🎁', name: 'Client Gifts', rate: '$25/person' }
    ],
    quickTips: [
      'Site visit mileage adds up - track it all',
      'Vendor meeting meals are 50% deductible',
      'Sample decor and supplies are write-offs',
      'Event insurance is fully deductible'
    ]
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce Seller',
    icon: '🛒',
    color: '#14B8A6',
    description: 'Etsy, Amazon, Shopify, online retail',
    commandCenterName: 'E-commerce Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Order',
    pipelineLabel: 'Pending Orders',
    taxDeductions: [
      { icon: '📦', name: 'Inventory/COGS', rate: '100%' },
      { icon: '📮', name: 'Shipping Supplies', rate: '100%' },
      { icon: '💻', name: 'Platform Fees', rate: '100%' },
      { icon: '🏠', name: 'Storage Space', rate: 'Business %' },
      { icon: '📷', name: 'Product Photos', rate: '100%' },
      { icon: '📢', name: 'Advertising', rate: '100%' },
      { icon: '🚗', name: 'Sourcing Trips', rate: '67¢/mile' },
      { icon: '💼', name: 'Business Licenses', rate: '100%' }
    ],
    quickTips: [
      'Track all inventory purchases as COGS',
      'Platform fees (Etsy, eBay) are deductible',
      'Shipping supplies and postage are write-offs',
      'Product photography is a business expense'
    ]
  },
  'handyman': {
    id: 'handyman',
    name: 'Handyman / Contractor',
    icon: '🔧',
    color: '#EA580C',
    description: 'Home repair, renovation, trades',
    commandCenterName: 'Trades Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Job',
    pipelineLabel: 'Active Jobs',
    taxDeductions: [
      { icon: '🔧', name: 'Tools/Equipment', rate: 'Depreciation' },
      { icon: '📦', name: 'Materials', rate: '100%' },
      { icon: '🚗', name: 'Vehicle/Mileage', rate: '67¢/mile' },
      { icon: '👷', name: 'Safety Gear', rate: '100%' },
      { icon: '💼', name: 'Licenses/Bonds', rate: '100%' },
      { icon: '📱', name: 'Job Management', rate: '100%' },
      { icon: '⛽', name: 'Fuel', rate: 'Business %' },
      { icon: '👕', name: 'Work Uniforms', rate: '100%' }
    ],
    quickTips: [
      'Track every trip to Home Depot and job sites',
      'Power tools depreciate over 5-7 years',
      'Vehicle expenses add up - mileage or actual',
      'Safety equipment is fully deductible'
    ]
  },
  'pet-services': {
    id: 'pet-services',
    name: 'Pet Services',
    icon: '🐕',
    color: '#84CC16',
    description: 'Dog walking, grooming, pet sitting',
    commandCenterName: 'Pet Business Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Booking',
    pipelineLabel: 'Scheduled Services',
    taxDeductions: [
      { icon: '🦮', name: 'Pet Supplies', rate: '100%' },
      { icon: '🚗', name: 'Travel/Mileage', rate: '67¢/mile' },
      { icon: '💼', name: 'Insurance/Bonding', rate: '100%' },
      { icon: '📱', name: 'Booking Apps', rate: '100%' },
      { icon: '🧹', name: 'Grooming Tools', rate: '100%' },
      { icon: '📚', name: 'Training/Certs', rate: '100%' },
      { icon: '🏠', name: 'Home Space', rate: 'Business %' },
      { icon: '🎁', name: 'Client Gifts', rate: '$25/person' }
    ],
    quickTips: [
      'Mileage between client visits adds up fast',
      'Treats and supplies for clients are deductible',
      'Pet first aid certification is a write-off',
      'Liability insurance is essential and deductible'
    ]
  },
  'notary': {
    id: 'notary',
    name: 'Notary / Signing Agent',
    icon: '📋',
    color: '#64748B',
    description: 'Loan signing, mobile notary services',
    commandCenterName: 'Notary Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Signing',
    pipelineLabel: 'Scheduled Signings',
    taxDeductions: [
      { icon: '🚗', name: 'Mileage', rate: '67¢/mile' },
      { icon: '📋', name: 'Supplies/Stamps', rate: '100%' },
      { icon: '💼', name: 'E&O Insurance', rate: '100%' },
      { icon: '📱', name: 'Signing Platforms', rate: '100%' },
      { icon: '🖨️', name: 'Printer/Ink', rate: '100%' },
      { icon: '📚', name: 'Certifications', rate: '100%' },
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' },
      { icon: '📦', name: 'Background Checks', rate: '100%' }
    ],
    quickTips: [
      'Track every mile to signing appointments',
      'Notary bond and E&O insurance are deductible',
      'Signing platform fees are business expenses',
      'Printer and supplies add up - track them'
    ]
  },
  'general-sales': {
    id: 'general-sales',
    name: 'Sales Professional',
    icon: '📈',
    color: '#3B82F6',
    description: 'Commission-based sales, direct sales',
    commandCenterName: 'Sales Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Sale',
    pipelineLabel: 'Active Leads',
    taxDeductions: [
      { icon: '🚗', name: 'Vehicle/Mileage', rate: '67¢/mile' },
      { icon: '📱', name: 'Phone/Data', rate: 'Business %' },
      { icon: '💻', name: 'CRM Software', rate: '100%' },
      { icon: '🍽️', name: 'Client Meals', rate: '50%' },
      { icon: '🎁', name: 'Client Gifts', rate: '$25/person' },
      { icon: '📚', name: 'Sales Training', rate: '100%' },
      { icon: '👔', name: 'Professional Attire', rate: 'If required' },
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' }
    ],
    quickTips: [
      'Track mileage to every client meeting',
      'CRM and sales tools are fully deductible',
      'Client entertainment is 50% deductible',
      'Sales conferences are business expenses'
    ]
  },
  'other': {
    id: 'other',
    name: 'Other Side Hustle',
    icon: '✨',
    color: '#6B7280',
    description: 'Any other self-employment income',
    commandCenterName: 'Command Center',
    incomeLabel: 'Revenue',
    dealLabel: 'Transaction',
    pipelineLabel: 'Active Work',
    taxDeductions: [
      { icon: '🏠', name: 'Home Office', rate: '$5/sq ft' },
      { icon: '💻', name: 'Computer/Tech', rate: 'Depreciation' },
      { icon: '📱', name: 'Phone/Internet', rate: 'Business %' },
      { icon: '🚗', name: 'Business Mileage', rate: '67¢/mile' },
      { icon: '📚', name: 'Education', rate: '100%' },
      { icon: '💼', name: 'Insurance', rate: '100%' },
      { icon: '🌐', name: 'Website/Tools', rate: '100%' },
      { icon: '📦', name: 'Supplies', rate: '100%' }
    ],
    quickTips: [
      'Track all business-related expenses',
      'Keep receipts organized by category',
      'Document the business purpose of purchases',
      'Consider quarterly estimated tax payments'
    ]
  }
};

export default function SideHustleSelector({ currentValue, onSelect, isDarkMode, theme, showFullPicker = false, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const hustles = Object.values(SIDE_HUSTLE_CONFIG);
  const filteredHustles = hustles.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeColors = theme || {
    textPrimary: isDarkMode ? '#F9FAFB' : '#111827',
    textSecondary: isDarkMode ? '#D1D5DB' : '#4B5563',
    textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
    bgMain: isDarkMode ? '#111827' : '#F9FAFB',
    bgCard: isDarkMode ? '#1F2937' : '#FFFFFF',
    borderLight: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    primary: '#8B5CF6'
  };

  if (showFullPicker) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
        <div style={{ background: themeColors.bgCard, borderRadius: '24px', width: '600px', maxWidth: '95vw', maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          {/* Header */}
          <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${themeColors.borderLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: themeColors.textPrimary, margin: 0 }}>Choose Your Side Hustle</h2>
                <p style={{ fontSize: '14px', color: themeColors.textMuted, margin: '4px 0 0' }}>This customizes your Command Center experience</p>
              </div>
              <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: themeColors.bgMain, color: themeColors.textMuted, fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search professions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', background: themeColors.bgMain, border: `1px solid ${themeColors.borderLight}`, borderRadius: '12px', color: themeColors.textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
            </div>
          </div>

          {/* Options Grid */}
          <div style={{ padding: '16px 24px 24px', overflowY: 'auto', maxHeight: 'calc(85vh - 160px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredHustles.map(hustle => {
                const isSelected = currentValue === hustle.id;
                const isRealEstate = hustle.id === 'real-estate';
                return (
                  <button
                    key={hustle.id}
                    onClick={() => { onSelect(hustle.id); onClose(); }}
                    style={{
                      padding: '16px',
                      background: isSelected ? `${hustle.color}15` : themeColors.bgMain,
                      border: `2px solid ${isSelected ? hustle.color : isRealEstate ? '#10B98150' : themeColors.borderLight}`,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isRealEstate && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: '600' }}>⭐ SPECIAL</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${hustle.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{hustle.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: themeColors.textPrimary, marginBottom: '2px' }}>{hustle.name}</div>
                        <div style={{ fontSize: '12px', color: themeColors.textMuted }}>{hustle.description}</div>
                      </div>
                      {isSelected && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: hustle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>✓</div>}
                    </div>
                    {isRealEstate && !isSelected && (
                      <div style={{ marginTop: '10px', padding: '8px 12px', background: 'linear-gradient(135deg, #10B98115, #06B6D415)', borderRadius: '8px', fontSize: '11px', color: '#10B981', fontWeight: '500' }}>
                        ⭐ Unlocks Real Estate Command Center with GCI tracking, listing inventory & more
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact dropdown version
  const current = SIDE_HUSTLE_CONFIG[currentValue] || SIDE_HUSTLE_CONFIG['other'];
  
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => showFullPicker ? null : onSelect(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: themeColors.bgMain,
          border: `1px solid ${themeColors.borderLight}`,
          borderRadius: '12px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${current.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{current.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: themeColors.textPrimary }}>{current.name}</div>
          <div style={{ fontSize: '12px', color: themeColors.textMuted }}>{current.description}</div>
        </div>
        <span style={{ color: themeColors.textMuted }}>▼</span>
      </button>
    </div>
  );
}
