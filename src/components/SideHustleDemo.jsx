import React, { useState, useEffect } from 'react';

// ============================================================================
// PROSPERNEST SIDE HUSTLE DEMO - Visual Preview of All Components
// Run this to see how everything looks and works together
// ============================================================================

// Penny Icon Component - The ProsperNest mascot with cute face
// Matches the actual Penny design: golden coin with face, rosy cheeks, $ on forehead
const PennyIcon = ({ size = 64, imageSrc = null }) => {
  // If an image source is provided, use it
  if (imageSrc) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
      }}>
        <img 
          src={imageSrc}
          alt="Penny"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    );
  }
  
  // CSS-rendered Penny mascot
  return (
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
};

// Dark Mode Toggle Switch Component
const DarkModeToggle = ({ isDarkMode, onToggle }) => (
  <div 
    onClick={onToggle}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '30px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      transition: 'all 0.3s ease',
    }}
  >
    <span style={{ fontSize: '16px' }}>{isDarkMode ? '🌙' : '☀️'}</span>
    <div style={{
      width: '44px',
      height: '24px',
      backgroundColor: isDarkMode ? '#6366f1' : '#e2e8f0',
      borderRadius: '12px',
      position: 'relative',
      transition: 'background-color 0.3s ease',
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: isDarkMode ? '22px' : '2px',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
    <span style={{ 
      fontSize: '14px', 
      fontWeight: '500',
      color: isDarkMode ? '#e2e8f0' : '#1e293b',
      minWidth: '70px',
    }}>
      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
    </span>
  </div>
);

// Feature Slideshow Component - 10 second auto-rotating carousel
const FeatureSlideshow = ({ isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'Track Your Budget',
      subtitle: 'See where every dollar goes',
      icon: '📊',
      color: '#6366f1',
      stats: [
        { label: 'Monthly Income', value: '$8,450', color: '#22c55e' },
        { label: 'Monthly Expenses', value: '$5,230', color: '#ef4444' },
        { label: 'Savings Rate', value: '38%', color: '#6366f1' },
      ],
      chart: [65, 80, 45, 90, 70, 85, 60],
    },
    {
      title: 'Command Center',
      subtitle: 'Manage your side hustle',
      icon: '⚡',
      color: '#8b5cf6',
      stats: [
        { label: 'Total Commissions', value: '$24,500', color: '#22c55e' },
        { label: 'Active Deals', value: '8', color: '#f59e0b' },
        { label: 'Closed This Month', value: '3', color: '#6366f1' },
      ],
      pipeline: ['Prospecting', 'Listed', 'Under Contract', 'Closed'],
    },
    {
      title: 'Tax Estimator',
      subtitle: 'Never miss a quarterly payment',
      icon: '🏛️',
      color: '#059669',
      stats: [
        { label: 'Q1 Payment Due', value: '$2,450', color: '#f59e0b' },
        { label: 'Total Deductions', value: '$8,320', color: '#22c55e' },
        { label: 'Est. Tax Savings', value: '$1,830', color: '#6366f1' },
      ],
      dueDate: 'April 15, 2025',
    },
    {
      title: 'Retirement Planning',
      subtitle: 'Build your future wealth',
      icon: '🏖️',
      color: '#0891b2',
      stats: [
        { label: '401(k) Balance', value: '$127,450', color: '#22c55e' },
        { label: 'Roth IRA', value: '$45,200', color: '#6366f1' },
        { label: 'On Track Score', value: '92%', color: '#22c55e' },
      ],
      progress: 72,
    },
    {
      title: 'Import Transactions',
      subtitle: 'Connect all your accounts',
      icon: '📥',
      color: '#dc2626',
      banks: ['Chase', 'Bank of America', 'Wells Fargo', 'Capital One'],
      stats: [
        { label: 'Accounts Connected', value: '4', color: '#22c55e' },
        { label: 'Auto-categorized', value: '98%', color: '#6366f1' },
        { label: 'Last Sync', value: '2 min ago', color: '#94a3b8' },
      ],
    },
  ];
  
  // Auto-advance slides every 2 seconds (10 seconds total for 5 slides)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  
  const slide = slides[currentSlide];
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1e293b';
  const mutedColor = isDarkMode ? '#94a3b8' : '#64748b';
  
  return (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '16px',
      padding: '20px',
      marginTop: '24px',
      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      overflow: 'hidden',
    }}>
      {/* Slide Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: `${slide.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {slide.icon}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: textColor }}>{slide.title}</div>
          <div style={{ fontSize: '13px', color: mutedColor }}>{slide.subtitle}</div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {slide.stats.map((stat, idx) => (
          <div key={idx} style={{
            padding: '12px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Visual Element based on slide type */}
      {slide.chart && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
          {slide.chart.map((val, idx) => (
            <div key={idx} style={{
              flex: 1,
              height: `${val}%`,
              backgroundColor: idx === slide.chart.length - 1 ? slide.color : `${slide.color}40`,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
            }} />
          ))}
        </div>
      )}
      
      {slide.pipeline && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {slide.pipeline.map((stage, idx) => (
            <div key={idx} style={{
              flex: 1,
              padding: '8px 4px',
              backgroundColor: idx === 3 ? '#22c55e20' : `${slide.color}15`,
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: '500',
              color: idx === 3 ? '#22c55e' : slide.color,
              borderTop: `3px solid ${idx === 3 ? '#22c55e' : slide.color}`,
            }}>
              {stage}
            </div>
          ))}
        </div>
      )}
      
      {slide.progress !== undefined && (
        <div>
          <div style={{
            height: '12px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${slide.progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${slide.color} 0%, #22c55e 100%)`,
              borderRadius: '6px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '6px', textAlign: 'center' }}>
            {slide.progress}% to retirement goal
          </div>
        </div>
      )}
      
      {slide.dueDate && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${slide.color}20 0%, ${slide.color}10 100%)`,
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: mutedColor }}>Next Payment Due</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: slide.color }}>{slide.dueDate}</span>
        </div>
      )}
      
      {slide.banks && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {slide.banks.map((bank, idx) => (
            <div key={idx} style={{
              padding: '8px 14px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ color: '#22c55e' }}>✓</span>
              {bank}
            </div>
          ))}
        </div>
      )}
      
      {/* Progress Dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px',
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: currentSlide === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentSlide === idx ? slide.color : (isDarkMode ? '#4a5568' : '#e2e8f0'),
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Side Hustle Configuration (condensed for demo)
const SIDE_HUSTLE_CONFIG = {
  'real-estate': {
    name: 'Real Estate',
    icon: '🏠',
    dealName: 'Transaction',
    dealNamePlural: 'Transactions',
    clientName: 'Client',
    revenueNamePlural: 'Commissions',
    pipelineStages: ['Prospecting', 'Listed', 'Under Contract', 'Closed'],
    kpiLabels: { totalRevenue: 'Total Commissions', activeDeals: 'Active Transactions' }
  },
  'photographer': {
    name: 'Photography',
    icon: '📸',
    dealName: 'Session',
    dealNamePlural: 'Sessions',
    clientName: 'Client',
    revenueNamePlural: 'Bookings',
    pipelineStages: ['Inquiry', 'Booked', 'Session Complete', 'Delivered'],
    kpiLabels: { totalRevenue: 'Total Revenue', activeDeals: 'Upcoming Sessions' }
  },
  'hair-stylist': {
    name: 'Hair & Beauty',
    icon: '💇',
    dealName: 'Appointment',
    dealNamePlural: 'Appointments',
    clientName: 'Client',
    revenueNamePlural: 'Services',
    pipelineStages: ['Consultation', 'Scheduled', 'In Progress', 'Completed'],
    kpiLabels: { totalRevenue: 'Total Revenue', activeDeals: "Today's Appointments" }
  },
  'general-sales': {
    name: 'Sales Professional',
    icon: '🎯',
    dealName: 'Deal',
    dealNamePlural: 'Deals',
    clientName: 'Client',
    revenueNamePlural: 'Commissions',
    pipelineStages: ['Prospecting', 'Qualified', 'Proposal', 'Closed Won'],
    kpiLabels: { totalRevenue: 'Total Commissions', activeDeals: 'Active Opportunities' }
  },
};

const SIDE_HUSTLE_OPTIONS = [
  { value: 'real-estate', label: 'Real Estate Agent', icon: '🏠' },
  { value: 'photographer', label: 'Photographer', icon: '📸' },
  { value: 'hair-stylist', label: 'Hair Stylist / Barber', icon: '💇' },
  { value: 'makeup-artist', label: 'Makeup Artist', icon: '💄' },
  { value: 'fitness-trainer', label: 'Personal Trainer', icon: '💪' },
  { value: 'freelance-creative', label: 'Designer / Artist', icon: '🎨' },
  { value: 'content-creator', label: 'Content Creator', icon: '📱' },
  { value: 'consultant', label: 'Consultant / Coach', icon: '💼' },
  { value: 'ecommerce', label: 'E-commerce Seller', icon: '🛒' },
  { value: 'general-sales', label: 'Sales Professional', icon: '🎯' },
  { value: 'other', label: 'Other Business', icon: '✨' },
];

const SideHustleDemo = () => {
  const [currentView, setCurrentView] = useState('welcome'); // welcome, selection, command, manage
  const [selectedHustle, setSelectedHustle] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const config = SIDE_HUSTLE_CONFIG[selectedHustle] || SIDE_HUSTLE_CONFIG['general-sales'];
  
  const bgColor = isDarkMode ? '#0f172a' : '#f1f5f9';
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1e293b';
  const mutedColor = isDarkMode ? '#94a3b8' : '#64748b';
  
  // Welcome Step 1
  const renderWelcomeStep1 = () => (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Penny Icon */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <PennyIcon size={72} />
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          Welcome to ProsperNest!
        </div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
          Your financial journey starts here
        </div>
      </div>
      
      <div style={{ padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: mutedColor, lineHeight: 1.6, marginBottom: '24px' }}>
          We're thrilled to have you! Before we get started...
          <br /><br />
          <span style={{ color: '#6366f1', fontWeight: '600' }}>Do you have a side hustle or business?</span>
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {['📊 Track Sales', '💰 Manage Income', '🏛️ Tax Estimates'].map(feature => (
            <div key={feature} style={{
              padding: '16px 8px',
              backgroundColor: isDarkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              color: textColor,
            }}>
              {feature}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            flex: 1,
            padding: '14px',
            borderRadius: '10px',
            border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
            backgroundColor: 'transparent',
            color: mutedColor,
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            I'll answer later
          </button>
          <button 
            onClick={() => setCurrentView('selection')}
            style={{
              flex: 1.5,
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Yes, I have a side hustle! →
          </button>
        </div>
        
        {/* Feature Slideshow */}
        <FeatureSlideshow isDarkMode={isDarkMode} />
      </div>
    </div>
  );
  
  // Selection Modal
  const renderSelection = () => (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '700px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
          What's Your Hustle?
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Select to unlock tailored features
        </div>
      </div>
      
      <div style={{ padding: '24px', maxHeight: '400px', overflowY: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}>
          {SIDE_HUSTLE_OPTIONS.map(option => (
            <div
              key={option.value}
              onClick={() => setSelectedHustle(option.value)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${selectedHustle === option.value ? '#6366f1' : (isDarkMode ? '#4a5568' : '#e2e8f0')}`,
                backgroundColor: selectedHustle === option.value 
                  ? (isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)')
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {selectedHustle === option.value && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}>✓</div>
              )}
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{option.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: textColor }}>{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <button 
          onClick={() => setCurrentView('welcome')}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
            backgroundColor: 'transparent',
            color: mutedColor,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <button 
          onClick={() => setCurrentView('command')}
          disabled={!selectedHustle}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            background: selectedHustle ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
            color: '#fff',
            fontWeight: '600',
            cursor: selectedHustle ? 'pointer' : 'not-allowed',
          }}
        >
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
  
  // Command Center Preview
  const renderCommandCenter = () => (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '900px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px' }}>⚡</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: textColor }}>Command Center</span>
          <span style={{
            padding: '4px 12px',
            backgroundColor: isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>{config.icon}</span>
            {config.name}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: mutedColor }}>
          Track your {config.dealNamePlural.toLowerCase()}, {config.clientName.toLowerCase()}s, and finances
        </p>
      </div>
      
      {/* Tabs */}
      <div style={{ 
        padding: '12px 24px', 
        display: 'flex', 
        gap: '8px',
        borderBottom: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
      }}>
        {['📊 Dashboard', '🎯 Pipeline', `💵 ${config.revenueNamePlural}`, '📝 Expenses', '👥 CRM', '🏛️ Tax Center'].map((tab, idx) => (
          <button key={tab} style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: idx === 0 ? '#6366f1' : 'transparent',
            color: idx === 0 ? '#fff' : mutedColor,
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            {tab}
          </button>
        ))}
      </div>
      
      {/* KPI Cards */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#fff',
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase' }}>
              {config.kpiLabels.totalRevenue}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>$24,500</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#fff',
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase' }}>
              {config.kpiLabels.activeDeals}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>8</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#fff',
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase' }}>
              Avg {config.dealName} Size
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>$3,063</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#fff',
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase' }}>
              {config.dealNamePlural} Closed
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>8</div>
          </div>
        </div>
        
        {/* Pipeline Preview */}
        <div style={{
          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: textColor, marginBottom: '16px' }}>
            📋 Recent {config.dealNamePlural}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {config.pipelineStages.slice(0, 3).map((stage, idx) => (
              <div key={stage} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: cardBg,
                borderRadius: '8px',
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: textColor }}>
                    Sample {config.dealName} #{idx + 1}
                  </div>
                  <div style={{ fontSize: '13px', color: mutedColor }}>
                    {config.clientName}: John Doe
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: ['rgba(239,68,68,0.1)', 'rgba(245,158,11,0.1)', 'rgba(59,130,246,0.1)'][idx],
                  color: ['#ef4444', '#f59e0b', '#3b82f6'][idx],
                }}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button 
          onClick={() => setCurrentView('manage')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
            backgroundColor: 'transparent',
            color: mutedColor,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          View Manage Account →
        </button>
        <button 
          onClick={() => { setCurrentView('welcome'); setSelectedHustle(null); }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          🔄 Try Different Hustle
        </button>
      </div>
    </div>
  );
  
  // Manage Account Preview
  const renderManageAccount = () => (
    <div style={{
      backgroundColor: cardBg,
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }}>
      <div style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <span style={{ fontSize: '24px', fontWeight: '600', color: textColor }}>Manage Account</span>
          <button 
            onClick={() => setCurrentView('command')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: mutedColor,
            }}
          >×</button>
        </div>
        
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e9d5ff',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}>
            🧑‍💼
          </div>
          <div style={{ color: '#6366f1', fontSize: '14px', cursor: 'pointer' }}>Change Avatar</div>
        </div>
        
        {/* Form Fields (abbreviated) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: mutedColor, marginBottom: '6px' }}>First Name</label>
            <input style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
              backgroundColor: isDarkMode ? '#2d3748' : '#fff',
              color: textColor,
              boxSizing: 'border-box',
            }} defaultValue="Michael" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: mutedColor, marginBottom: '6px' }}>Last Name</label>
            <input style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
              backgroundColor: isDarkMode ? '#2d3748' : '#fff',
              color: textColor,
              boxSizing: 'border-box',
            }} defaultValue="Kennedy" />
          </div>
        </div>
        
        {/* NEW: Side Hustle Section */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>💼</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: textColor }}>Side Hustle Settings</span>
          </div>
          
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            border: `2px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
            backgroundColor: isDarkMode ? '#2d3748' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{config.icon}</span>
              <span style={{ fontWeight: '500', color: textColor }}>{config.name}</span>
            </div>
            <span style={{ color: mutedColor }}>▼</span>
          </div>
          
          <p style={{ fontSize: '13px', color: mutedColor, marginTop: '8px' }}>
            This customizes your Command Center with industry-specific terms, 
            tax deductions, and tips tailored to your hustle!
          </p>
        </div>
        
        <button style={{
          width: '100%',
          padding: '14px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '24px',
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
    }}>
      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        alignItems: 'center',
      }}>
        <DarkModeToggle 
          isDarkMode={isDarkMode} 
          onToggle={() => setIsDarkMode(!isDarkMode)} 
        />
        <button
          onClick={() => { setCurrentView('welcome'); setSelectedHustle(null); }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6366f1',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🔄 Reset Demo
        </button>
      </div>
      
      {/* Demo Label */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
        borderRadius: '20px',
        color: '#6366f1',
        fontSize: '13px',
        fontWeight: '600',
      }}>
        📱 DEMO: {
          currentView === 'welcome' ? 'Welcome Modal (Step 1)' :
          currentView === 'selection' ? 'Side Hustle Selection (Step 2)' :
          currentView === 'command' ? 'Command Center Dashboard' :
          'Manage Account Modal'
        }
      </div>
      
      {/* Current View */}
      {currentView === 'welcome' && renderWelcomeStep1()}
      {currentView === 'selection' && renderSelection()}
      {currentView === 'command' && renderCommandCenter()}
      {currentView === 'manage' && renderManageAccount()}
      
      {/* Legend */}
      <div style={{
        marginTop: '40px',
        padding: '24px',
        backgroundColor: cardBg,
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
      }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: textColor, marginBottom: '16px' }}>
          🎯 What This Demo Shows
        </div>
        <ul style={{ color: mutedColor, lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
          <li><strong style={{ color: textColor }}>Welcome Modal</strong> - First-time users are asked about their side hustle</li>
          <li><strong style={{ color: textColor }}>Side Hustle Selection</strong> - Beautiful categorized selection with search</li>
          <li><strong style={{ color: textColor }}>Dynamic Command Center</strong> - Terminology adapts to selected profession</li>
          <li><strong style={{ color: textColor }}>Manage Account</strong> - Users can update their hustle anytime</li>
        </ul>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: isDarkMode ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)',
          borderRadius: '8px',
          borderLeft: '4px solid #22c55e'
        }}>
          <div style={{ color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>✅ Try It!</div>
          <div style={{ color: mutedColor, fontSize: '14px' }}>
            Click "Yes, I have a side hustle!" → Select different professions → See how the Command Center adapts!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideHustleDemo;
