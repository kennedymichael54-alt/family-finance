import React, { useState } from 'react';

/**
 * SharingIndicator - Shows who has access to the current hub
 * BizBudget: Michael, Anthony, Tucker + Invite
 * HomeBudget: Partner + Invite (for couples)
 */
const SharingIndicator = ({ 
  hubType = 'home', // 'home' or 'biz'
  theme,
  members = [], // Array of { name, avatar, role, isOnline }
  onInvite,
  currentUser = 'Michael'
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isDark = theme?.mode === 'dark';

  // Default members based on hub type
  const defaultMembers = hubType === 'biz' 
    ? [
        { name: 'Michael', avatar: '👨‍💼', role: 'Owner', isOnline: true },
        { name: 'Anthony', avatar: '👨‍💻', role: 'Partner', isOnline: true },
        { name: 'Tucker', avatar: '🧑‍💼', role: 'Agent', isOnline: false },
      ]
    : [
        { name: 'You', avatar: '👤', role: 'Owner', isOnline: true },
        // Partner would be added when invited
      ];

  const displayMembers = members.length > 0 ? members : defaultMembers;
  const otherMembers = displayMembers.filter(m => m.name !== currentUser && m.name !== 'You');

  return (
    <div style={{ position: 'relative' }}>
      {/* Sharing Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Stacked Avatars */}
        <div style={{ display: 'flex', marginRight: '4px' }}>
          {displayMembers.slice(0, 3).map((member, index) => (
            <div
              key={member.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isDark 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                marginLeft: index > 0 ? '-8px' : '0',
                border: `2px solid ${isDark ? '#1a1a2e' : '#ffffff'}`,
                position: 'relative',
                zIndex: 3 - index
              }}
              title={member.name}
            >
              {member.avatar}
              {/* Online indicator */}
              {member.isOnline && (
                <div style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  border: `2px solid ${isDark ? '#1a1a2e' : '#ffffff'}`
                }} />
              )}
            </div>
          ))}
          {displayMembers.length > 3 && (
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '600',
              marginLeft: '-8px',
              border: `2px solid ${isDark ? '#1a1a2e' : '#ffffff'}`,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }}>
              +{displayMembers.length - 3}
            </div>
          )}
        </div>

        {/* Label */}
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }}>
          {hubType === 'biz' ? 'Team' : 'Shared'}
        </span>

        {/* Dropdown Arrow */}
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99
            }}
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Content */}
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: isDark 
              ? 'linear-gradient(135deg, #1e1e3f 0%, #1a1a2e 100%)'
              : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '14px',
            padding: '8px',
            minWidth: '220px',
            boxShadow: isDark 
              ? '0 10px 40px rgba(0, 0, 0, 0.5)'
              : '0 10px 40px rgba(0, 0, 0, 0.15)',
            zIndex: 100
          }}>
            {/* Header */}
            <div style={{
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: '600',
              color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              marginBottom: '4px'
            }}>
              {hubType === 'biz' ? 'Team Members' : 'Sharing With'}
            </div>

            {/* Members List */}
            {displayMembers.map(member => (
              <div
                key={member.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isDark 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  position: 'relative'
                }}>
                  {member.avatar}
                  {member.isOnline && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '10px',
                      height: '10px',
                      background: '#22c55e',
                      borderRadius: '50%',
                      border: `2px solid ${isDark ? '#1a1a2e' : '#ffffff'}`
                    }} />
                  )}
                </div>

                {/* Name & Role */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDark ? '#ffffff' : '#1f2937'
                  }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  }}>
                    {member.role}
                  </div>
                </div>

                {/* Status Badge */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: '500',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: member.isOnline 
                    ? 'rgba(34, 197, 94, 0.15)'
                    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                  color: member.isOnline 
                    ? '#22c55e'
                    : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')
                }}>
                  {member.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}

            {/* Invite Button */}
            <button
              onClick={() => {
                setShowDropdown(false);
                onInvite?.();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                marginTop: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>+</span>
              Invite {hubType === 'biz' ? 'Team Member' : 'Partner'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SharingIndicator;
