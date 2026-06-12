import { useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Goal,
  Menu,
  Newspaper,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { articles, revenueIdeas, teams } from './data'
import {
  useFixtureDetails,
  useLiveFixtures,
  useStandings,
  useTopPlayers,
  useUpcomingFixtures,
} from './useFootballData'
import './App.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/live', label: 'Live' },
  { to: '/fixtures', label: 'Fixtures' },
  { to: '/standings', label: 'Tables' },
  { to: '/stats', label: 'Stats' },
  { to: '/teams', label: 'Teams' },
  { to: '/news', label: 'News' },
  { to: '/business', label: 'Earn' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app">
      <header className="topbar">
        <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">
            <Goal size={21} />
          </span>
          <span>
            <strong>FootyBuzz India</strong>
            <small>Live data, stats and fan business</small>
          </span>
        </NavLink>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <NavLink className="icon-button" to="/live" aria-label="Search matches">
            <Search size={18} />
          </NavLink>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/fixtures/:fixtureId" element={<FixtureDetailPage />} />
        <Route path="/match/:matchId" element={<MatchDetailPage />} />
      </Routes>
    </div>
  )
}

function HomePage() {
  const { data: liveMatches, loading, error, isFallback } = useLiveFixtures()
  const { data: upcomingFixtures } = useUpcomingFixtures()
  const featuredMatch = liveMatches[0]

  return (
    <>
      <section className="hero-panel page-enter">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            Live football data platform for Indian fans
          </span>
          <h1>Live matches, fixtures, player stats, standings and match numbers.</h1>
          <p>
            The site now connects to API-Football for live fixtures, match
            details, standings, events and player leaderboards.
          </p>
          <div className="hero-actions">
            <NavLink className="primary-action" to="/live">
              <PlayCircle size={18} />
              Watch Live Center
            </NavLink>
            <NavLink className="secondary-action" to="/stats">
              <Star size={18} />
              Player Stats
            </NavLink>
          </div>
        </div>

        <aside className="score-ticker floating-card" aria-label="Featured live score">
          <div className="ticker-header">
            <span>{isFallback ? 'Demo feed' : 'Live feed'}</span>
            <strong>{featuredMatch?.minute ? `${featuredMatch.minute}'` : featuredMatch?.status}</strong>
          </div>
          <div className="ticker-score">
            <span>{featuredMatch?.home}</span>
            <strong>
              {featuredMatch?.homeScore === null
                ? 'vs'
                : `${featuredMatch?.homeScore} - ${featuredMatch?.awayScore}`}
            </strong>
            <span>{featuredMatch?.away}</span>
          </div>
          <p>{featuredMatch?.note}</p>
          <NavLink to={`/match/${featuredMatch?.id}`} className="mini-link">
            Match center <ChevronRight size={15} />
          </NavLink>
        </aside>
      </section>

      <QuickStats />

      <section className="full-band">
        <DataNotice loading={loading} error={error} isFallback={isFallback} />
        <div className="content-grid">
          <LivePreview />
          <FixturePanel fixturesData={upcomingFixtures} />
        </div>
      </section>

      <section className="content-grid lower-grid">
        <StandingsPanel />
        <NewsPanel />
        <BusinessPanel />
      </section>
    </>
  )
}

function QuickStats() {
  const stats = [
    { icon: <Bell size={20} />, title: 'Live Feed', text: 'Scores from API-Football' },
    { icon: <Clock3 size={20} />, title: 'IST First', text: 'Fixtures shown for India' },
    { icon: <ShieldCheck size={20} />, title: 'Stats Ready', text: 'Events, match and players' },
    { icon: <Star size={20} />, title: 'Leaderboards', text: 'Top scorers and assists' },
  ]

  return (
    <section className="quick-stats" aria-label="Product highlights">
      {stats.map((stat) => (
        <div key={stat.title}>
          {stat.icon}
          <span>
            <strong>{stat.title}</strong>
            <small>{stat.text}</small>
          </span>
        </div>
      ))}
    </section>
  )
}

