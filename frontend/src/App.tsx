import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FileVideo,
  Flame,
  Hash,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react'
import { supabase } from './lib/supabase'
import './App.css'

type NavItem = { label: string; icon: typeof LayoutDashboard }
type ChatMessage = { role: 'user' | 'model'; text: string }

function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) {
      setAuthError('Supabase is not configured. Use demo mode or add the frontend environment variables.')
      return
    }

    setAuthError('')
    setAuthNotice('')
    setLoading(true)
    const result = mode === 'register'
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)

    if (result.error) {
      setAuthError(result.error.message)
      return
    }

    if (mode === 'register' && !result.data.session) {
      setAuthNotice('Check your email to confirm your account, then sign in.')
      setMode('login')
      return
    }
    onAuthenticated()
  }

  const continueWithGoogle = async () => {
    if (!supabase) {
      setAuthError('Supabase is not configured. Use demo mode or add the frontend environment variables.')
      return
    }
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (error) setAuthError(error.message)
  }

  const resetPassword = async () => {
    if (!supabase || !email.trim()) {
      setAuthError('Enter your email address first.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` })
    if (error) setAuthError(error.message)
    else setAuthNotice('Password reset instructions were sent to your email.')
  }

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="auth-brand"><div className="brand-mark">C</div><span>Creator Analyzer</span></div>
        <div className="auth-story">
          <p className="eyebrow">The creator operating system</p>
          <h1>Turn your channel into a clearer next move.</h1>
          <p>One focused workspace for the numbers, ideas and decisions behind your YouTube growth.</p>
        </div>
        <div className="auth-proof"><div className="proof-avatars"><span>AM</span><span>JD</span><span>+</span></div><div><strong>Built for the next upload</strong><small>Analytics, research and creator AI in one place.</small></div></div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><div className="brand-mark">C</div><span>Creator Analyzer</span></div>
          <div className="auth-heading"><p className="eyebrow">{mode === 'register' ? 'Start building with intention' : 'Welcome back, creator'}</p><h2>{mode === 'register' ? 'Create your workspace' : 'Sign in to your workspace'}</h2><p>{mode === 'register' ? 'Set up your creator command center in under two minutes.' : 'Pick up where your channel strategy left off.'}</p></div>
          <button className="google-button" type="button" onClick={continueWithGoogle}><span className="google-g">G</span> Continue with Google <ArrowRight size={16} /></button>
          <div className="auth-divider"><span>or continue with email</span></div>
          <form className="auth-form" onSubmit={submit}>
            <label>Email address<div className="field-wrap"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@yourchannel.com" required /></div></label>
            <label>Password<div className="field-wrap"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /><button type="button" className="field-action" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
            <div className="auth-options"><label className="remember-option"><input type="checkbox" /> <span>Remember me</span></label>{mode === 'login' && <button type="button" className="plain-link" onClick={resetPassword}>Forgot password?</button>}</div>
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Working...' : mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button>
          </form>
          {authError && <p className="auth-error">{authError}</p>}
          {authNotice && <p className="auth-notice">{authNotice}</p>}
          <p className="auth-switch">{mode === 'register' ? 'Already have an account?' : 'New to Creator Analyzer?'} <button type="button" onClick={() => { setAuthError(''); setAuthNotice(''); setMode(mode === 'register' ? 'login' : 'register') }}>{mode === 'register' ? 'Sign in' : 'Create an account'}</button></p>
          <p className="auth-terms">By continuing, you agree to our Terms and Privacy Policy.</p>
          <button className="demo-link" type="button" onClick={onAuthenticated}><Check size={14} /> Continue in demo mode</button>
        </div>
      </section>
    </main>
  )
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Niches', icon: Flame },
  { label: 'Videos', icon: FileVideo },
  { label: 'Thumbnail Analyzer', icon: Sparkles },
  { label: 'Title & Hashtag', icon: Hash },
  { label: 'Leaderboard', icon: Trophy },
]

const stats = [
  { label: 'Subscribers', value: '12,480', change: '+8.4%', tone: 'red' },
  { label: 'Total views', value: '284.6K', change: '+14.2%', tone: 'green' },
  { label: 'Published videos', value: '64', change: '+3 this month', tone: 'neutral' },
]

