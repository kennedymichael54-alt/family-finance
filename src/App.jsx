import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

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

const haptic = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  success: () => navigator.vibrate?.([10, 50, 20]),
  error: () => navigator.vibrate?.([50, 30, 50]),
};

// ============================================
// LOGO COMPONENT
// ============================================
function Logo({ size = 40, onClick }) {
  return (
    <button onClick={onClick} className="flex-shrink-0">
      <svg viewBox="0 0 120 120" fill="none" style={{ width: size, height: size }}>
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
        <circle cx="45" cy="88" r="5" fill="white"/>
        <path d="M45 93 L45 102" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="75" cy="88" r="5" fill="white"/>
        <path d="M75 93 L75 102" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="60" cy="90" r="4" fill="white"/>
        <path d="M60 94 L60 102" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="text-center">
            <Logo size={64} />
            <h2 className="text-xl font-semibold text-white mt-4 mb-2">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium mt-4">
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
// AI CHATBOT
// ============================================
function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm the Family Finance assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    let response = "I'd be happy to help! Feel free to ask about our pricing, features, or how to get started.";

    if (q.includes('price') || q.includes('cost')) {
      response = "💰 Our pricing is simple:\n\n• HomeBudget Hub: $9.99/mo\n• BusinessBudget Hub: +$4.99/mo\n• REAnalyzer Hub: +$6.99/mo\n\nSave 17% with annual billing! All plans include a 14-day free trial.";
    } else if (q.includes('free') || q.includes('trial')) {
      response = "🎉 Yes! We offer a 14-day free trial with full access. No credit card required to start!";
    } else if (q.includes('family') || q.includes('share')) {
      response = "👨‍👩‍👧‍👦 All plans include family sharing for up to 5 members at no extra cost!";
    } else if (q.includes('security') || q.includes('safe')) {
      response = "🔒 We use 256-bit bank-level encryption. We never sell your data and only use read-only access.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-semibold text-white">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white text-xl">×</button>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
              m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white/90'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-700 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500"
        />
        <button onClick={handleSend} className="px-3 py-2 bg-purple-600 rounded-lg text-sm font-medium">
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
  const [chatOpen, setChatOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    { q: "How does the free trial work?", a: "Start with 14 days of full access. No credit card required. Cancel anytime." },
    { q: "Can I share with my family?", a: "Yes! All plans include sharing with up to 5 family members at no extra cost." },
    { q: "Is my data secure?", a: "Absolutely. We use 256-bit encryption and never sell your data." },
    { q: "Can I cancel anytime?", a: "Yes, cancel anytime. Annual subscribers get a prorated refund." },
    { q: "What banks do you support?", a: "We support 10,000+ financial institutions including all major banks." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="text-lg font-bold">Family Finance</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button
            onClick={() => onNavigateToAuth('login')}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all border border-white/10"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image - Family at Beach Sunset */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
            alt="Family at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-sm text-emerald-400 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Trusted by 10,000+ families
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Family's{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Financial Command Center
              </span>
            </h1>

            <p className="text-lg text-white/60 mb-8 max-w-xl">
              Three powerful hubs. One simple app. Take control of your home budget, track investments, and analyze real estate—all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
              >
                Start Free Trial →
              </button>
              <button className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                ▶ Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
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

          {/* Right Side - Dashboard Preview */}
          <div className="hidden lg:block">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-4">
                <div className="text-white/70 text-sm">Net Worth</div>
                <div className="text-4xl font-bold">$847,320</div>
                <div className="text-emerald-300 text-sm mt-1">+12.4% this year</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['🏠', '📈', '💳', '🎯'].map((icon, i) => (
                  <div key={i} className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center text-2xl">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400 mb-4">
              THREE POWERFUL HUBS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Everything Your Family Needs</h2>
            <p className="text-white/50 text-lg">Purpose-built tools for modern family finances</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* HomeBudget Hub */}
            <div className="relative bg-slate-900/80 rounded-3xl p-8 border border-purple-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold">
                Most Popular
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl mb-6">
                🏠
              </div>
              <h3 className="text-xl font-bold mb-2">HomeBudget Hub</h3>
              <p className="text-white/50 text-sm mb-6">Track spending, manage bills, and build budgets that work for your family.</p>
              <ul className="space-y-2">
                {['Automatic categorization', 'Bill reminders', 'Family insights', 'Goal tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* BusinessBudget Hub */}
            <div className="relative bg-slate-900/50 rounded-3xl p-8 border border-white/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500/30 border border-amber-500/50 rounded-full text-xs font-medium text-amber-300">
                Coming Soon
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl mb-6">
                💼
              </div>
              <h3 className="text-xl font-bold mb-2">BusinessBudget Hub</h3>
              <p className="text-white/50 text-sm mb-6">Powerful tools for small and medium business finances.</p>
              <ul className="space-y-2">
                {['Cash flow forecasting', 'Expense management', 'Team access', 'Financial reports'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* REAnalyzer Hub */}
            <div className="relative bg-slate-900/50 rounded-3xl p-8 border border-white/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500/30 border border-amber-500/50 rounded-full text-xs font-medium text-amber-300">
                Coming Soon
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl mb-6">
                🏢
              </div>
              <h3 className="text-xl font-bold mb-2">REAnalyzer Hub</h3>
              <p className="text-white/50 text-sm mb-6">Analyze properties and build your real estate portfolio.</p>
              <ul className="space-y-2">
                {['Property analysis', 'ROI calculator', 'Market comparisons', 'Equity tracking'].map((f, i) => (
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
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400 mb-4">
              Simple Pricing
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">One Price. All Features.</h2>
            <p className="text-white/50">No hidden fees, no upsells, no complexity</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pricing Card */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-purple-500/30">
              {/* Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/50'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/50'}`}>
                  Annual <span className="text-emerald-400">(save 17%)</span>
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold">
                  ${isAnnual ? '8.29' : '9.99'}
                  <span className="text-xl text-white/50">/mo</span>
                </div>
                {isAnnual && <p className="text-white/50 text-sm mt-1">Billed $99/year</p>}
              </div>

              {/* Products */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">HomeBudget Hub</span>
                  </div>
                  <span className="text-emerald-400 text-sm">Included</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💼</span>
                    <div>
                      <span className="font-medium">BusinessBudget Hub</span>
                      <span className="text-amber-400 text-xs ml-2">Coming Soon</span>
                    </div>
                  </div>
                  <span className="text-white/50 text-sm">+$4.99/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <div>
                      <span className="font-medium">REAnalyzer Hub</span>
                      <span className="text-amber-400 text-xs ml-2">Coming Soon</span>
                    </div>
                  </div>
                  <span className="text-white/50 text-sm">+$6.99/mo</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {['Unlimited bank connections', 'Family sharing (5 members)', 'Real-time sync', 'Priority support', 'Data export'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-purple-400">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigateToAuth('signup')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
              >
                Start 14-Day Free Trial
              </button>
              <p className="text-center text-white/40 text-sm mt-3">No credit card required</p>

              {/* Alternatives */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs">
                  <span className="text-white/60">Alternate products:</span> Monarch ($14.99), YNAB ($14.99), Quicken ($5.99)
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium">{faq.q}</span>
                      <span className={`transition-transform ${expandedFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 text-white/60 text-sm">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80"
            alt="Happy family"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Take Control?</h2>
          <p className="text-xl text-white/70 mb-8">Join thousands of families building a better financial future.</p>
          <button
            onClick={() => onNavigateToAuth('signup')}
            className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-white/90 transition-all"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-semibold">Family Finance</span>
          </div>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Security</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
          <div className="text-sm text-white/30">© 2024 Family Finance</div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        {chatOpen ? '×' : '💬'}
      </button>
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');

    try {
      const client = await initSupabase();
      if (!client) { setError('Service unavailable'); setLoading(false); return; }

      if (isLogin) {
        const { data, error: authError } = await client.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
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
          onAuth(data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const client = await initSupabase();
      if (client) {
        await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950"></div>

      <header className="relative z-10 p-6">
        <button onClick={onBack} className="flex items-center gap-2">
          <Logo size={40} />
          <span className="font-semibold">Family Finance</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">{isLogin ? 'Welcome back' : 'Start your free trial'}</h1>
          <p className="text-white/50 text-center mb-8">{isLogin ? 'Sign in to continue' : '14 days free, then $9.99/month'}</p>

          <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-8 border border-white/10">
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">{error}</div>}
            {message && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">{message}</div>}

            <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 rounded-xl font-medium mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/30 text-sm">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" />
              )}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" required />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" required minLength={6} />
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold disabled:opacity-50">
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-purple-400">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ user, onSignOut, onGoHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <header className="sticky top-0 z-30 py-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size={40} onClick={onGoHome} />
              <div>
                <h1 className="font-bold">Family Finance</h1>
                <p className="text-purple-300/70 text-sm">Welcome, {userName}!</p>
              </div>
            </div>
            <button onClick={onSignOut} className="p-2 rounded-xl bg-white/10 border border-white/10">🚪</button>
          </div>

          <nav className="mt-4 flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            {[{ id: 'dashboard', icon: '🏠', label: 'Home' }, { id: 'networth', icon: '📈', label: 'Worth' }, { id: 'reports', icon: '📊', label: 'Reports' }, { id: 'settings', icon: '⚙️', label: 'Settings' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-purple-600' : 'hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6">
              <div className="text-purple-200 text-sm mb-1">Net Worth</div>
              <div className="text-3xl font-bold">$285,420</div>
              <div className="text-emerald-300 text-sm mt-1">↑ 12.4%</div>
            </div>
            <div className="bg-indigo-600/80 rounded-2xl p-6">
              <div className="text-indigo-200 text-sm mb-1">Cash Flow</div>
              <div className="text-2xl font-bold text-emerald-300">+$2,946</div>
            </div>
            <div className="bg-fuchsia-600/80 rounded-2xl p-6">
              <div className="text-fuchsia-200 text-sm mb-1">Savings Rate</div>
              <div className="text-2xl font-bold">58.3%</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-semibold mb-4">📊 Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: '🛒', name: 'Grocery Store', amount: -127.43 },
                { icon: '💼', name: 'Salary Deposit', amount: 4250 },
                { icon: '📺', name: 'Netflix', amount: -15.99 },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <span>{t.name}</span>
                  </div>
                  <span className={t.amount > 0 ? 'text-emerald-400' : ''}>{t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}</span>
                </div>
              ))}
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
function App() {
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
      } catch (e) {}
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const client = await initSupabase();
    if (client) await client.auth.signOut();
    setUser(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Logo size={64} />
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => setView('landing')} />;
  }

  if (view === 'auth') {
    return <AuthPage mode={authMode} onAuth={u => { setUser(u); setView('dashboard'); }} onBack={() => setView('landing')} />;
  }

  return <LandingPage onNavigateToAuth={mode => { setAuthMode(mode); setView('auth'); }} />;
}

export default function Main() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}