function LivePreview() {
  const { data: liveMatches, loading, error, isFallback } = useLiveFixtures()

  return (
    <section className="panel match-panel">
      <SectionHeading kicker="Live now" title="Football Scores" action="/live" />
      <DataNotice loading={loading} error={error} isFallback={isFallback} compact />
      <div className="match-list">
        {liveMatches.slice(0, 3).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  )
}

function LivePage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const { data: liveMatches, loading, error, isFallback } = useLiveFixtures()
  const filteredMatches = useMemo(
    () =>
      liveMatches.filter((match) => {
        const queryMatch = `${match.home} ${match.away} ${match.league}`
          .toLowerCase()
          .includes(query.toLowerCase())
        const statusMatch = status === 'All' || match.status === status
        return queryMatch && statusMatch
      }),
    [liveMatches, query, status],
  )

  return (
    <PageShell
      kicker="Live center"
      title="Search live scores, open match pages and follow real-time cards."
      icon={<PlayCircle size={28} />}
    >
      <div className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team or league"
          />
        </label>
        <div className="segmented">
          {['All', 'Live', 'Half Time', 'Upcoming', 'Finished'].map((item) => (
            <button
              key={item}
              className={status === item ? 'selected' : ''}
              type="button"
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <div className="match-list spacious">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </PageShell>
  )
}

function MatchCard({ match }) {
  const score =
    match.homeScore === null || match.homeScore === undefined
      ? 'vs'
      : `${match.homeScore} - ${match.awayScore}`

  return (
    <article className="match-card">
      <div className="match-meta">
        <span>{match.league}</span>
        <strong className={match.status === 'Upcoming' ? 'soft-status' : ''}>
          {match.status === 'Upcoming' ? match.kickoff : `${match.status} ${match.minute || ''}`}
        </strong>
      </div>
      <div className="teams">
        <span>{match.home}</span>
        <strong>{score}</strong>
        <span>{match.away}</span>
      </div>
      <p>{match.note}</p>
      {match.stats && (
        <div className="stat-row">
          <span>Possession {match.stats.possession[0]}%</span>
          <span>Shots {match.stats.shots[0] + match.stats.shots[1]}</span>
          <span>Corners {match.stats.corners[0] + match.stats.corners[1]}</span>
        </div>
      )}
      <NavLink to={`/match/${match.id}`} className="card-link">
        Open match center <ChevronRight size={15} />
      </NavLink>
    </article>
  )
}

function MatchDetailPage() {
  const { matchId } = useParams()
  const { data, loading, error, isFallback } = useFixtureDetails(matchId)
  const match = data[0]
  const [pick, setPick] = useState('')

  return (
    <PageShell kicker={match.league} title={`${match.home} vs ${match.away}`} icon={<Goal size={28} />}>
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <section className="match-detail">
        <div className="detail-score">
          <span>{match.home}</span>
          <strong>
            {match.homeScore === null || match.homeScore === undefined
              ? 'vs'
              : `${match.homeScore} - ${match.awayScore}`}
          </strong>
          <span>{match.away}</span>
        </div>
        <p>{match.venue}</p>
        <p>{match.note}</p>
      </section>

      <div className="content-grid">
        <section className="panel">
          <SectionHeading kicker="Timeline" title="Live Commentary" />
          <div className="timeline">
            {(match.timeline.length
              ? match.timeline
              : [{ min: 0, type: 'Kickoff', text: 'Events will appear when the API provides them.' }]
            ).map((item) => (
              <div className="timeline-item" key={`${item.min}-${item.text}`}>
                <time>{item.min}'</time>
                <strong>{item.type}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionHeading kicker="Match stats" title="Best Numbers" />
          <BestStats match={match} />
        </section>

        <section className="panel">
          <SectionHeading kicker="Fan tools" title="Prediction" />
          <div className="prediction-grid">
            {[match.home, 'Draw', match.away].map((item) => (
              <button
                key={item}
                className={pick === item ? 'prediction selected' : 'prediction'}
                type="button"
                onClick={() => setPick(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="helper-text">
            {pick ? `Your pick is ${pick}.` : 'Choose a prediction to test the interaction.'}
          </p>
        </section>
      </div>
    </PageShell>
  )
}

function FixtureDetailPage() {
  const { fixtureId } = useParams()
  const { data, loading, error, isFallback } = useFixtureDetails(fixtureId)
  const fixture = data[0]
  const [reminderOn, setReminderOn] = useState(false)

  return (
    <PageShell
      kicker={fixture.league}
      title={`${fixture.home} vs ${fixture.away}`}
      icon={<CalendarDays size={28} />}
    >
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <section className="match-detail fixture-detail">
        <div className="detail-score">
          <span>{fixture.home}</span>
          <strong>vs</strong>
          <span>{fixture.away}</span>
        </div>
        <div className="fixture-detail-grid">
          <div>
            <span className="detail-label">Kickoff</span>
            <strong>{fixture.kickoff || `${fixture.time} IST`}</strong>
          </div>
          <div>
            <span className="detail-label">Date</span>
            <strong>{fixture.date || 'TBC'}</strong>
          </div>
          <div>
            <span className="detail-label">Stage</span>
            <strong>{fixture.stage || fixture.league}</strong>
          </div>
          <div>
            <span className="detail-label">Venue</span>
            <strong>{fixture.venue || 'Venue TBC'}</strong>
          </div>
        </div>
        <p>{fixture.note}</p>
        <button
          className={reminderOn ? 'reminder active fixture-detail-action' : 'reminder fixture-detail-action'}
          type="button"
          onClick={() => setReminderOn((current) => !current)}
        >
          <Bell size={16} />
          {reminderOn ? 'Reminder On' : 'Remind Me'}
        </button>
      </section>

      <div className="content-grid">
        <section className="panel">
          <SectionHeading kicker="Fixture info" title="Match Window" />
          <div className="fixture-info-list">
            <span>Status</span>
            <strong>{fixture.status}</strong>
            <span>Competition</span>
            <strong>{fixture.league}</strong>
            <span>India time</span>
            <strong>{fixture.kickoff || `${fixture.time} IST`}</strong>
          </div>
        </section>

        <section className="panel">
          <SectionHeading kicker="Fan tools" title="Pre-Match Pick" />
          <p className="helper-text">Use this page for fixture previews, reminders, sponsor slots and lineups when the API provides them.</p>
          <NavLink className="card-link" to="/fixtures">
            Back to fixtures <ChevronRight size={15} />
          </NavLink>
        </section>
      </div>
    </PageShell>
  )
}

function FixturesPage() {
  const [reminders, setReminders] = useState([])
  const { data: upcomingFixtures, loading, error, isFallback } = useUpcomingFixtures()

  function toggleReminder(id) {
    setReminders((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <PageShell
      kicker="Fixtures in IST"
      title="Live schedule pages built for Indian football traffic."
      icon={<CalendarDays size={28} />}
    >
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <div className="fixture-board">
        {upcomingFixtures.map((fixture) => (
          <article className="fixture-card" key={fixture.id}>
            <div className="date-chip">{fixture.date}</div>
            <div>
              <h3>{fixture.match || `${fixture.home} vs ${fixture.away}`}</h3>
              <p>{fixture.stage} - {fixture.venue}</p>
            </div>
            <time>{fixture.time || fixture.kickoff} IST</time>
            <NavLink to={`/fixtures/${fixture.id}`} className="card-link">
              Open fixture <ChevronRight size={15} />
            </NavLink>
            <button
              className={reminders.includes(fixture.id) ? 'reminder active' : 'reminder'}
              type="button"
              onClick={() => toggleReminder(fixture.id)}
            >
              <Bell size={16} />
              {reminders.includes(fixture.id) ? 'Reminder On' : 'Remind Me'}
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function FixturePanel({ fixturesData }) {
  const { data: loadedFixtures, loading, error, isFallback } = useUpcomingFixtures()
  const panelFixtures = fixturesData || loadedFixtures

  return (
    <aside className="panel">
      <SectionHeading kicker="India time" title="Upcoming Fixtures" action="/fixtures" compact />
      <DataNotice loading={loading && !fixturesData} error={error} isFallback={isFallback && !fixturesData} compact />
      <div className="fixture-list">
        {panelFixtures.slice(0, 4).map((fixture) => (
          <article className="fixture-item" key={fixture.id}>
            <div>
              <NavLink to={`/fixtures/${fixture.id}`} className="fixture-item-link">
                {fixture.match || `${fixture.home} vs ${fixture.away}`}
              </NavLink>
              <span>{fixture.stage}</span>
            </div>
            <time>{fixture.time || fixture.kickoff}</time>
            <small>{fixture.tag}</small>
          </article>
        ))}
      </div>
    </aside>
  )
}

function StandingsPage() {
  const { data: tableRows, loading, error, isFallback } = useStandings()

  return (
    <PageShell kicker="Tables" title="Live standings with form, points and goal difference." icon={<Trophy size={28} />}>
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <StandingsPanel expanded rows={tableRows} />
    </PageShell>
  )
}

function StandingsPanel({ expanded = false, rows }) {
  const { data: tableRows } = useStandings()
  const visibleRows = expanded ? rows || tableRows : (rows || tableRows).slice(0, 4)

  return (
    <section className="panel">
      <SectionHeading kicker="Tables" title="Top Teams" action={expanded ? null : '/standings'} compact />
      <table className="standings-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            {expanded && <th>W</th>}
            {expanded && <th>D</th>}
            {expanded && <th>L</th>}
            <th>GD</th>
            <th>Pts</th>
            {expanded && <th>Form</th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.team}>
              <td>{row.team}</td>
              <td>{row.played}</td>
              {expanded && <td>{row.won}</td>}
              {expanded && <td>{row.drawn}</td>}
              {expanded && <td>{row.lost}</td>}
              <td>{row.gd}</td>
              <td>{row.points}</td>
              {expanded && <td>{row.form}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function StatsPage() {
  const { data: playerStats, loading, error, isFallback } = useTopPlayers()

  return (
    <PageShell kicker="Player stats" title="Top scorers, top creators and best player numbers." icon={<Star size={28} />}>
      <DataNotice loading={loading} error={error} isFallback={isFallback} />
      <div className="content-grid">
        <PlayerStatsPanel title="Top Scorers" players={playerStats.scorers} metric="goals" />
        <PlayerStatsPanel title="Top Assists" players={playerStats.assists} metric="assists" />
      </div>
    </PageShell>
  )
}

function PlayerStatsPanel({ title, players, metric }) {
  return (
    <section className="panel">
      <SectionHeading kicker="Best stats" title={title} compact />
      <div className="player-list">
        {players.map((player, index) => (
          <article className="player-row" key={player.id || player.name}>
            <strong>{index + 1}</strong>
            {player.photo && <img src={player.photo} alt="" />}
            <div>
              <h3>{player.name}</h3>
              <p>{player.team}</p>
            </div>
            <span>{player[metric]}</span>
            <small>Rating {player.rating}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function BestStats({ match }) {
  if (!match.stats) {
    return <p className="helper-text">Detailed match statistics will appear when the live API provides them.</p>
  }

  const rows = [
    ['Possession', `${match.stats.possession[0]}%`, `${match.stats.possession[1]}%`],
    ['Shots', match.stats.shots[0], match.stats.shots[1]],
    ['Corners', match.stats.corners[0], match.stats.corners[1]],
    ['Fouls', match.stats.fouls[0], match.stats.fouls[1]],
  ]

  return (
    <div className="stats-board">
      {rows.map(([label, home, away]) => (
        <div className="stats-line" key={label}>
          <strong>{home}</strong>
          <span>{label}</span>
          <strong>{away}</strong>
        </div>
      ))}
    </div>
  )
}

function TeamsPage() {
  return (
    <PageShell kicker="Teams" title="Popular teams for Indian football fans." icon={<Users size={28} />}>
      <div className="team-grid">
        {teams.map((team) => (
          <article className="team-card" key={team.name} style={{ '--team-color': team.color }}>
            <span className="team-wash" style={{ background: team.color }} />
            <span className="team-orb" style={{ background: team.color }} />
            <h3>{team.name}</h3>
            <p>FIFA rank #{team.rank}</p>
            <strong>{team.fans} Indian fan interest</strong>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function NewsPage() {
  return (
    <PageShell kicker="News and SEO" title="Content pages that can bring traffic and affiliate clicks." icon={<Newspaper size={28} />}>
      <NewsPanel expanded />
    </PageShell>
  )
}

function NewsPanel({ expanded = false }) {
  const items = expanded ? articles : articles.slice(0, 3)
  return (
    <section className="panel news-panel">
      <SectionHeading kicker="Traffic engine" title="News & Guides" action={expanded ? null : '/news'} compact />
      <div className="article-list">
        {items.map((article) => (
          <article className="article-item" key={article.slug}>
            <span>{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <small>{article.read}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function BusinessPage() {
  return (
    <PageShell kicker="Monetization" title="Turn football traffic into Indian-market revenue." icon={<CircleDollarSign size={28} />}>
      <div className="business-layout">
        <BusinessPanel expanded />
        <section className="panel">
          <SectionHeading kicker="Launch funnel" title="What to build next" />
          <div className="roadmap">
            {[
              'Add VITE_API_FOOTBALL_KEY',
              'Choose league and season env values',
              'Cache API responses before production',
              'Add AdSense, affiliate blocks and sponsor listings',
            ].map((step, index) => (
              <div className="roadmap-step" key={step}>
                <strong>{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}

function BusinessPanel({ expanded = false }) {
  return (
    <section className="panel business-panel">
      <SectionHeading kicker="Monetization" title="How This Earns" action={expanded ? null : '/business'} compact />
      <ul className="revenue-list">
        {revenueIdeas.map((idea) => (
          <li key={idea}>
            <CircleDollarSign size={18} />
            {idea}
          </li>
        ))}
      </ul>
      <button className="wide-button" type="button">
        Create Sponsor Slot
      </button>
    </section>
  )
}

function PageShell({ kicker, title, icon, children }) {
  return (
    <main className="page page-enter">
      <section className="page-hero">
        <div>
          <span className="eyebrow">
            {icon}
            {kicker}
          </span>
          <h1>{title}</h1>
        </div>
      </section>
      {children}
    </main>
  )
}

function SectionHeading({ kicker, title, action, compact = false }) {
  const navigate = useNavigate()

  return (
    <div className={compact ? 'section-heading compact' : 'section-heading'}>
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" type="button" onClick={() => navigate(action)}>
          View All
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

function DataNotice({ loading, error, isFallback, compact = false }) {
  if (loading) {
    return <p className={compact ? 'data-notice compact' : 'data-notice'}>Loading live football data...</p>
  }

  if (isFallback || error) {
    return (
      <p className={compact ? 'data-notice compact warning' : 'data-notice warning'}>
        {error || 'Showing demo data until live API data is available.'}
      </p>
    )
  }

  return <p className={compact ? 'data-notice compact success' : 'data-notice success'}>Live API data loaded.</p>
}

export default App
