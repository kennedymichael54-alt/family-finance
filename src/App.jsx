import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
const initSupabase = async () => {
  if (supabase) return supabase;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabase;
  } catch (e) {
    return null;
  }
};

// Haptic feedback
const haptic = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  heavy: () => navigator.vibrate?.([30, 10, 30]),
  success: () => navigator.vibrate?.([10, 50, 20]),
  error: () => navigator.vibrate?.([50, 30, 50]),
};

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

// ============================================
// LOGO COMPONENT - Family Tree
// ============================================
function Logo({ size = 48, onClick, className = '' }) {
  return (
    <button
      onClick={() => { haptic.light(); onClick?.(); }}
      className={`flex-shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#EC4899"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="60" fill="url(#logoGrad)"/>
        <ellipse cx="60" cy="38" rx="28" ry="22" fill="white"/>
        <ellipse cx="42" cy="48" rx="16" ry="14" fill="white"/>
        <ellipse cx="78" cy="48" rx="16" ry="14" fill="white"/>
        <ellipse cx="50" cy="32" rx="12" ry="10" fill="white"/>
        <ellipse cx="70" cy="32" rx="12" ry="10" fill="white"/>
        <path d="M54 58 L54 78 L66 78 L66 58 Z" fill="white"/>
        <path d="M48 78 L54 68 L54 78 Z" fill="white"/>
        <path d="M72 78 L66 68 L66 78 Z" fill="white"/>
        <circle cx="45" cy="88" r="5" fill="white"/>
        <path d="M45 93 L45 105 M40 98 L50 98" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="75" cy="88" r="5" fill="white"/>
        <path d="M75 93 L75 105 M70 98 L80 98" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="60" cy="92" r="4" fill="white"/>
        <path d="M60 96 L60 105 M56 100 L64 100" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="text-center">
            <Logo size={64} className="mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-black rounded-full font-medium">
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// LANDING PAGE CHATBOT
// ============================================
function LandingChatbot({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm the Family Finance assistant. Ask me anything about our products, pricing, or features!" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    let response = "Great question! Our team is here to help. For detailed inquiries, start your free trial and our support team will assist you personally.";

    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
      response = "💰 **Pricing:**\n\n• **HomeBudget Hub**: $9.99/mo (or $99/year - save 17%)\n• **BusinessBudget Hub**: +$4.99/mo add-on\n• **REAnalyzer Hub**: +$6.99/mo add-on\n\nAll plans include a **14-day free trial** with no credit card required!";
    } else if (q.includes('free') || q.includes('trial')) {
      response = "🎉 Yes! We offer a **14-day free trial** with full access to HomeBudget Hub. No credit card required to start. You can cancel anytime during the trial.";
    } else if (q.includes('family') || q.includes('share') || q.includes('member')) {
      response = "👨‍👩‍👧‍👦 Family sharing is included! You can add up to **5 family members** at no extra cost. Everyone gets their own login while sharing the same financial dashboard.";
    } else if (q.includes('bank') || q.includes('connect') || q.includes('sync')) {
      response = "🏦 We support **unlimited bank connections** with real-time transaction sync. We use bank-level 256-bit encryption to keep your data secure.";
    } else if (q.includes('cancel')) {
      response = "✅ You can cancel anytime with no questions asked. If you're on an annual plan, you'll receive a prorated refund for remaining months.";
    } else if (q.includes('security') || q.includes('safe') || q.includes('privacy')) {
      response = "🔒 Your security is our priority:\n\n• 256-bit bank-level encryption\n• We never sell your data\n• Read-only access to accounts\n• SOC 2 compliant infrastructure";
    } else if (q.includes('different') || q.includes('monarch') || q.includes('mint') || q.includes('ynab')) {
      response = "🌟 What makes us different:\n\n• **3 specialized hubs** vs 1 generic tool\n• **$5/month cheaper** than competitors\n• **Family-first design** built for households\n• **Real estate tools** for investors\n• **No ads**, we never sell your data";
    } else if (q.includes('business') || q.includes('small business') || q.includes('smb')) {
      response = "💼 **BusinessBudget Hub** (coming soon!) is designed for small to medium businesses. Features include:\n\n• Cash flow forecasting\n• Expense management\n• Team access controls\n• Financial reports & invoicing\n\nJoin the waitlist for early access!";
    } else if (q.includes('real estate') || q.includes('property') || q.includes('invest')) {
      response = "🏢 **REAnalyzer Hub** (coming soon!) is perfect for real estate agents and investors:\n\n• Property analysis calculator\n• ROI & cap rate tools\n• Rental income tracking\n• Market comparisons\n\nJoin the waitlist to get early access!";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-slate-900/98 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col max-h-[500px]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">🤖</div>
          <div>
            <p className="font-semibold text-white text-sm">Family Finance AI</p>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
              m.role === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm' 
                : 'bg-white/10 text-white/90 rounded-bl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about pricing, features..."
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50"
        />
        <button onClick={handleSend} className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-sm">
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================
// LANDING PAGE
// ============================================
function LandingPage({ onNavigateToAuth }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState({ home: true, business: false, reanalyzer: false });
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const products = {
    home: { name: 'HomeBudget Hub', monthlyPrice: 9.99, icon: '🏠', status: 'popular' },
    business: { name: 'BusinessBudget Hub', monthlyPrice: 4.99, icon: '💼', status: 'coming-soon', addon: true },
    reanalyzer: { name: 'REAnalyzer Hub', monthlyPrice: 6.99, icon: '🏢', status: 'coming-soon', addon: true }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedProducts.home) total += products.home.monthlyPrice;
    if (selectedProducts.business) total += products.business.monthlyPrice;
    if (selectedProducts.reanalyzer) total += products.reanalyzer.monthlyPrice;
    if (isAnnual) total = total * 0.83; // 17% discount
    return total.toFixed(2);
  };

  const faqs = [
    { q: "How does the 14-day free trial work?", a: "Start using Family Finance immediately with full access to all features. No credit card required. If you love it, choose a plan before your trial ends. If not, no worries—you won't be charged." },
    { q: "Can I share with my family?", a: "Absolutely! All plans include sharing with up to 5 family members at no extra cost. Each person gets their own login while viewing shared financial data." },
    { q: "Is my financial data secure?", a: "Yes! We use 256-bit bank-level encryption, never sell your data, and only request read-only access to your accounts. We're SOC 2 compliant." },
    { q: "Can I connect all my bank accounts?", a: "Yes! We support unlimited bank connections including checking, savings, credit cards, investments, and loans from over 10,000 financial institutions." },
    { q: "What if I want to cancel?", a: "Cancel anytime with no questions asked. Annual subscribers receive a prorated refund for remaining months." },
    { q: "What's coming in BusinessBudget Hub?", a: "BusinessBudget Hub will include cash flow forecasting, expense management, team access, invoicing, and financial reports designed for small businesses." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Family Finance
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm">Features</a>
            <a href="#pricing" className="text-white/60 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#faq" className="text-white/60 hover:text-white transition-colors text-sm">FAQ</a>
          </div>
          <button
            onClick={() => onNavigateToAuth('login')}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium transition-all"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background with family image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
            alt="Happy family"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#0a0a1a]/90 to-[#0a0a1a]/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a]/50"></div>
          {/* Purple glow effects */}
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-emerald-400">Trusted by 10,000+ families</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Family's
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Financial Command Center
              </span>
            </h1>

            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto lg:mx-0">
              Three powerful hubs. One simple app. Take control of your home budget, track investments, and analyze real estate—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                Start Free Trial <span>→</span>
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span>▶</span> Watch Demo
              </button>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div>
                <div className="text-2xl font-bold">$2.4B+</div>
                <div className="text-white/40 text-sm">Assets Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold flex items-center gap-1">4.9<span className="text-yellow-400">★</span></div>
                <div className="text-white/40 text-sm">App Store</div>
              </div>
              <div>
                <div className="text-2xl font-bold">256-bit</div>
                <div className="text-white/40 text-sm">Encryption</div>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-white/80">Dashboard</span>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-4">
                <div className="text-white/70 text-sm mb-1">Net Worth</div>
                <div className="text-3xl font-bold">$847,320</div>
                <div className="text-emerald-300 text-sm mt-1">+12.4%</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['🏠', '📈', '💳', '🎯'].map((icon, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-xl border border-white/10">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="features" className="py-24 px-6 relative">
        {/* Background family image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
            alt="Family at park"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0a0a1a]/95 to-[#0a0a1a]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm mb-4">
              <span className="text-purple-400">THREE POWERFUL HUBS</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Everything Your Family Needs</h2>
            <p className="text-white/50 text-lg">Purpose-built tools for modern family finances</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* HomeBudget Hub - Most Popular */}
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold">
                Most Popular
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl mb-6">
                🏠
              </div>
              <h3 className="text-2xl font-bold mb-2">HomeBudget Hub</h3>
              <p className="text-white/50 mb-6">Track spending, manage bills, and build budgets that actually work for your family.</p>
              <ul className="space-y-3">
                {['Automatic transaction categorization', 'Bill reminders & payment tracking', 'Family spending insights', 'Goal setting & progress tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* BusinessBudget Hub - Coming Soon */}
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all opacity-90">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400">
                Coming Soon
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-3xl mb-6">
                💼
              </div>
              <h3 className="text-2xl font-bold mb-2">BusinessBudget Hub</h3>
              <p className="text-white/50 mb-6">Monitor portfolios, track performance, and make smarter business decisions.</p>
              <ul className="space-y-3">
                {['Cash flow forecasting', 'Expense management', 'Team access controls', 'Financial reports & invoicing'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* REAnalyzer Hub - Coming Soon */}
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all opacity-90">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400">
                Coming Soon
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-3xl mb-6">
                🏢
              </div>
              <h3 className="text-2xl font-bold mb-2">REAnalyzer Hub</h3>
              <p className="text-white/50 mb-6">Analyze properties, calculate returns, and build your real estate portfolio.</p>
              <ul className="space-y-3">
                {['Property analysis calculator', 'Rental income tracking', 'Market comparisons', 'Equity growth monitoring'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & FAQ Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f2a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm mb-4">
              <span className="text-purple-400">Simple Pricing</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">One Price. All Features.</h2>
            <p className="text-white/50 text-lg">No hidden fees, no upsells, no complexity</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
              {/* Annual/Monthly Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/50'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-purple-600' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${isAnnual ? 'left-8' : 'left-1'}`} />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/50'}`}>
                  Annual <span className="text-emerald-400 text-xs">(save 17%)</span>
                </span>
              </div>

              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-2">
                  <span className="text-white/50 text-2xl">$</span>
                  {calculateTotal()}
                  <span className="text-white/50 text-xl">/mo</span>
                </div>
                {isAnnual && (
                  <p className="text-white/50 text-sm">Billed ${(parseFloat(calculateTotal()) * 12).toFixed(2)}/year</p>
                )}
              </div>

              {/* Product Selectors */}
              <div className="space-y-4 mb-8">
                {/* HomeBudget Hub */}
                <div 
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProducts.home 
                      ? 'bg-purple-500/20 border-purple-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedProducts(p => ({ ...p, home: true }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏠</span>
                      <div>
                        <p className="font-semibold">HomeBudget Hub</p>
                        <p className="text-sm text-white/50">Core family budgeting</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${isAnnual ? (9.99 * 0.83).toFixed(2) : '9.99'}/mo</p>
                      <span className="text-xs text-emerald-400">Included</span>
                    </div>
                  </div>
                </div>

                {/* BusinessBudget Hub */}
                <div 
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProducts.business 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedProducts(p => ({ ...p, business: !p.business }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💼</span>
                      <div>
                        <p className="font-semibold">BusinessBudget Hub</p>
                        <p className="text-sm text-white/50">SMB add-on • Coming Soon</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">+${isAnnual ? (4.99 * 0.83).toFixed(2) : '4.99'}/mo</p>
                      <span className="text-xs text-amber-400">Optional</span>
                    </div>
                  </div>
                </div>

                {/* REAnalyzer Hub */}
                <div 
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProducts.reanalyzer 
                      ? 'bg-orange-500/20 border-orange-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedProducts(p => ({ ...p, reanalyzer: !p.reanalyzer }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="font-semibold">REAnalyzer Hub</p>
                        <p className="text-sm text-white/50">Real estate add-on • Coming Soon</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">+${isAnnual ? (6.99 * 0.83).toFixed(2) : '6.99'}/mo</p>
                      <span className="text-xs text-amber-400">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {[
                  'All 3 Hubs included when available',
                  'Unlimited bank connections',
                  'Family sharing (up to 5 members)',
                  'Real-time transaction sync',
                  'Advanced analytics & reports',
                  'Priority support',
                  'Data export anytime'
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-purple-400">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigateToAuth('signup')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all"
              >
                Start 14-Day Free Trial
              </button>
              <p className="text-center text-white/40 text-sm mt-3">No credit card required</p>

              {/* Alternate Products */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-white/40 text-sm">
                  <span className="font-medium text-white/60">Alternate products:</span> Monarch Money ($14.99), YNAB ($14.99), Quicken ($5.99)
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              {faqs.map((faq, i) => (
                <div 
                  key={i}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.q}</span>
                    <span className={`text-xl transition-transform ${expandedFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 text-white/60 text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Family Image Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80"
            alt="Family together"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Built for Families Like Yours</h2>
          <p className="text-xl text-white/70 mb-10">
            Join thousands of families who've taken control of their financial future with Family Finance.
          </p>
          <button
            onClick={() => onNavigateToAuth('signup')}
            className="px-10 py-5 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-2xl"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="font-semibold">Family Finance</span>
          </div>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Security</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
          <div className="text-sm text-white/30">© 2024 Family Finance. All rights reserved.</div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <LandingChatbot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
}

// ============================================
// AUTH PAGE
// ============================================
function AuthPage({ mode = 'login', onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { setIsLogin(mode === 'login'); }, [mode]);

  const handleEmailAuth = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');

    try {
      const client = await initSupabase();
      if (!client) { setError('Service temporarily unavailable'); setLoading(false); return; }

      if (isLogin) {
        const { data, error: authError } = await client.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        haptic.success();
        onAuth(data.user);
      } else {
        const { data, error: authError } = await client.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        });
        if (authError) throw authError;
        if (data.user && !data.session) {
          setMessage('Check your email to confirm your account!');
        } else {
          haptic.success();
          onAuth(data.user);
        }
      }
    } catch (err) {
      haptic.error();
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const client = await initSupabase();
      if (!client) { setError('Service unavailable'); setLoading(false); return; }
      await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 py-4 px-6">
        <Logo size={44} onClick={onBack} />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Start your free trial'}</h1>
            <p className="text-white/50">{isLogin ? 'Sign in to continue' : '14 days free, then $9.99/month'}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">{error}</div>}
            {message && <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm">{message}</div>}

            <button onClick={handleGoogleAuth} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all disabled:opacity-50 mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/30 text-sm">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
              )}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" required minLength={6} />
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-white/50 hover:text-white text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="text-purple-400 font-medium">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// DASHBOARD (Simplified for this file)
// ============================================
function DashboardApp({ user, onSignOut, onGoHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const getUserName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  // Demo data
  const netWorth = 285420;
  const monthlyIncome = 5050;
  const monthlyExpenses = 2104;
  const savingsRate = 58.3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <header className="sticky top-0 z-30 pt-3 pb-3 bg-gradient-to-b from-slate-950 via-slate-950/98 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <Logo size={44} onClick={onGoHome} />
            <div className="flex-1">
              <h1 className="text-base font-bold">Family Finance</h1>
              <p className="text-purple-300/70 text-xs">Welcome, {getUserName()}!</p>
            </div>
            <button onClick={onSignOut} className="p-2.5 rounded-xl bg-white/5 border border-white/10">🚪</button>
          </div>

          <nav className="mt-3 flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
            {[{ id: 'dashboard', icon: '🏠' }, { id: 'networth', icon: '📈' }, { id: 'reports', icon: '📊' }, { id: 'settings', icon: '⚙️' }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' : 'text-purple-200/70'}`}>
                <span>{tab.icon}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="mt-4 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-2xl p-5 border border-purple-400/20">
              <div className="text-purple-200 text-sm mb-1">Net Worth</div>
              <div className="text-3xl font-bold">${netWorth.toLocaleString()}</div>
              <div className="text-emerald-300 text-sm mt-1">↑ 12.4%</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 rounded-2xl p-5 border border-indigo-400/20">
              <div className="text-indigo-200 text-xs mb-1">Cash Flow</div>
              <div className="text-xl font-bold text-emerald-300">+${(monthlyIncome - monthlyExpenses).toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-600/80 to-pink-600/80 rounded-2xl p-5 border border-pink-400/20">
              <div className="text-pink-200 text-xs mb-1">Savings</div>
              <div className="text-xl font-bold">{savingsRate}%</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="font-semibold mb-4">📊 Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-white/50 text-xs mb-1">Monthly Income</div>
                <div className="text-lg font-bold text-emerald-400">${monthlyIncome.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-white/50 text-xs mb-1">Monthly Expenses</div>
                <div className="text-lg font-bold text-rose-400">${monthlyExpenses.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function FamilyFinanceApp() {
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = await initSupabase();
        if (client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) { setUser(session.user); setView('dashboard'); }
          client.auth.onAuthStateChange((event, session) => {
            if (session?.user) { setUser(session.user); setView('dashboard'); }
            else if (event === 'SIGNED_OUT') { setUser(null); setView('landing'); }
          });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      const client = await initSupabase();
      if (client) await client.auth.signOut();
    } catch (e) {}
    setUser(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Logo size={64} className="animate-pulse" />
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <DashboardApp user={user} onSignOut={handleSignOut} onGoHome={() => setView('landing')} />;
  }

  if (view === 'auth') {
    return <AuthPage mode={authMode} onAuth={(u) => { setUser(u); setView('dashboard'); }} onBack={() => setView('landing')} />;
  }

  return <LandingPage onNavigateToAuth={(mode) => { setAuthMode(mode); setView('auth'); }} />;
}

// Styles
const styles = `
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 3s ease-in-out infinite; }
`;
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = styles;
  document.head.appendChild(s);
}

export default function App() {
  return <ErrorBoundary><FamilyFinanceApp /></ErrorBoundary>;
}
