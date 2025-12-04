import React, { useState, useEffect } from 'react';

// ============================================================================
// SIDE HUSTLE SELECTOR - Beautiful Selection Experience for Entrepreneurs
// Used in Welcome Modal for new users AND Manage Account for updates
// ============================================================================

// Penny Icon Component - The ProsperNest mascot
// Uses the actual Penny image asset
export const PennyIcon = ({ size = 64, imageSrc = '/assets/penny.png' }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* If image source is provided, use the actual Penny image */}
    <img 
      src={imageSrc}
      alt="Penny - Your Financial Friend"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
      onError={(e) => {
        // Fallback to CSS version if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    {/* Fallback CSS version if image doesn't load */}
    <div style={{
      display: 'none',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: 'linear-gradient(180deg, #FFE566 0%, #FFCC00 50%, #E6A800 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(255,204,0,0.3)',
    }}>
      {/* Dollar sign on forehead */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: size * 0.18,
        fontWeight: '700',
        color: '#CC8800',
      }}>$</div>
      {/* Face */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: size * 0.1,
      }}>
        {/* Eyes */}
        <div style={{ display: 'flex', gap: size * 0.15 }}>
          <div style={{
            width: size * 0.12,
            height: size * 0.12,
            borderRadius: '50%',
            backgroundColor: '#1a1a1a',
          }} />
          <div style={{
            width: size * 0.12,
            height: size * 0.12,
            borderRadius: '50%',
            backgroundColor: '#1a1a1a',
          }} />
        </div>
        {/* Rosy cheeks */}
        <div style={{ 
          display: 'flex', 
          gap: size * 0.35, 
          marginTop: size * 0.02,
          position: 'absolute',
          top: '55%',
        }}>
          <div style={{
            width: size * 0.12,
            height: size * 0.08,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,150,150,0.5)',
          }} />
          <div style={{
            width: size * 0.12,
            height: size * 0.08,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,150,150,0.5)',
          }} />
        </div>
        {/* Smile */}
        <div style={{
          width: size * 0.25,
          height: size * 0.12,
          borderRadius: `0 0 ${size * 0.15}px ${size * 0.15}px`,
          border: `${size * 0.03}px solid #1a1a1a`,
          borderTop: 'none',
          marginTop: size * 0.08,
        }} />
      </div>
    </div>
  </div>
);

// Alternative: Pure CSS Penny for when no image is available
export const PennyIconCSS = ({ size = 64 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #FFE566 0%, #FFCC00 50%, #E6A800 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(255,204,0,0.3)',
  }}>
    {/* Dollar sign on forehead */}
    <div style={{
      position: 'absolute',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: size * 0.2,
      fontWeight: '700',
      color: '#B8860B',
    }}>$</div>
    {/* Face container */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: size * 0.12,
    }}>
      {/* Eyes */}
      <div style={{ display: 'flex', gap: size * 0.18 }}>
        <div style={{
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: '50%',
          backgroundColor: '#2a2a2a',
          position: 'relative',
        }}>
          {/* Eye shine */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: size * 0.04,
            height: size * 0.04,
            borderRadius: '50%',
            backgroundColor: '#fff',
          }} />
        </div>
        <div style={{
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: '50%',
          backgroundColor: '#2a2a2a',
          position: 'relative',
        }}>
          {/* Eye shine */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: size * 0.04,
            height: size * 0.04,
            borderRadius: '50%',
            backgroundColor: '#fff',
          }} />
        </div>
      </div>
      {/* Rosy cheeks */}
      <div style={{ 
        display: 'flex', 
        gap: size * 0.38, 
        position: 'absolute',
        top: '52%',
      }}>
        <div style={{
          width: size * 0.14,
          height: size * 0.09,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,120,120,0.4)',
        }} />
        <div style={{
          width: size * 0.14,
          height: size * 0.09,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,120,120,0.4)',
        }} />
      </div>
      {/* Smile */}
      <div style={{
        width: size * 0.28,
        height: size * 0.14,
        borderRadius: `0 0 ${size * 0.16}px ${size * 0.16}px`,
        border: `${size * 0.025}px solid #2a2a2a`,
        borderTop: 'none',
        marginTop: size * 0.06,
      }} />
    </div>
  </div>
);