const pageDescriptions: Record<string, { eyebrow: string; title: string; description: string }> = {
  Analytics: { eyebrow: 'Channel performance', title: 'Analytics', description: 'Your Studio-style metrics will live here once YouTube is connected.' },
  Niches: { eyebrow: 'Research workspace', title: 'Niches', description: 'Explore demand, competition and related creator opportunities.' },
  Videos: { eyebrow: 'Content library', title: 'Videos', description: 'Search and compare your videos, then ask Creator AI about performance.' },
  'Thumbnail Analyzer': { eyebrow: 'Creative toolkit', title: 'Thumbnail Analyzer', description: 'Upload a thumbnail to review composition, readability and audience fit.' },
  'Title & Hashtag': { eyebrow: 'Creative toolkit', title: 'Title & Hashtag Analyzer', description: 'Test titles and hashtags against your channel context.' },
  Leaderboard: { eyebrow: 'Creator community', title: 'Leaderboard', description: 'Track creator score, growth and consistency over time.' },
  Settings: { eyebrow: 'Workspace preferences', title: 'Settings', description: 'Profile, connected channels and AI preferences will be managed here.' },
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(!supabase)
  const [activePage, setActivePage] = useState('Dashboard')
  const [chatOpen, setChatOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome back, Alex. Ask me about your channel, content ideas or the current workspace.' },
  ])

  useEffect(() => {
    if (!supabase) return

    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setAuthenticated(Boolean(data.session))
      setAuthReady(true)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session))
      setAuthReady(true)
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const selectPage = (page: string) => {
    setActivePage(page)
    setMobileNavOpen(false)
  }

  const sendChatMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = chatInput.trim()
    if (!message || chatLoading) return

    const nextMessages = [...chatMessages, { role: 'user' as const, text: message }]
    setChatMessages(nextMessages)
    setChatInput('')
    setChatError('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: nextMessages.slice(-10).map(({ role, text }) => ({ role, parts: [{ text }] })),
          context: { page: activePage, format: 'Long-form', country: 'Not configured', language: 'Not configured' },
        }),
      })
      const payload = await response.json() as { reply?: string; error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'AI service is unavailable')
      setChatMessages((current) => [...current, { role: 'model', text: payload.reply ?? 'I could not generate a response.' }])
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'AI service is unavailable')
    } finally {
      setChatLoading(false)
    }
  }

  if (!authReady) {
    return <main className="auth-shell" />
  }

  if (!authenticated) {
    return <AuthScreen onAuthenticated={() => setAuthenticated(true)} />
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'is-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">C</div>
          <span>Creator Analyzer</span>
          <button className="icon-button sidebar-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <div className="workspace-switcher">
          <div className="avatar avatar-small">AM</div>
          <div><strong>Alex Morgan</strong><span>Personal workspace</span></div>
          <ChevronDown size={15} />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-caption">Workspace</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => selectPage(label)}>
              <Icon size={18} strokeWidth={activePage === label ? 2.4 : 1.8} />
              <span>{label}</span>
              {label === 'Thumbnail Analyzer' && <span className="new-badge">New</span>}
            </button>
          ))}
          <span className="nav-caption nav-caption-spaced">Manage</span>
          <button className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => selectPage('Settings')}>
            <Settings size={18} /><span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-tip"><Target size={18} /><div><strong>Monetization goal</strong><span>34% complete</span></div></div>
          <div className="mini-progress"><span style={{ width: '34%' }} /></div>
          <p>Connect YouTube to unlock live data.</p>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-overlay" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <span className="live-dot"><i /> Demo mode</span>
            <button className="connect-button" type="button"><span>Connect YouTube</span><span className="connect-plus">+</span></button>
            <button className="avatar" aria-label="Open profile">AM</button>
          </div>
        </header>

        <div className="page-grid">
          <section className="page-content">
            {activePage === 'Dashboard' ? <>
            <div className="page-heading">
              <div><p className="eyebrow">Sunday, September 13, 2026</p><h1>Good morning, Alex <span>↗</span></h1><p className="heading-copy">Here is how your channel is moving this week.</p></div>
              <button className="date-button" type="button">Last 28 days <ChevronDown size={16} /></button>
            </div>

            <div className="stat-grid">
              {stats.map((stat) => <article className="stat-card" key={stat.label}><span className="stat-label">{stat.label}</span><strong>{stat.value}</strong><span className={`stat-change ${stat.tone}`}>{stat.change}</span></article>)}
            </div>

            <div className="section-heading"><div><h2>Channel momentum</h2><p>Performance snapshot across your connected channels.</p></div><button className="text-button" onClick={() => selectPage('Analytics')}>View analytics <span>→</span></button></div>
            <article className="chart-card">
              <div className="chart-header"><div><span className="chart-kicker">Total views</span><strong>284,623</strong></div><div className="chart-legend"><span><i className="legend-red" /> This period</span><span><i className="legend-gray" /> Previous period</span></div></div>
              <div className="chart-area"><div className="chart-y-labels"><span>60k</span><span>40k</span><span>20k</span><span>0</span></div><svg viewBox="0 0 720 190" role="img" aria-label="Views trend chart" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ed3b35" stopOpacity=".18" /><stop offset="1" stopColor="#ed3b35" stopOpacity="0" /></linearGradient></defs><path d="M0 154 C52 149 63 111 108 126 S172 125 208 98 S270 117 316 82 S368 90 405 61 S461 75 504 52 S562 67 600 30 S669 51 720 16 V190 H0Z" fill="url(#chartFill)" /><path d="M0 154 C52 149 63 111 108 126 S172 125 208 98 S270 117 316 82 S368 90 405 61 S461 75 504 52 S562 67 600 30 S669 51 720 16" fill="none" stroke="#ed3b35" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg></div><div className="chart-x-labels"><span>Aug 17</span><span>Aug 24</span><span>Aug 31</span><span>Sep 07</span><span>Sep 13</span></div>
            </article>

            <div className="lower-grid">
              <article className="goal-card"><div className="section-heading compact"><div><h2>Monetization</h2><p>Long-form track</p></div><Target size={19} /></div><div className="goal-row"><div><span>Subscribers</span><strong>1,000 <small>/ 1,000</small></strong></div><div className="goal-ring"><span>100%</span></div></div><div className="goal-bar"><span style={{ width: '86%' }} /></div><div className="goal-foot"><span>Watch hours</span><strong>3,420 <small>/ 4,000</small></strong></div><div className="goal-bar"><span style={{ width: '85.5%' }} /></div><p className="muted-note">Connect your channel to replace demo progress with live metrics.</p></article>
              <article className="recent-card"><div className="section-heading compact"><div><h2>Recent videos</h2><p>Latest uploads</p></div><button className="more-button" onClick={() => selectPage('Videos')}>See all <span>→</span></button></div>{['The creator system I wish I had', 'I tested 7 hooks in 7 days', 'How I plan a month of content'].map((title, index) => <button className="video-row" key={title} onClick={() => selectPage('Videos')}><div className={`video-thumb thumb-${index + 1}`}><span>{index === 0 ? 'PLAY' : index === 1 ? 'HOOK' : 'PLAN'}</span></div><div><strong>{title}</strong><span>{index === 0 ? '12.4K' : index === 1 ? '8.7K' : '5.2K'} views · {index + 2} days ago</span></div><span className="video-arrow">↗</span></button>)}</article>
            </div>
            </> : <>
              <div className="page-heading page-heading-single">
                <div><p className="eyebrow">{pageDescriptions[activePage].eyebrow}</p><h1>{pageDescriptions[activePage].title}</h1><p className="heading-copy">{pageDescriptions[activePage].description}</p></div>
              </div>
              <article className="workspace-empty-state">
                <div className="empty-state-icon"><Sparkles size={22} /></div>
                <span className="empty-state-label">Phase 1 workspace</span>
                <h2>{pageDescriptions[activePage].title} is ready for the next build phase</h2>
                <p>This route and its context-aware AI panel are wired into the application shell. Live data and actions will be added in the corresponding implementation phase.</p>
                <button className="connect-button" type="button" onClick={() => selectPage('Dashboard')}>Back to Dashboard <span className="connect-plus">↗</span></button>
              </article>
            </>}
          </section>

          <aside className={`ai-panel ${chatOpen ? 'open' : ''}`}>
            <div className="ai-panel-head"><div className="ai-title"><div className="ai-icon"><Bot size={18} /></div><div><strong>Creator AI</strong><span>Context-aware assistant</span></div></div><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close Creator AI"><X size={17} /></button></div>
            {chatOpen ? <><div className="ai-context"><span>Current context</span><strong>{activePage} <i>·</i> Alex Morgan</strong></div><div className="chat-messages">{chatMessages.map((message, index) => <div className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`} key={`${message.role}-${index}`}>{message.text}</div>)}{chatLoading && <div className="message ai-message">Thinking...</div>}</div><div className="suggestions"><button type="button" onClick={() => setChatInput('Give me 3 ideas for my next video')}>Give me 3 ideas <span>↗</span></button><button type="button" onClick={() => setChatInput('Review my growth')}>Review my growth <span>↗</span></button></div><form className="chat-input" onSubmit={sendChatMessage}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask Creator AI..." aria-label="Ask Creator AI" /><button type="submit" aria-label="Send message">↗</button></form>{chatError && <p className="ai-error">{chatError}</p>}<p className="ai-disclaimer">AI suggestions are a starting point, not a guarantee.</p></> : <button className="reopen-chat" onClick={() => setChatOpen(true)}><MessageCircle size={17} /> Open AI chat</button>}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
