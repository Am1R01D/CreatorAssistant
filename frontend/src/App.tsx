import { useState } from 'react'
import {
  BarChart3,
  Bot,
  ChevronDown,
  FileVideo,
  Flame,
  Hash,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react'
import './App.css'

type NavItem = { label: string; icon: typeof LayoutDashboard }

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

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [chatOpen, setChatOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const selectPage = (page: string) => {
    setActivePage(page)
    setMobileNavOpen(false)
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
          </section>

          <aside className={`ai-panel ${chatOpen ? 'open' : ''}`}>
            <div className="ai-panel-head"><div className="ai-title"><div className="ai-icon"><Bot size={18} /></div><div><strong>Creator AI</strong><span>Context-aware assistant</span></div></div><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close Creator AI"><X size={17} /></button></div>
            {chatOpen ? <><div className="ai-context"><span>Current context</span><strong>Dashboard <i>·</i> Alex Morgan</strong></div><div className="chat-messages"><div className="message ai-message">Welcome back, Alex. I can help you spot patterns in your channel and turn them into your next move.</div><div className="message user-message">What should I focus on this week?</div><div className="message ai-message">Your view momentum is up 14.2%. I would keep testing strong opening hooks and close the 580-hour watch-time gap.</div></div><div className="suggestions"><button>Give me 3 ideas <span>↗</span></button><button>Review my growth <span>↗</span></button></div><div className="chat-input"><input placeholder="Ask Creator AI..." aria-label="Ask Creator AI" /><button aria-label="Send message">↗</button></div><p className="ai-disclaimer">AI suggestions are a starting point, not a guarantee.</p></> : <button className="reopen-chat" onClick={() => setChatOpen(true)}><MessageCircle size={17} /> Open AI chat</button>}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