// Dark Mode Toggle Switch Component - Matches existing dashboard style
export const DarkModeToggle = ({ isDarkMode, onToggle, size = 'medium' }) => {
  const sizes = {
    small: { width: '36px', height: '20px', knob: '16px', padding: '6px 12px', fontSize: '12px' },
    medium: { width: '44px', height: '24px', knob: '20px', padding: '8px 16px', fontSize: '14px' },
    large: { width: '52px', height: '28px', knob: '24px', padding: '10px 20px', fontSize: '16px' },
  };
  
  const s = sizes[size];
  
  return (
    <div 
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: s.padding,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderRadius: '30px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        transition: 'all 0.3s ease',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: s.fontSize }}>{isDarkMode ? '🌙' : '☀️'}</span>
      <div style={{
        width: s.width,
        height: s.height,
        backgroundColor: isDarkMode ? '#6366f1' : '#e2e8f0',
        borderRadius: parseInt(s.height) / 2,
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}>
        <div style={{
          width: s.knob,
          height: s.knob,
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: isDarkMode ? `calc(100% - ${s.knob} - 2px)` : '2px',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ 
        fontSize: s.fontSize, 
        fontWeight: '500',
        color: isDarkMode ? '#e2e8f0' : '#1e293b',
        minWidth: '70px',
      }}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </span>
    </div>
  );
};

// Side Hustle Options with categories for better organization
export const SIDE_HUSTLE_CATEGORIES = [
  {
    category: 'Real Estate & Property',
    icon: '🏠',
    options: [
      { value: 'real-estate', label: 'Real Estate Agent / Realtor', icon: '🏠', description: 'Buying, selling, and leasing properties' },
      { value: 'notary', label: 'Notary / Loan Signing Agent', icon: '📝', description: 'Document signing and notarization services' },
    ]
  },
  {
    category: 'Creative & Design',
    icon: '🎨',
    options: [
      { value: 'photographer', label: 'Photographer', icon: '📸', description: 'Portrait, event, or commercial photography' },
      { value: 'freelance-creative', label: 'Designer / Artist / Illustrator', icon: '🎨', description: 'Graphic design, illustration, or fine art' },
      { value: 'content-creator', label: 'Content Creator / Influencer', icon: '📱', description: 'Social media, YouTube, or podcasting' },
      { value: 'music-dj', label: 'Music Producer / DJ', icon: '🎵', description: 'Music production, DJing, or live performance' },
    ]
  },
  {
    category: 'Beauty & Wellness',
    icon: '💄',
    options: [
      { value: 'hair-stylist', label: 'Hair Stylist / Barber', icon: '💇', description: 'Hair styling, cuts, and coloring services' },
      { value: 'makeup-artist', label: 'Makeup Artist', icon: '💄', description: 'Makeup for events, weddings, or media' },
      { value: 'fitness-trainer', label: 'Personal Trainer / Fitness Coach', icon: '💪', description: 'Fitness training and wellness coaching' },
    ]
  },
  {
    category: 'Professional Services',
    icon: '💼',
    options: [
      { value: 'consultant', label: 'Consultant / Coach', icon: '💼', description: 'Business, life, or career coaching' },
      { value: 'event-planner', label: 'Event Planner', icon: '🎉', description: 'Wedding, corporate, or party planning' },
      { value: 'general-sales', label: 'Sales Professional', icon: '🎯', description: 'B2B sales, insurance, or direct sales' },
    ]
  },
  {
    category: 'Trades & Services',
    icon: '🔧',
    options: [
      { value: 'handyman', label: 'Handyman / Contractor', icon: '🔧', description: 'Home repairs and construction services' },
      { value: 'pet-services', label: 'Pet Groomer / Dog Walker', icon: '🐕', description: 'Pet care, grooming, or training' },
    ]
  },
  {
    category: 'E-commerce & Retail',
    icon: '🛒',
    options: [
      { value: 'ecommerce', label: 'E-commerce / Etsy Seller', icon: '🛒', description: 'Online store or marketplace selling' },
    ]
  },
  {
    category: 'Other',
    icon: '✨',
    options: [
      { value: 'other', label: 'Other / General Business', icon: '✨', description: 'Any other type of side hustle' },
    ]
  }
];

// Flat list of all options for easy lookup
export const SIDE_HUSTLE_OPTIONS = SIDE_HUSTLE_CATEGORIES.flatMap(cat => cat.options);

// ============================================================================
// WELCOME MODAL - First-time user experience
// ============================================================================
export const WelcomeSideHustleModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  userName = 'there',
  isDarkMode = false 
}) => {
  const [selectedHustle, setSelectedHustle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState(1); // 1 = welcome, 2 = selection
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setStep(1);
      setSelectedHustle(null);
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCategories = SIDE_HUSTLE_CATEGORIES.map(cat => ({
    ...cat,
    options: cat.options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.options.length > 0);

  const handleSelect = (value) => {
    setSelectedHustle(value);
  };

  const handleConfirm = () => {
    if (selectedHustle) {
      onSelect(selectedHustle);
      onClose();
    }
  };

  const handleSkip = () => {
    onSelect(null); // No side hustle selected
    onClose();
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease',
    },
    modal: {
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '24px',
      width: '95%',
      maxWidth: step === 1 ? '500px' : '700px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      animation: 'slideUp 0.4s ease',
      transition: 'max-width 0.3s ease',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      opacity: 0.5,
    },
    welcomeIcon: {
      fontSize: '64px',
      marginBottom: '16px',
      display: 'block',
      animation: 'bounce 1s ease infinite',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '8px',
      position: 'relative',
      zIndex: 1,
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.9)',
      position: 'relative',
      zIndex: 1,
    },
    content: {
      padding: '24px',
      maxHeight: '50vh',
      overflowY: 'auto',
    },
    welcomeContent: {
      textAlign: 'center',
      padding: '32px 24px',
    },
    welcomeText: {
      fontSize: '18px',
      color: isDarkMode ? '#e2e8f0' : '#475569',
      lineHeight: 1.6,
      marginBottom: '24px',
    },
    highlightText: {
      color: '#6366f1',
      fontWeight: '600',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    },
    featureCard: {
      padding: '20px 12px',
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
      borderRadius: '16px',
      textAlign: 'center',
      border: `1px solid ${isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}`,
    },
    featureIcon: {
      fontSize: '32px',
      marginBottom: '8px',
      display: 'block',
    },
    featureTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
    },
    searchContainer: {
      marginBottom: '20px',
    },
    searchInput: {
      width: '100%',
      padding: '14px 20px',
      paddingLeft: '48px',
      borderRadius: '12px',
      border: `2px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      backgroundColor: isDarkMode ? '#2d3748' : '#f8fafc',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      fontSize: '15px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      opacity: 0.5,
    },
    categorySection: {
      marginBottom: '20px',
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '12px',
    },
    optionCard: {
      padding: '16px',
      borderRadius: '12px',
      border: `2px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    optionCardSelected: {
      borderColor: '#6366f1',
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
    },
    optionCardHover: {
      borderColor: '#6366f1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
    },
    optionIcon: {
      fontSize: '28px',
      marginBottom: '8px',
      display: 'block',
    },
    optionLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      marginBottom: '4px',
    },
    optionDescription: {
      fontSize: '12px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      lineHeight: 1.4,
    },
    checkmark: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#6366f1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    footer: {
      padding: '20px 24px',
      borderTop: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    skipButton: {
      padding: '12px 24px',
      borderRadius: '10px',
      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      backgroundColor: 'transparent',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    primaryButton: {
      padding: '12px 32px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
    },
    primaryButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
  };

  // Step 1: Welcome Screen
  if (step === 1) {
    return (
      <div style={styles.overlay}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
        <div style={styles.modal}>
          <div style={styles.header}>
            <div style={styles.headerPattern}></div>
            {/* Penny Icon instead of celebration emoji */}
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <PennyIcon size={72} />
            </div>
            <div style={styles.title}>Welcome to ProsperNest!</div>
            <div style={styles.subtitle}>Your financial journey starts here, {userName}</div>
          </div>
          
          <div style={styles.welcomeContent}>
            <div style={styles.welcomeText}>
              We're thrilled to have you! Before we get started, we'd love to know...
              <br /><br />
              <span style={styles.highlightText}>Do you have a side hustle or business?</span>
              <br /><br />
              If so, we'll customize your experience with tools built specifically for entrepreneurs like you!
            </div>
            
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>📊</span>
                <div style={styles.featureTitle}>Track Sales</div>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>💰</span>
                <div style={styles.featureTitle}>Manage Income</div>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🏛️</span>
                <div style={styles.featureTitle}>Tax Estimates</div>
              </div>
            </div>
          </div>
          
          <div style={styles.footer}>
            <button 
              style={styles.skipButton}
              onClick={handleSkip}
            >
              I'll answer later
            </button>
            <button 
              style={styles.primaryButton}
              onClick={() => setStep(2)}
            >
              Yes, I have a side hustle! →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Side Hustle Selection
  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerPattern}></div>
          <span style={{...styles.welcomeIcon, fontSize: '48px'}}>💼</span>
          <div style={styles.title}>What's Your Hustle?</div>
          <div style={styles.subtitle}>Select your side hustle to unlock tailored features</div>
        </div>
        
        <div style={styles.content}>
          {/* Search */}
          <div style={{...styles.searchContainer, position: 'relative'}}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search for your hustle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          {filteredCategories.map((category) => (
            <div key={category.category} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <span>{category.icon}</span>
                {category.category}
              </div>
              <div style={styles.optionsGrid}>
                {category.options.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      ...styles.optionCard,
                      ...(selectedHustle === option.value ? styles.optionCardSelected : {}),
                    }}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={(e) => {
                      if (selectedHustle !== option.value) {
                        e.currentTarget.style.borderColor = '#6366f1';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedHustle !== option.value) {
                        e.currentTarget.style.borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {selectedHustle === option.value && (
                      <div style={styles.checkmark}>✓</div>
                    )}
                    <span style={styles.optionIcon}>{option.icon}</span>
                    <div style={styles.optionLabel}>{option.label}</div>
                    <div style={styles.optionDescription}>{option.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div>No matching hustles found. Try a different search term!</div>
            </div>
          )}
        </div>
        
        <div style={styles.footer}>
          <button 
            style={styles.skipButton}
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.skipButton}
              onClick={handleSkip}
            >
              Skip for now
            </button>
            <button 
              style={{
                ...styles.primaryButton,
                ...(selectedHustle ? {} : styles.primaryButtonDisabled)
              }}
              onClick={handleConfirm}
              disabled={!selectedHustle}
            >
              Let's Go! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MANAGE ACCOUNT SIDE HUSTLE DROPDOWN
// Component to add to existing Manage Account modal
// ============================================================================
export const SideHustleDropdown = ({ 
  value, 
  onChange, 
  isDarkMode = false,
  showLabel = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = SIDE_HUSTLE_OPTIONS.find(opt => opt.value === value);
  
  const styles = {
    container: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginBottom: '8px',
    },
    labelIcon: {
      marginRight: '6px',
    },
    dropdownButton: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '10px',
      border: `2px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      fontSize: '14px',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    dropdownButtonFocused: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
    },
    selectedDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    selectedIcon: {
      fontSize: '20px',
    },
    selectedText: {
      fontWeight: '500',
    },
    placeholder: {
      color: isDarkMode ? '#64748b' : '#94a3b8',
    },
    arrow: {
      fontSize: '12px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      transition: 'transform 0.2s ease',
    },
    arrowOpen: {
      transform: 'rotate(180deg)',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '8px',
      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    optionItem: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
    },
    optionItemHover: {
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
    },
    optionIcon: {
      fontSize: '20px',
    },
    optionText: {
      flex: 1,
      fontSize: '14px',
      color: isDarkMode ? '#ffffff' : '#1e293b',
    },
    optionCheck: {
      color: '#6366f1',
      fontWeight: 'bold',
    },
    categoryDivider: {
      padding: '8px 16px',
      fontSize: '11px',
      fontWeight: '600',
      color: isDarkMode ? '#64748b' : '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
      borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
    },
    clearOption: {
      color: '#ef4444',
      fontStyle: 'italic',
    },
  };

  return (
    <div style={styles.container}>
      {showLabel && (
        <label style={styles.label}>
          <span style={styles.labelIcon}>💼</span>
          My Side Hustle
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          style={{
            ...styles.dropdownButton,
            ...(isOpen ? styles.dropdownButtonFocused : {})
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div style={styles.selectedDisplay}>
            {selectedOption ? (
              <>
                <span style={styles.selectedIcon}>{selectedOption.icon}</span>
                <span style={styles.selectedText}>{selectedOption.label}</span>
              </>
            ) : (
              <span style={styles.placeholder}>Select your side hustle (optional)</span>
            )}
          </div>
          <span style={{
            ...styles.arrow,
            ...(isOpen ? styles.arrowOpen : {})
          }}>▼</span>
        </button>
        
        {isOpen && (
          <div style={styles.dropdown}>
            {/* Clear option */}
            <div
              style={{
                ...styles.optionItem,
                ...styles.clearOption,
              }}
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={styles.optionIcon}>🚫</span>
              <span style={styles.optionText}>No side hustle / Clear selection</span>
            </div>
            
            {SIDE_HUSTLE_CATEGORIES.map((category) => (
              <React.Fragment key={category.category}>
                <div style={styles.categoryDivider}>
                  {category.icon} {category.category}
                </div>
                {category.options.map((option) => (
                  <div
                    key={option.value}
                    style={styles.optionItem}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={styles.optionIcon}>{option.icon}</span>
                    <span style={styles.optionText}>{option.label}</span>
                    {value === option.value && (
                      <span style={styles.optionCheck}>✓</span>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      
      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// ============================================================================
// SIDE HUSTLE BADGE - Display current side hustle
// ============================================================================
export const SideHustleBadge = ({ value, isDarkMode = false, size = 'medium' }) => {
  const option = SIDE_HUSTLE_OPTIONS.find(opt => opt.value === value);
  
  if (!option) return null;
  
  const sizes = {
    small: { padding: '4px 10px', fontSize: '12px', iconSize: '14px' },
    medium: { padding: '6px 14px', fontSize: '13px', iconSize: '16px' },
    large: { padding: '8px 18px', fontSize: '14px', iconSize: '20px' },
  };
  
  const sizeConfig = sizes[size];
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: sizeConfig.padding,
      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
      borderRadius: '20px',
      fontSize: sizeConfig.fontSize,
      fontWeight: '500',
      color: '#6366f1',
    }}>
      <span style={{ fontSize: sizeConfig.iconSize }}>{option.icon}</span>
      {option.label}
    </span>
  );
};

// ============================================================================
// EXAMPLE USAGE IN MANAGE ACCOUNT MODAL
// ============================================================================
/*
// In your ManageAccountModal component:

import { SideHustleDropdown } from './SideHustleSelector';

// In your state:
const [sideHustle, setSideHustle] = useState(user?.sideHustle || null);

// In your JSX (add this between Gender and Save Changes button):
<SideHustleDropdown
  value={sideHustle}
  onChange={setSideHustle}
  isDarkMode={isDarkMode}
/>

// When saving, include sideHustle in your user update
*/

export default WelcomeSideHustleModal;
