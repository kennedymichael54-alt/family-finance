import React, { useState } from 'react';

// ============================================================================
// COLLAPSIBLE SECTION - Main reusable component matching BizBudget Hub style
// ============================================================================
export function CollapsibleSection({ 
  title, 
  icon, 
  badge, 
  badgeColor = '#8B5CF6',
  defaultExpanded = true, 
  children, 
  isDarkMode = false,
  headerRight,
  noPadding = false,
  gradient = 'linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)',
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={className} style={{ marginBottom: isExpanded ? '24px' : '16px' }}>
      {/* Collapsible Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: isExpanded ? '16px' : '0',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '4px 0'
        }}
      >
        {/* Gradient accent bar */}
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: gradient, 
          borderRadius: '2px',
          flexShrink: 0
        }} />
        
        {/* Icon */}
        {icon && (
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
        )}
        
        {/* Title */}
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: isDarkMode ? '#F9FAFB' : '#111827', 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>{title}</h2>
        
        {/* Badge */}
        {badge && (
          <span style={{ 
            fontSize: '12px', 
            color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#6B7280',
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '500'
          }}>{badge}</span>
        )}
        
        {/* Header Right Actions (stop propagation to prevent collapse) */}
        {headerRight && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ marginLeft: 'auto', marginRight: '12px' }}
          >
            {headerRight}
          </div>
        )}
        
        {/* Chevron */}
        <span style={{ 
          marginLeft: headerRight ? '0' : 'auto', 
          fontSize: '12px', 
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#9CA3AF',
          transition: 'transform 0.2s ease',
          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
        }}>▼</span>
      </div>
      
      {/* Collapsible Content */}
      <div style={{
        maxHeight: isExpanded ? '5000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease'
      }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// COLLAPSIBLE CARD - Simpler inline version with accent border
// ============================================================================
export function CollapsibleCard({ 
  title, 
  subtitle,
  icon, 
  defaultExpanded = true, 
  children, 
  isDarkMode = false,
  accentColor = '#8B5CF6'
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{
      background: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
      borderLeft: `3px solid ${accentColor}`,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '16px',
          cursor: 'pointer',
          userSelect: 'none',
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
        }}
      >
        {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: '600', 
            color: isDarkMode ? '#F9FAFB' : '#111827' 
          }}>{title}</div>
          {subtitle && (
            <div style={{ 
              fontSize: '13px', 
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#6B7280',
              marginTop: '2px'
            }}>{subtitle}</div>
          )}
        </div>
        <span style={{ 
          fontSize: '12px', 
          color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
        }}>▼</span>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div style={{ 
          padding: '0 16px 16px',
          borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6'}`
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STAT CARD - Gradient background stat card (like the ones in dashboard)
// ============================================================================
export function StatCard({ 
  title, 
  value, 
  subtitle,
  icon, 
  colorScheme = 'purple',
  isDarkMode = false 
}) {
  const schemes = {
    purple: {
      bg: isDarkMode ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
      iconBg: isDarkMode ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
      textColor: isDarkMode ? '#D8B4FE' : '#7B1FA2',
      valueColor: isDarkMode ? '#F3E5F5' : '#4A148C',
      border: isDarkMode ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
      shadow: 'rgba(156, 39, 176, 0.15)'
    },
    green: {
      bg: isDarkMode ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      iconBg: isDarkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
      textColor: isDarkMode ? '#86EFAC' : '#2E7D32',
      valueColor: isDarkMode ? '#E8F5E9' : '#1B5E20',
      border: isDarkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
      shadow: 'rgba(76, 175, 80, 0.15)'
    },
    blue: {
      bg: isDarkMode ? 'linear-gradient(135deg, #1E3A5F 0%, #1E40AF 100%)' : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      iconBg: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      textColor: isDarkMode ? '#93C5FD' : '#1565C0',
      valueColor: isDarkMode ? '#E3F2FD' : '#0D47A1',
      border: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      shadow: 'rgba(59, 130, 246, 0.15)'
    },
    orange: {
      bg: isDarkMode ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      iconBg: isDarkMode ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
      textColor: isDarkMode ? '#FDBA74' : '#E65100',
      valueColor: isDarkMode ? '#FFF3E0' : '#BF360C',
      border: isDarkMode ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
      shadow: 'rgba(255, 152, 0, 0.15)'
    },
    pink: {
      bg: isDarkMode ? 'linear-gradient(135deg, #831843 0%, #701A3A 100%)' : 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)',
      iconBg: isDarkMode ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
      textColor: isDarkMode ? '#F9A8D4' : '#C2185B',
      valueColor: isDarkMode ? '#FCE4EC' : '#880E4F',
      border: isDarkMode ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
      shadow: 'rgba(236, 72, 153, 0.15)'
    },
    cyan: {
      bg: isDarkMode ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
      iconBg: isDarkMode ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
      textColor: isDarkMode ? '#67E8F9' : '#00838F',
      valueColor: isDarkMode ? '#E0F7FA' : '#006064',
      border: isDarkMode ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
      shadow: 'rgba(0, 188, 212, 0.15)'
    },
    red: {
      bg: isDarkMode ? 'linear-gradient(135deg, #7F1D1D 0%, #6B1A1A 100%)' : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
      iconBg: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      textColor: isDarkMode ? '#FCA5A5' : '#C62828',
      valueColor: isDarkMode ? '#FFEBEE' : '#B71C1C',
      border: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      shadow: 'rgba(239, 68, 68, 0.15)'
    }
  };
  
  const scheme = schemes[colorScheme] || schemes.purple;

  return (
    <div style={{
      background: scheme.bg,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: `0 4px 20px ${scheme.shadow}`,
      border: `1px solid ${scheme.border}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: scheme.iconBg,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '18px' 
        }}>{icon}</div>
        <span style={{ 
          fontSize: '14px', 
          color: scheme.textColor, 
          fontWeight: '600' 
        }}>{title}</span>
      </div>
      <div style={{ 
        fontSize: '28px', 
        fontWeight: '700', 
        color: scheme.valueColor 
      }}>{value}</div>
      {subtitle && (
        <div style={{ 
          fontSize: '12px', 
          color: scheme.textColor, 
          marginTop: '4px' 
        }}>{subtitle}</div>
      )}
    </div>
  );
}

// ============================================================================
// CONTENT CARD - Card wrapper with gradient top accent
// ============================================================================
export function ContentCard({ 
  children, 
  gradient = 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
  isDarkMode = false,
  noPadding = false
}) {
  return (
    <div style={{
      background: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: '16px',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: gradient
      }} />
      <div style={{ padding: noPadding ? '0' : '24px' }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE - Consistent empty state component
// ============================================================================
export function EmptyState({ 
  icon = '📋', 
  title = 'No data yet', 
  description = 'Data will appear here once available.',
  action,
  isDarkMode = false 
}) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px' 
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: isDarkMode ? '#F9FAFB' : '#111827', 
        marginBottom: '8px' 
      }}>{title}</h3>
      <p style={{ 
        fontSize: '14px', 
        color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#6B7280', 
        marginBottom: action ? '20px' : '0' 
      }}>{description}</p>
      {action}
    </div>
  );
}

export default {
  CollapsibleSection,
  CollapsibleCard,
  StatCard,
  ContentCard,
  EmptyState
};
