import React from 'react';

// ============================================================================
// EMPTY STATE COMPONENT
// Shows when there's no data for a section
// ============================================================================

export default function EmptyState({ 
  icon = '📊', 
  title = 'No data yet', 
  message = 'Import your transactions to get started',
  actionLabel = null,
  onAction = null 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      textAlign: 'center',
      background: 'rgba(30, 27, 56, 0.5)',
      borderRadius: '20px',
      border: '1px dashed rgba(255,255,255,0.2)'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px',
        opacity: 0.8
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: 'white',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '15px',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: '300px',
        lineHeight: 1.5,
        marginBottom: actionLabel ? '24px' : '0'
      }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
