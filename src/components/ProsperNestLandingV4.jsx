import React from 'react';

// Penny Logo Component - CONSISTENT ACROSS APP
// Use this same component everywhere for Penny
const PennyLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE135" />
        <stop offset="50%" stopColor="#FFEC8B" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
      </filter>
    </defs>
    {/* Main coin body */}
    <circle cx="32" cy="32" r="28" fill="url(#coinGrad)" filter="url(#coinShadow)"/>
    {/* Inner ring */}
    <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    {/* Dollar sign on forehead */}
    <text x="32" y="18" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="Arial">$</text>
    {/* Eyes */}
    <ellipse cx="24" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
    <ellipse cx="40" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
    {/* Eye shine */}
    <ellipse cx="25" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
    <ellipse cx="41" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
    {/* Smile */}
    <path d="M24 40 Q32 46 40 40" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Rosy cheeks */}
    <ellipse cx="17" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
    <ellipse cx="47" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
  </svg>
);

function ProsperNestLandingV4({ onNavigate }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', 
      color: 'white', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '20px 40px', 
          maxWidth: '1400px', 
          margin: '0 auto' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '700', 
              fontSize: '16px' 
            }}>
              PN
            </div>
            <span style={{ fontSize: '22px', fontWeight: '700' }}>ProsperNest</span>
          </div>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>Features</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>Pricing</a>
            <a href="#about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>About</a>
            <button 
              onClick={() => onNavigate('auth')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                color: 'white', 
                fontSize: '15px', 
                fontWeight: '500', 
                cursor: 'pointer' 
              }}
            >
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 40px', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '56px', 
              fontWeight: '800', 
              lineHeight: '1.1', 
              marginBottom: '24px' 
            }}>
              Your Financial Future,<br />
              <span style={{ 
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Made Simple
              </span>
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.7)', 
              lineHeight: '1.7', 
              marginBottom: '32px' 
            }}>
              Track expenses, set goals, and grow your wealth with Penny, your AI-powered financial assistant. Join thousands building their financial prosperity.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => onNavigate('auth')}
                style={{ 
                  padding: '16px 32px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
                  border: 'none', 
                  color: 'white', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)'
                }}
              >
                Get Started Free
              </button>
              <button style={{ 
                padding: '16px 32px', 
                borderRadius: '12px', 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.3)', 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: '500', 
                cursor: 'pointer' 
              }}>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Penny Mascot - Using consistent logo */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <div style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Floating animation wrapper */}
              <div style={{
                animation: 'float 3s ease-in-out infinite'
              }}>
                <PennyLogo size={200} />
              </div>
              
              {/* Speech bubble */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '-20px',
                background: 'white',
                borderRadius: '16px',
                padding: '12px 16px',
                color: '#1a1a1a',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                Hi! I'm Penny! 🪙
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '20px',
                  width: '0',
                  height: '0',
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid white'
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 40px' 
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '40px', 
            fontWeight: '700', 
            marginBottom: '60px' 
          }}>
            Everything You Need
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px' 
          }}>
            {[
              { icon: '📊', title: 'Smart Analytics', desc: 'AI-powered insights into your spending habits' },
              { icon: '🎯', title: 'Goal Tracking', desc: 'Set and achieve your financial goals with ease' },
              { icon: '💰', title: 'Budget Management', desc: 'Stay on track with intelligent budgeting tools' },
              { icon: '🔒', title: 'Bank-Level Security', desc: 'Your data is encrypted and secure' },
              { icon: '📱', title: 'Cross-Device Sync', desc: 'Access anywhere on any device' },
              { icon: '🤖', title: 'AI Assistant', desc: 'Chat with Penny for personalized advice' }
            ].map((feature, i) => (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '20px', 
                padding: '32px', 
                border: '1px solid rgba(255,255,255,0.1)' 
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 40px', 
          textAlign: 'center' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))', 
            borderRadius: '32px', 
            padding: '60px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <PennyLogo size={80} />
            <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '24px 0 16px' }}>
              Ready to Take Control?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '32px' }}>
              Join ProsperNest today and let Penny guide you to financial freedom.
            </p>
            <button 
              onClick={() => onNavigate('auth')}
              style={{ 
                padding: '18px 40px', 
                borderRadius: '14px', 
                background: 'white', 
                border: 'none', 
                color: '#4c1d95', 
                fontSize: '17px', 
                fontWeight: '700', 
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              Start Free Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          padding: '40px', 
          textAlign: 'center' 
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            © 2024 ProsperNest. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default ProsperNestLandingV4;
