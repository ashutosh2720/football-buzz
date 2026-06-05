export const matches = [
  {
    id: 'ind-qatar',
    league: 'World Cup 2026 Qualifier',
    status: 'Live',
    minute: 67,
    home: 'India',
    away: 'Qatar',
    homeScore: 1,
    awayScore: 1,
    venue: 'Salt Lake Stadium, Kolkata',
    note: 'India pushing for a late winner with quick wide attacks.',
    scorers: ['Chhangte 42', 'Afif 58'],
    stats: {
      possession: [48, 52],
      shots: [7, 9],
      corners: [4, 3],
      fouls: [8, 10],
    },
    timeline: [
      { min: 12, type: 'Chance', text: 'India force an early save from distance.' },
      { min: 42, type: 'Goal', text: 'Chhangte scores from a sharp cutback.' },
      { min: 58, type: 'Goal', text: 'Afif equalises after a quick transition.' },
      { min: 66, type: 'Card', text: 'Qatar booked for stopping a counter.' },
    ],
  },
  {
    id: 'bra-por',
    league: 'International Friendly',
    status: 'Half Time',
    minute: 45,
    home: 'Brazil',
    away: 'Portugal',
    homeScore: 2,
    awayScore: 1,
    venue: 'MetLife Stadium, New Jersey',
    note: 'Brazil lead after a thrilling first half packed with chances.',
    scorers: ['Neymar 13', 'Vini Jr 31', 'Ramos 44'],
    stats: {
      possession: [55, 45],
      shots: [9, 6],
      corners: [3, 2],
      fouls: [5, 7],
    },
    timeline: [
      { min: 13, type: 'Goal', text: 'Neymar bends one into the far corner.' },
      { min: 31, type: 'Goal', text: 'Vini Jr finishes a fast left-side move.' },
      { min: 44, type: 'Goal', text: 'Ramos pulls one back before the break.' },
    ],
  },
  {
    id: 'mia-hilal',
    league: 'Club World Warm-up',
    status: 'Live',
    minute: 24,
    home: 'Inter Miami',
    away: 'Al Hilal',
    homeScore: 0,
    awayScore: 0,
    venue: 'Hard Rock Stadium, Miami',
    note: 'Compact midfield battle with both teams pressing high.',
    scorers: [],
    stats: {
      possession: [51, 49],
      shots: [2, 3],
      corners: [1, 1],
      fouls: [3, 4],
    },
    timeline: [
      { min: 8, type: 'Chance', text: 'Al Hilal test the keeper from the edge.' },
      { min: 20, type: 'Chance', text: 'Miami nearly score from a set piece.' },
    ],
  },
  {
    id: 'arg-mar',
    league: 'World Cup 2026',
    status: 'Upcoming',
    minute: null,
    home: 'Argentina',
    away: 'Morocco',
    homeScore: null,
    awayScore: null,
    venue: 'Estadio Azteca, Mexico City',
    note: 'Group A opener, shown in Indian time.',
    scorers: [],
    kickoff: '06:30 AM IST',
    stats: null,
    timeline: [],
  },
]

export const fixtures = [
  { id: 'arg-mar', date: 'Jun 12', time: '06:30 AM', match: 'Argentina vs Morocco', stage: 'Group A', venue: 'Mexico City', tag: 'IST' },
  { id: 'fra-jpn', date: 'Jun 12', time: '09:30 AM', match: 'France vs Japan', stage: 'Group B', venue: 'Toronto', tag: 'IST' },
  { id: 'eng-usa', date: 'Jun 13', time: '12:30 AM', match: 'England vs USA', stage: 'Group C', venue: 'Dallas', tag: 'Tonight' },
  { id: 'bra-ger', date: 'Jun 13', time: '03:30 AM', match: 'Brazil vs Germany', stage: 'Group D', venue: 'Los Angeles', tag: 'Tomorrow' },
  { id: 'por-mex', date: 'Jun 14', time: '07:30 AM', match: 'Portugal vs Mexico', stage: 'Group E', venue: 'Guadalajara', tag: 'IST' },
  { id: 'esp-uru', date: 'Jun 14', time: '10:30 PM', match: 'Spain vs Uruguay', stage: 'Group F', venue: 'Miami', tag: 'Prime' },
]

export const standings = [
  { team: 'Argentina', played: 3, won: 2, drawn: 1, lost: 0, gd: '+5', points: 7, form: 'W W D' },
  { team: 'France', played: 3, won: 2, drawn: 0, lost: 1, gd: '+3', points: 6, form: 'W L W' },
  { team: 'Brazil', played: 3, won: 1, drawn: 2, lost: 0, gd: '+2', points: 5, form: 'D W D' },
  { team: 'Portugal', played: 3, won: 1, drawn: 1, lost: 1, gd: '+1', points: 4, form: 'L W D' },
  { team: 'England', played: 3, won: 1, drawn: 1, lost: 1, gd: '0', points: 4, form: 'W D L' },
  { team: 'Germany', played: 3, won: 1, drawn: 0, lost: 2, gd: '-1', points: 3, form: 'L W L' },
]

export const articles = [
  {
    slug: 'world-cup-2026-schedule-ist',
    title: 'World Cup 2026 schedule in India time: full IST guide',
    category: 'SEO Guide',
    read: '5 min read',
    summary: 'The highest-intent page for Indian football search traffic.',
  },
  {
    slug: 'where-to-watch-football-india',
    title: 'Where to watch football matches legally in India',
    category: 'Streaming',
    read: '4 min read',
    summary: 'Explain official TV, streaming, and match reminder options.',
  },
  {
    slug: 'best-football-fan-gear-india',
    title: 'Best jerseys, footballs and fan gear for Indian supporters',
    category: 'Affiliate',
    read: '6 min read',
    summary: 'A monetizable gear guide for fans preparing for big matches.',
  },
  {
    slug: 'watch-party-directory-india',
    title: 'How to build a football watch party directory in India',
    category: 'Business',
    read: '7 min read',
    summary: 'Turn sports cafes and turf grounds into paid local listings.',
  },
]

export const teams = [
  { name: 'India', rank: 121, fans: '8.4M', color: '#ff8a3d' },
  { name: 'Argentina', rank: 1, fans: '19.2M', color: '#5bc0eb' },
  { name: 'Brazil', rank: 5, fans: '18.7M', color: '#15b371' },
  { name: 'Portugal', rank: 6, fans: '15.1M', color: '#d64550' },
  { name: 'France', rank: 2, fans: '12.9M', color: '#3461ff' },
  { name: 'England', rank: 4, fans: '11.6M', color: '#7f8ea3' },
]

export const playerStats = {
  scorers: [
    { id: 'haaland', name: 'Erling Haaland', team: 'Manchester City', goals: 27, assists: 5, rating: '7.82', appearances: 31 },
    { id: 'palmer', name: 'Cole Palmer', team: 'Chelsea', goals: 22, assists: 11, rating: '7.74', appearances: 33 },
    { id: 'isak', name: 'Alexander Isak', team: 'Newcastle', goals: 21, assists: 2, rating: '7.41', appearances: 30 },
    { id: 'salah', name: 'Mohamed Salah', team: 'Liverpool', goals: 18, assists: 10, rating: '7.59', appearances: 32 },
  ],
  assists: [
    { id: 'de-bruyne', name: 'Kevin De Bruyne', team: 'Manchester City', goals: 4, assists: 10, rating: '7.66', appearances: 18 },
    { id: 'saka', name: 'Bukayo Saka', team: 'Arsenal', goals: 16, assists: 9, rating: '7.55', appearances: 35 },
    { id: 'odegaard', name: 'Martin Odegaard', team: 'Arsenal', goals: 8, assists: 10, rating: '7.48', appearances: 35 },
    { id: 'watkins', name: 'Ollie Watkins', team: 'Aston Villa', goals: 19, assists: 13, rating: '7.42', appearances: 37 },
  ],
}

export const revenueIdeas = [
  'AdSense blocks for match and article pages',
  'Amazon affiliate gear guides for jerseys and footballs',
  'Sports cafe sponsored listings by city',
  'Telegram and WhatsApp match reminder sponsorships',
  'Premium ad-free PWA after traffic grows',
]
