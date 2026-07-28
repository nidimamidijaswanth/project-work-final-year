import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import notificationTriageMap from './assets/notification-triage-map.svg';
import distractionShieldSystem from './assets/distraction-shield-system.svg';
import studentFocusDashboard from './assets/student-focus-dashboard.svg';
import {
  Activity,
  AlarmClockCheck,
  BellRing,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Command,
  Compass,
  Focus,
  Gauge,
  GraduationCap,
  LineChart,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquareWarning,
  Moon,
  Play,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  User,
  UserPlus,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';

const LOCAL_API_URL = 'http://localhost:8001';
const DEPLOYED_API_URL = 'https://focusai-production-31f2.up.railway.app';

function resolveApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    if (
      typeof window !== 'undefined' &&
      !['localhost', '127.0.0.1'].includes(window.location.hostname) &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredUrl)
    ) {
      return `http://${window.location.hostname}:8001`;
    }

    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return LOCAL_API_URL;
  }

  if (typeof window !== 'undefined' && /^(10\.0\.2\.2|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(window.location.hostname)) {
    return `http://${window.location.hostname}:8001`;
  }

  return DEPLOYED_API_URL;
}

const API_URL = resolveApiUrl();

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Controls', path: '/controls' },
  { label: 'AI Coach', path: '/coach' },
  { label: 'Insights', path: '/insights' },
  { label: 'Profile', path: '/profile' },
  { label: 'Stories', path: '/stories' },
];

const focusCards = [
  {
    icon: BrainCircuit,
    title: 'Context Detection',
    body: 'Reads study mode, calendar urgency, app activity, and self-reported energy before deciding what gets through.',
    accent: 'from-aqua to-royal',
  },
  {
    icon: BellRing,
    title: 'Smart Notification Gate',
    body: 'Splits alerts into urgent, batch later, silence, or focus-safe summaries.',
    accent: 'from-pulse to-solar',
  },
  {
    icon: GraduationCap,
    title: 'Student-First Scheduling',
    body: 'Protects lectures, deep work, revision blocks, mock tests, sleep wind-down, and breaks differently.',
    accent: 'from-volt to-aqua',
  },
];

const notifications = [
  { app: 'Classroom', text: 'Assignment deadline moved to 8 PM', level: 'urgent', color: 'bg-pulse' },
  { app: 'WhatsApp', text: '12 new group chat memes', level: 'batch', color: 'bg-solar' },
  { app: 'Calendar', text: 'DSA mock test starts in 25 minutes', level: 'urgent', color: 'bg-aqua' },
  { app: 'Instagram', text: 'New reel from a friend', level: 'mute', color: 'bg-royal' },
];

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'B.Tech CSE Student',
    track: 'DSA interview prep',
    image: studentFocusDashboard,
    quote: 'FocusAI used my interview-prep goal and evening study window to block noisy apps while keeping placement updates visible.',
    score: '42%',
  },
  {
    name: 'Meera Nair',
    role: 'NEET Aspirant',
    track: 'NEET revision',
    image: distractionShieldSystem,
    quote: 'My biggest distraction was YouTube. FocusAI turned those alerts into break-time summaries and protected long biology sessions.',
    score: '3.1h',
  },
  {
    name: 'Kabir Rao',
    role: 'Productivity Club Lead',
    track: 'Campus focus challenge',
    image: notificationTriageMap,
    quote: 'The dashboard feels serious enough for daily use. Students can see why each notification was allowed, delayed, or muted.',
    score: '91',
  },
];

const modes = [
  { label: 'Lecture', icon: GraduationCap, tone: 'bg-aqua/15 text-aqua border-aqua/30' },
  { label: 'Deep Work', icon: Focus, tone: 'bg-pulse/15 text-pulse border-pulse/30' },
  { label: 'Exam Sprint', icon: Zap, tone: 'bg-volt/15 text-volt border-volt/30' },
  { label: 'Wind Down', icon: Moon, tone: 'bg-royal/15 text-white border-royal/30' },
];

const featurePages = [
  { id: 'study-mode', path: '/study-mode', label: 'Study Mode', title: 'Focus mode command center', body: 'Tune session mode, duration, app switch limits, and recovery rules before starting deep work.', icon: Focus },
  { id: 'priority-contacts', path: '/priority-contacts', label: 'Priority Contacts', title: 'Priority contact pass list', body: 'Choose the people who can reach you during protected focus blocks.', icon: User },
  { id: 'whatsapp-filter', path: '/whatsapp-filter', label: 'WhatsApp Filter', title: 'WhatsApp and group filter', body: 'Allow academic groups while batching personal chats and distracting groups.', icon: MessageSquareWarning },
  { id: 'blocked-apps', path: '/blocked-apps', label: 'Blocked Apps', title: 'Blocked app manager', body: 'Build a personal list of apps that should be blocked during study mode.', icon: ShieldCheck },
  { id: 'youtube-study', path: '/youtube-study', label: 'YouTube Study', title: 'YouTube study mode', body: 'Allow only educational content, lectures, tutorials, and study music.', icon: Play },
  { id: 'notification-decisions', path: '/notification-decisions', label: 'Decision Lab', title: 'Notification decision lab', body: 'Preview whether an alert should be allowed, batched, summarized, or blocked.', icon: BellRing },
  { id: 'distraction-alert', path: '/distraction-alert', label: 'Distraction Alert', title: 'AI distraction alert', body: 'Set switch thresholds and see when FocusAI should warn you to return to study.', icon: Radar },
  { id: 'ai-recommendations', path: '/ai-recommendations', label: 'AI Recommendations', title: 'AI recommendation engine', body: 'Generate focused improvement advice from your saved controls and study profile.', icon: WandSparkles },
  { id: 'planner', path: '/planner', label: 'Study Planner', title: 'Smart study planner', body: 'Convert your controls into a practical session plan for the next study block.', icon: CalendarClock },
];

const spring = {
  type: 'spring',
  stiffness: 90,
  damping: 16,
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('focusai_auth');
    return saved ? JSON.parse(saved) : null;
  });

  function saveAuth(nextAuth) {
    setAuth(nextAuth);
    localStorage.setItem('focusai_auth', JSON.stringify(nextAuth));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem('focusai_auth');
  }

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="mesh pointer-events-none fixed inset-0 opacity-80" />
      <GlowCursor />
      <Header auth={auth} logout={logout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage mode="login" saveAuth={saveAuth} auth={auth} />} />
            <Route path="/signup" element={<AuthPage mode="signup" saveAuth={saveAuth} auth={auth} />} />
            <Route path="/onboarding" element={<ProtectedRoute auth={auth}><Profile user={auth?.user} token={auth?.token} saveAuth={saveAuth} logout={logout} onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute auth={auth}><Dashboard user={auth?.user} token={auth?.token} logout={logout} /></ProtectedRoute>} />
            <Route path="/controls" element={<ProtectedRoute auth={auth}><FocusControls user={auth?.user} token={auth?.token} logout={logout} /></ProtectedRoute>} />
            {featurePages.map((feature) => (
              <Route
                key={feature.path}
                path={feature.path}
                element={<ProtectedRoute auth={auth}><FeatureSuitePage featureId={feature.id} user={auth?.user} token={auth?.token} logout={logout} /></ProtectedRoute>}
              />
            ))}
            <Route path="/coach" element={<ProtectedRoute auth={auth}><Coach token={auth?.token} logout={logout} /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute auth={auth}><Insights token={auth?.token} logout={logout} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute auth={auth}><Profile user={auth?.user} token={auth?.token} saveAuth={saveAuth} logout={logout} /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute auth={auth}><Stories /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function Header({ auth, logout, menuOpen, setMenuOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink shadow-glow">
              <Sparkles size={20} />
          </span>
          <span>
            <span className="block text-base font-black">FocusAI</span>
            <span className="block text-[11px] font-semibold uppercase text-white/50">Student focus OS</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        {auth ? (
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
              {auth.user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm font-black text-ink shadow-[0_0_36px_rgba(249,115,22,0.42)]"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm font-black text-ink shadow-[0_0_36px_rgba(249,115,22,0.42)] md:flex"
          >
            <LogIn size={17} />
            Login
          </Link>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 md:hidden"
          >
            <div className="grid gap-2 px-4 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 font-bold ${isActive ? 'bg-white text-ink' : 'bg-white/5 text-white/75'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {auth ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="rounded-2xl bg-volt px-4 py-3 text-left font-black text-ink"
                >
                  Logout {auth.user.name}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl bg-white px-4 py-3 text-center font-black text-ink"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center font-black text-white"
                  >
                    Signup
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ProtectedRoute({ auth, children }) {
  const location = useLocation();

  if (!auth?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={spring}>
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <Page>
      <section className="relative px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-2 text-[10px] font-black uppercase leading-5 text-aqua sm:text-xs"
            >
              <Activity size={15} />
              AI-based context-aware notification control
            </motion.div>
            <h1 className="text-balance text-5xl font-black leading-[0.96] sm:text-6xl lg:text-7xl">
              FocusAI keeps students in the zone.
            </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              A flashy, intelligent focus system that understands study context, ranks distractions, batches noisy alerts,
              and gives students a live command center for deep work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-ink shadow-glow"
              >
                <UserPlus size={18} />
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-black text-white"
              >
                Login
                <ChevronRight size={18} />
              </Link>
            </div>
            <StatsStrip />
          </div>
          <HeroDevice />
        </div>
      </section>
      <FeatureBand />
      <VisualShowcase />
      <Workflow />
      <TestimonialsPreview />
    </Page>
  );
}

function AuthPage({ mode, saveAuth, auth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (auth?.token) {
    return <Navigate to={location.pathname === '/signup' ? '/onboarding' : '/dashboard'} replace />;
  }

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Authentication failed.');
      }

      saveAuth(data);
      navigate(isSignup ? '/onboarding' : location.state?.from || '/dashboard', { replace: true });
    } catch (authError) {
      setError(authError.message || 'Could not complete authentication.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className={`mx-auto grid gap-8 lg:items-center ${isSignup ? 'max-w-xl' : 'max-w-6xl lg:grid-cols-[0.95fr_1.05fr]'}`}>
          <div className={isSignup ? 'hidden' : ''}>
            <p className="text-sm font-black uppercase text-aqua">{isSignup ? 'Signup' : 'Login'}</p>
            <h1 className="text-balance mt-3 text-5xl font-black leading-tight sm:text-6xl">
              {isSignup ? 'Create your protected focus space.' : 'Welcome back to your focus cockpit.'}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
              Create a secure student account first. Your focus personalization comes next in a dedicated setup screen.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['Private sessions', ShieldCheck],
                ['AI coach access', WandSparkles],
                ['Focus analytics', LineChart],
              ].map(([label, Icon]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <Icon className="text-volt" />
                  <p className="mt-4 text-sm font-black">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.form
            onSubmit={submitAuth}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2rem] p-5 sm:p-7"
          >
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{isSignup ? 'Student Signup' : 'Student Login'}</h2>
                <p className="mt-1 text-sm text-white/50">
                  {isSignup ? 'Start with your student details.' : 'Enter your account credentials.'}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pulse p-3 shadow-hot">
                <LockKeyhole />
              </div>
            </div>
            <div className="grid gap-4">
              {isSignup && (
                <AuthInput
                  icon={User}
                  label="Name"
                  value={form.name}
                  onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                  placeholder="Your name"
                />
              )}
              <AuthInput
                icon={Mail}
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                placeholder="student@example.com"
              />
              <AuthInput
                icon={LockKeyhole}
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                placeholder="Minimum 6 characters"
              />
            </div>
            {error && (
              <div className="mt-4 rounded-2xl border border-pulse/30 bg-pulse/10 p-3 text-sm font-semibold text-white">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-5 py-4 font-black text-ink shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Activity className="animate-spin" size={19} /> : isSignup ? <UserPlus size={19} /> : <LogIn size={19} />}
              {isSignup ? 'Create Account' : 'Login'}
            </button>
            <p className="mt-5 text-center text-sm text-white/55">
              {isSignup ? 'Already have an account?' : 'New to FocusAI?'}{' '}
              <Link className="font-black text-volt" to={isSignup ? '/login' : '/signup'}>
                {isSignup ? 'Login' : 'Signup'}
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </Page>
  );
}

function AuthSelect({ icon: Icon, label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/70">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 ring-aqua/30 focus-within:ring-4">
        <Icon size={18} className="text-aqua" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-white outline-none"
        >
          {options.map((option) => (
            <option key={option} className="bg-ink text-white" value={option}>
              {option} hours
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function AuthInput({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/70">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 ring-aqua/30 focus-within:ring-4">
        <Icon size={18} className="text-aqua" />
        <input
          required
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
        />
      </span>
    </label>
  );
}

async function requestJson(path, { token, logout, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json();

  if (response.status === 401) {
    logout?.();
    throw new Error('Please login again.');
  }

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Request failed.');
  }

  return data;
}

function HeroDevice() {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 8, y: 30 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ ...spring, delay: 0.1 }}
      className="neon-border rounded-[2rem]"
    >
      <div className="glass rounded-[2rem] p-4">
        <div className="rounded-[1.55rem] border border-white/10 bg-ink/90 p-4">
          <img
            src={notificationTriageMap}
            alt="FocusAI notification triage map"
            className="mb-4 h-44 w-full rounded-3xl object-cover"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-white/45">Today</p>
              <h2 className="mt-1 text-2xl font-black">Exam Sprint</h2>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pulse text-white shadow-hot">
              <TimerReset />
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="mx-auto my-8 grid h-56 w-56 place-items-center rounded-full border border-white/10 bg-[conic-gradient(from_180deg,#ffcf33,#ff8a00,#ff5a1f,#ffcf33)] p-3"
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-ink text-center">
              <div>
                <p className="text-5xl font-black">91</p>
                <p className="mt-2 text-xs font-black uppercase text-aqua">Focus score</p>
              </div>
            </div>
          </motion.div>
          <div className="grid gap-3">
            {notifications.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.09 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3"
              >
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{item.app}</p>
                  <p className="truncate text-xs text-white/50">{item.text}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase text-white/70">
                  {item.level}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsStrip() {
  const stats = [
    ['6.8h', 'protected focus'],
    ['84%', 'noise reduced'],
    ['18', 'alerts delayed'],
  ];
  return (
    <div className="mt-8 grid grid-cols-1 gap-2 sm:max-w-xl sm:grid-cols-3">
      {stats.map(([value, label]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-2xl font-black text-volt">{value}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase text-white/45">{label}</p>
        </div>
      ))}
    </div>
  );
}

function FeatureBand() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Core system" title="Three-layer focus intelligence" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {focusCards.map((card, index) => (
            <motion.article
              key={card.title}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={spring}
              className="glass rounded-3xl p-5"
            >
              <div className={`mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${card.accent} text-ink`}>
                <card.icon size={25} />
              </div>
              <p className="text-xl font-black">{card.title}</p>
              <p className="mt-3 leading-7 text-white/60">{card.body}</p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${78 + index * 7}%` }}
                  viewport={{ once: true }}
                  className={`h-full rounded-full bg-gradient-to-r ${card.accent}`}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualShowcase() {
  const visuals = [
    {
      image: studentFocusDashboard,
      title: 'Personal student cockpit',
      body: 'A professional command center that turns signup inputs into study modes, targets, and daily focus actions.',
    },
    {
      image: distractionShieldSystem,
      title: 'AI notification shield',
      body: 'Urgent academic signals pass through, while dopamine-heavy interruptions are delayed or summarized.',
    },
    {
      image: notificationTriageMap,
      title: 'Notification triage map',
      body: 'A live visual system for focus score, interruption load, and momentum recovery.',
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="FocusAI system visuals"
          title="Graphics that explain the actual idea"
          body="The visuals now show notification triage, distraction blocking, academic alert priority, and the student focus cockpit."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {visuals.map((item) => (
            <motion.article key={item.title} whileHover={{ y: -8 }} className="glass overflow-hidden rounded-3xl">
              <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-white/60">{item.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = ['Detect context', 'Rank interruption', 'Decide delivery', 'Coach recovery'];
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
        <SectionTitle eyebrow="Flow" title="From noisy phone to focus-safe signal" />
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-ink/70 p-5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg font-black text-ink">{index + 1}</span>
              <h3 className="mt-6 text-lg font-black">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {index === 0 && 'Reads calendar, study state, device activity, and current attention load.'}
                {index === 1 && 'Scores importance, social pull, deadline impact, and interruption cost.'}
                {index === 2 && 'Allows, summarizes, batches, or silences based on the active student mode.'}
                {index === 3 && 'Suggests a reset ritual when the student loses momentum.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ user, token, logout }) {
  const fallbackPlan = normalizePlan(buildPersonalPlan(user));
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem(`focusai_active_session_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [notificationForm, setNotificationForm] = useState({
    appName: user?.biggestDistraction || 'Instagram',
    message: 'New reels and group messages are waiting',
    context: fallbackPlan.mode,
  });
  const [quickSession, setQuickSession] = useState({
    mode: fallbackPlan.mode,
    durationMinutes: fallbackPlan.blockLength,
    intensity: 'Balanced',
  });
  const [energyCheck, setEnergyCheck] = useState({
    energy: 72,
    stress: 38,
    environment: 'Library',
  });
  const [goalLab, setGoalLab] = useState({
    targetHours: Number(user?.dailyFocusHours || 4),
    deadlineDays: 7,
    difficulty: 68,
  });

  const plan = normalizePlan(dashboard?.plan || fallbackPlan);
  const insights = dashboard?.insights || {
    averageFocusScore: plan.focusScore,
    completedSessions: 0,
    notificationsManaged: 0,
    blockedTotal: plan.blockedAlerts,
    bestMode: plan.mode,
    recoveryTime: plan.blockLength >= 50 ? '6m' : '4m',
    weeklyRhythm: [72, 80, 84, plan.focusScore, 86, 91, 88],
  };
  const sessions = dashboard?.sessions || [];
  const notificationEvents = dashboard?.notificationEvents || plan.notifications.map((item, index) => ({ id: index, ...item }));
  const adaptiveCheck = useMemo(() => buildAdaptiveCheckIn(energyCheck, plan), [energyCheck, plan]);
  const goalProjection = useMemo(() => buildGoalProjection(goalLab, user, plan), [goalLab, user, plan]);

  async function authFetch(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    const data = await response.json();

    if (response.status === 401) {
      logout();
      throw new Error('Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Request failed.');
    }

    return data;
  }

  async function loadDashboard() {
    setLoading(true);
    setNotice('');
    try {
      setDashboard(await authFetch('/api/dashboard'));
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function startFocusSession(overrides = {}) {
    setActionLoading(true);
    setNotice('');
    try {
      const sessionMode = overrides.mode || quickSession.mode || plan.mode;
      const sessionDuration = Number(overrides.durationMinutes || quickSession.durationMinutes || plan.blockLength);
      const sessionFocusScore = Number(overrides.focusScore || plan.focusScore);
      const data = await authFetch('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
          mode: sessionMode,
          focusScore: sessionFocusScore,
          notificationsBlocked: plan.blockedAlerts,
          durationMinutes: sessionDuration,
          notes: overrides.notes || `${quickSession.intensity} custom session. ${plan.recommendation}`,
        }),
      });
      setDashboard((current) => ({
        ...(current || {}),
        sessions: [data.session, ...(current?.sessions || [])],
      }));
      const startedAt = Date.now();
      const sessionForTimer = {
        ...data.session,
        startedAt,
        endsAt: startedAt + Number(data.session.durationMinutes || sessionDuration || 40) * 60 * 1000,
      };
      setActiveSession(sessionForTimer);
      localStorage.setItem(`focusai_active_session_${user?.id || 'guest'}`, JSON.stringify(sessionForTimer));
      setNotice('Focus session started. Timer is now running.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function completeActiveSession() {
    if (!activeSession) {
      return;
    }

    setActionLoading(true);
    setNotice('');
    try {
      const data = await authFetch(`/api/sessions/${activeSession.id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({
          focusScore: plan.focusScore,
          notes: 'Completed from FocusAI dashboard timer.',
        }),
      });
      setDashboard((current) => ({
        ...(current || {}),
        sessions: (current?.sessions || []).map((session) => (session.id === data.session.id ? data.session : session)),
      }));
      setActiveSession(null);
      setRemainingSeconds(0);
      localStorage.removeItem(`focusai_active_session_${user?.id || 'guest'}`);
      setNotice('Focus session completed and saved.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function analyzeCurrentNotification(event) {
    event.preventDefault();
    setActionLoading(true);
    setNotice('');
    try {
      const data = await authFetch('/api/notifications/analyze', {
        method: 'POST',
        body: JSON.stringify(notificationForm),
      });
      setDashboard((current) => ({
        ...(current || {}),
        notificationEvents: [data.analysis, ...(current?.notificationEvents || [])],
      }));
      setNotice(`Notification ${data.analysis.decision}: ${data.analysis.suggestedAction}`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!activeSession?.endsAt) {
      setRemainingSeconds(0);
      return undefined;
    }

    const updateTimer = () => {
      const secondsLeft = Math.max(0, Math.ceil((Number(activeSession.endsAt) - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      if (secondsLeft === 0) {
        localStorage.removeItem(`focusai_active_session_${user?.id || 'guest'}`);
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, [activeSession?.endsAt, user?.id]);

  return (
    <Page>
      <ShellPage
        eyebrow="Personal dashboard"
        title={`Hi ${user?.name?.split(' ')[0] || 'Student'}, your focus system is calibrated.`}
        body={`Goal: ${user?.studyGoal || 'build consistent study momentum'}. FocusAI is tuning alerts around ${user?.examType || 'your academic priority'} and your ${user?.studyWindow || 'best study window'}.`}
      >
        <FocusTimerBanner
          activeSession={activeSession}
          remainingSeconds={remainingSeconds}
          plan={plan}
          onStart={startFocusSession}
          onComplete={completeActiveSession}
          loading={loading || actionLoading}
        />
        {notice && (
          <div className="mb-5 rounded-3xl border border-aqua/20 bg-aqua/10 p-4 text-sm font-bold text-white">
            {notice}
          </div>
        )}
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/45">Recommended mode</p>
                <h2 className="mt-1 text-3xl font-black">{plan.mode}</h2>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pulse shadow-hot">
                <Focus />
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                [`${user?.dailyFocusHours || 4}h`, 'daily target'],
                [insights.blockedTotal, 'alerts managed'],
                [`${insights.averageFocusScore}%`, 'avg focus'],
                [plan.breakCount, 'breaks planned'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-black text-aqua">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase text-white/45">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {modes.map((mode) => (
                <div key={mode.label} className={`flex items-center gap-3 rounded-2xl border p-3 ${mode.tone}`}>
                  <mode.icon size={19} />
                  <span className="font-black">{mode.label}</span>
                  <CheckCircle2 className="ml-auto" size={18} />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-aqua/20 bg-aqua/10 p-4">
              <p className="text-sm font-black uppercase text-aqua">Today&apos;s AI recommendation</p>
              <p className="mt-2 leading-7 text-white/72">{plan.recommendation}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <PersonalFocusVisual user={user} plan={plan} />
            <NotificationAnalyzer
              events={notificationEvents}
              form={notificationForm}
              setForm={setNotificationForm}
              onSubmit={analyzeCurrentNotification}
              loading={actionLoading}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <FlashSessionLab
            quickSession={quickSession}
            setQuickSession={setQuickSession}
            plan={plan}
            onStart={startFocusSession}
            loading={loading || actionLoading}
          />
          <div className="grid gap-4">
            <EnergyCheckIn check={energyCheck} setCheck={setEnergyCheck} result={adaptiveCheck} />
            <GoalPressureLab lab={goalLab} setLab={setGoalLab} projection={goalProjection} />
          </div>
        </div>
        <PersonalPlanGrid plan={plan} user={user} insights={insights} sessions={sessions} />
      </ShellPage>
    </Page>
  );
}

function FocusTimerBanner({ activeSession, remainingSeconds, plan, onStart, onComplete, loading }) {
  const isRunning = Boolean(activeSession && remainingSeconds > 0);
  const isFinished = Boolean(activeSession && remainingSeconds === 0);
  const progress =
    activeSession?.durationMinutes && remainingSeconds
      ? Math.max(0, Math.min(100, (remainingSeconds / (Number(activeSession.durationMinutes) * 60)) * 100))
      : 0;

  return (
    <div
      className={`sticky top-20 z-20 mb-6 overflow-hidden rounded-[1.75rem] border border-aqua/40 bg-ink/90 p-4 backdrop-blur-2xl ${
        isRunning ? 'timer-blink' : 'shadow-glow'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,207,51,0.2),transparent_18rem),linear-gradient(90deg,rgba(255,90,31,0.22),rgba(255,138,0,0.05))]" />
      <div className="relative grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-aqua text-ink shadow-hot">
            <TimerReset className={isRunning ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-volt">{isRunning ? 'Focus session running' : isFinished ? 'Session complete' : 'Ready to focus'}</p>
            <h2 className="mt-1 text-xl font-black">{activeSession?.mode || plan.mode}</h2>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase text-white/45">Live countdown</p>
              <p className="mt-1 font-mono text-5xl font-black leading-none text-volt sm:text-6xl">
                {formatTimer(remainingSeconds || Number(plan.blockLength || 40) * 60)}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-white/50">{plan.block}</p>
              <p className="mt-1 text-xs font-black uppercase text-aqua">Blinking while active</p>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ width: isRunning ? `${progress}%` : isFinished ? '0%' : '100%' }}
              transition={{ duration: 0.35 }}
              className="h-full rounded-full bg-gradient-to-r from-volt via-aqua to-pulse"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          {isRunning ? (
            <button
              type="button"
              onClick={onComplete}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-ink disabled:opacity-60"
            >
              <CheckCircle2 size={18} />
              Complete
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-volt px-5 py-3 font-black text-ink shadow-[0_0_40px_rgba(249,115,22,0.44)] disabled:opacity-60"
            >
              {loading ? <Activity className="animate-spin" size={18} /> : <Play size={18} />}
              Start Timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function FlashSessionLab({ quickSession, setQuickSession, plan, onStart, loading }) {
  const intensityMap = {
    Calm: { score: -4, copy: 'Lower pressure, more recovery space' },
    Balanced: { score: 0, copy: 'Steady sprint with normal notification batching' },
    Extreme: { score: 5, copy: 'Hard lock on distracting alerts' },
  };
  const projectedScore = Math.max(50, Math.min(99, Number(plan.focusScore) + intensityMap[quickSession.intensity].score));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2rem] border border-pulse/30 bg-[linear-gradient(135deg,rgba(255,90,31,0.18),rgba(255,207,51,0.08)),rgba(255,255,255,0.06)] p-5 shadow-hot"
    >
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-volt/30 bg-volt/10 blur-sm" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-volt">Flash session launcher</p>
          <h2 className="mt-2 text-2xl font-black">Build a custom sprint</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Pick mode, minutes, and intensity. Starting it creates a real saved session and launches the live timer.</p>
        </div>
        <Zap className="text-aqua" />
      </div>

      <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
        <label className="rounded-2xl border border-white/10 bg-ink/70 p-4">
          <span className="text-xs font-black uppercase text-white/45">Mode</span>
          <select
            value={quickSession.mode}
            onChange={(event) => setQuickSession((current) => ({ ...current, mode: event.target.value }))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-3 py-3 font-black outline-none ring-aqua/30 focus:ring-4"
          >
            {['Deep Work', 'Exam Sprint', 'Lecture', 'Wind Down'].map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
        <label className="rounded-2xl border border-white/10 bg-ink/70 p-4">
          <span className="text-xs font-black uppercase text-white/45">Minutes</span>
          <input
            type="number"
            min="10"
            max="120"
            value={quickSession.durationMinutes}
            onChange={(event) => setQuickSession((current) => ({ ...current, durationMinutes: event.target.value }))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-xl font-black outline-none ring-aqua/30 focus:ring-4"
          />
        </label>
        <label className="rounded-2xl border border-white/10 bg-ink/70 p-4">
          <span className="text-xs font-black uppercase text-white/45">Intensity</span>
          <select
            value={quickSession.intensity}
            onChange={(event) => setQuickSession((current) => ({ ...current, intensity: event.target.value }))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-3 py-3 font-black outline-none ring-aqua/30 focus:ring-4"
          >
            {Object.keys(intensityMap).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-xs font-black uppercase text-white/45">Projected focus lock</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-black text-volt">{projectedScore}%</p>
            <p className="pb-2 text-sm font-bold text-white/55">{intensityMap[quickSession.intensity].copy}</p>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <motion.div
              animate={{ width: `${projectedScore}%` }}
              className="h-full rounded-full bg-gradient-to-r from-pulse via-aqua to-volt"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            onStart({
              mode: quickSession.mode,
              durationMinutes: quickSession.durationMinutes,
              focusScore: projectedScore,
              notes: `${quickSession.intensity} ${quickSession.mode} sprint created from Flash Session Launcher.`,
            })
          }
          className="inline-flex h-full min-h-20 items-center justify-center gap-2 rounded-2xl bg-volt px-6 py-4 font-black text-ink shadow-[0_0_45px_rgba(255,138,0,0.45)] disabled:opacity-60"
        >
          {loading ? <Activity className="animate-spin" size={18} /> : <Rocket size={18} />}
          Launch Sprint
        </button>
      </div>
    </motion.div>
  );
}

function EnergyCheckIn({ check, setCheck, result }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-aqua/25 bg-white/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-aqua">Energy check-in</p>
          <h3 className="mt-1 text-xl font-black">Tune the system right now</h3>
        </div>
        <Gauge className="text-volt" />
      </div>
      <div className="mt-5 grid gap-4">
        <RangeControl label="Energy" value={check.energy} onChange={(value) => setCheck((current) => ({ ...current, energy: value }))} />
        <RangeControl label="Stress" value={check.stress} onChange={(value) => setCheck((current) => ({ ...current, stress: value }))} />
        <select
          value={check.environment}
          onChange={(event) => setCheck((current) => ({ ...current, environment: event.target.value }))}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 font-black outline-none ring-aqua/30 focus:ring-4"
        >
          {['Library', 'Hostel room', 'Classroom', 'Cafe', 'Home desk'].map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-ink/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase text-white/45">Adaptive mode</p>
          <span className="rounded-xl bg-aqua px-3 py-2 text-xs font-black text-ink">{result.mode}</span>
        </div>
        <p className="mt-3 text-lg font-black text-volt">{result.minutes} minute sprint</p>
        <p className="mt-2 text-sm leading-6 text-white/60">{result.recommendation}</p>
      </div>
    </motion.div>
  );
}

function GoalPressureLab({ lab, setLab, projection }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-volt/25 bg-white/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-volt">Goal pressure lab</p>
          <h3 className="mt-1 text-xl font-black">Preview the study load</h3>
        </div>
        <LineChart className="text-pulse" />
      </div>
      <div className="mt-5 grid gap-4">
        <RangeControl label="Target hours" value={lab.targetHours} min={1} max={10} onChange={(value) => setLab((current) => ({ ...current, targetHours: value }))} />
        <RangeControl label="Deadline days" value={lab.deadlineDays} min={1} max={30} onChange={(value) => setLab((current) => ({ ...current, deadlineDays: value }))} />
        <RangeControl label="Difficulty" value={lab.difficulty} onChange={(value) => setLab((current) => ({ ...current, difficulty: value }))} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          [`${projection.score}%`, 'readiness'],
          [projection.mode, 'mode'],
          [projection.blocks, 'blocks'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <p className="text-xl font-black text-aqua">{value}</p>
            <p className="mt-1 text-[10px] font-black uppercase text-white/40">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-white/60">{projection.copy}</p>
    </motion.div>
  );
}

function RangeControl({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <label>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase text-white/45">{label}</span>
        <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-orange-400"
      />
    </label>
  );
}

function buildAdaptiveCheckIn(check, plan) {
  const energy = Number(check.energy || 0);
  const stress = Number(check.stress || 0);
  const noisyPlace = /hostel|cafe|home/i.test(check.environment);
  const needsRecovery = energy < 45 || stress > 70;
  const minutes = needsRecovery ? 25 : energy > 80 && stress < 45 ? Number(plan.blockLength || 40) + 10 : Number(plan.blockLength || 40);

  return {
    mode: needsRecovery ? 'Recovery Sprint' : noisyPlace ? 'Shielded Deep Work' : plan.mode,
    minutes,
    recommendation: needsRecovery
      ? 'Use a shorter sprint, block social alerts, and take a movement reset before the next session.'
      : noisyPlace
        ? `Your ${check.environment} setup needs stricter batching and visible academic-only alerts.`
        : 'Energy is strong enough for the recommended plan. Keep the timer visible and stay with one task.',
  };
}

function buildGoalProjection(lab, user, plan) {
  const hours = Number(lab.targetHours || 1);
  const days = Number(lab.deadlineDays || 1);
  const difficulty = Number(lab.difficulty || 50);
  const pressure = Math.min(40, Math.round((difficulty / Math.max(days, 1)) * 1.8));
  const score = Math.max(52, Math.min(99, Math.round(Number(plan.focusScore || 85) + hours * 1.6 - pressure / 2)));
  const examMode = hours >= 6 || days <= 3 || difficulty > 82;
  const blocks = Math.max(1, Math.ceil(hours * (examMode ? 1.1 : 0.8)));

  return {
    score,
    mode: examMode ? 'Exam Sprint' : 'Deep Work',
    blocks,
    copy: `${user?.examType || 'Your track'} needs ${blocks} protected blocks. Keep ${user?.biggestDistraction || 'social apps'} delayed until breaks and allow only deadline alerts.`,
  };
}

function PersonalFocusVisual({ user, plan }) {
  const floatingIcons = [BellRing, ShieldCheck, BrainCircuit, Compass];
  const floatingColors = ['text-pulse', 'text-volt', 'text-aqua', 'text-white'];

  return (
    <div className="glass overflow-hidden rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-volt">FocusAI model</p>
          <h2 className="mt-2 text-2xl font-black">Distraction shield</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            {user?.biggestDistraction || 'Social apps'} are routed into low-noise batches while academic alerts stay visible.
          </p>
        </div>
        <Radar className="text-aqua" />
      </div>
      <div className="relative mt-7 h-72 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,138,0,0.28),transparent_12rem),linear-gradient(140deg,rgba(255,90,31,0.22),rgba(255,207,51,0.1))]">
        <motion.div
          animate={{ rotateY: [0, 12, -12, 0], rotateX: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-8 h-48 w-36 -translate-x-1/2 rounded-[2rem] border border-white/20 bg-ink/90 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-white/25" />
          <div className="mt-4 rounded-2xl bg-white/10 p-3">
            <p className="text-xs font-black text-aqua">{plan.mode}</p>
            <p className="mt-2 text-3xl font-black">{plan.focusScore}</p>
            <p className="text-[10px] font-bold uppercase text-white/45">Focus score</p>
          </div>
          <div className="mt-3 grid gap-2">
            <span className="h-3 rounded-full bg-pulse/70" />
            <span className="h-3 w-10/12 rounded-full bg-aqua/70" />
            <span className="h-3 w-7/12 rounded-full bg-volt/70" />
          </div>
        </motion.div>
        {[0, 1, 2, 3].map((item) => (
          (() => {
            const FloatingIcon = floatingIcons[item];
            return (
          <motion.div
            key={item}
            animate={{ y: [0, -14, 0], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 3.5 + item, repeat: Infinity, delay: item * 0.25 }}
            className={`absolute h-16 w-16 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl ${
              ['left-8 top-10', 'right-9 top-20', 'bottom-10 left-12', 'bottom-8 right-12'][item]
            }`}
          >
            <div className="grid h-full place-items-center">
              <FloatingIcon size={24} className={floatingColors[item]} />
            </div>
          </motion.div>
            );
          })()
        ))}
      </div>
    </div>
  );
}

function PersonalPlanGrid({ plan, user, insights, sessions }) {
  const items = [
    ['Focus block', plan.block],
    ['Allowed alerts', plan.allowed],
    ['Muted source', user?.biggestDistraction || 'Social feeds'],
    ['Reset ritual', plan.reset],
  ];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-4">
      {items.map(([label, value], index) => (
        <motion.div
          key={label}
          whileHover={{ y: -6 }}
          className="rounded-3xl border border-white/10 bg-white/10 p-5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-black text-ink">{index + 1}</span>
          <p className="mt-5 text-sm font-black uppercase text-white/45">{label}</p>
          <p className="mt-2 text-lg font-black leading-7">{value}</p>
        </motion.div>
      ))}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 md:col-span-2">
        <p className="text-sm font-black uppercase text-aqua">Saved sessions</p>
        <div className="mt-4 grid gap-3">
          {sessions.length === 0 ? (
            <p className="leading-7 text-white/55">Start a focus session to build your personal history.</p>
          ) : (
            sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/60 p-3">
                <div>
                  <p className="font-black">{session.mode}</p>
                  <p className="text-sm text-white/45">{session.durationMinutes} min planned</p>
                </div>
                <span className="rounded-xl bg-aqua px-3 py-2 text-sm font-black text-ink">{session.focusScore}%</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 md:col-span-2">
        <p className="text-sm font-black uppercase text-pulse">Functional insights</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            [insights.completedSessions, 'completed'],
            [insights.notificationsManaged, 'analyzed'],
            [insights.bestMode, 'best mode'],
            [insights.recoveryTime, 'recovery'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-ink/60 p-3">
              <p className="text-2xl font-black text-volt">{value}</p>
              <p className="mt-1 text-xs font-black uppercase text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildPersonalPlan(user = {}) {
  const hours = Number(user.dailyFocusHours || 4);
  const distraction = (user.biggestDistraction || 'social apps').toLowerCase();
  const exam = user.examType || 'Academics';
  const intense = hours >= 6 || /jee|neet|gate|upsc|exam/i.test(exam);
  const socialHeavy = /instagram|whatsapp|youtube|reel|social|game|gaming/i.test(distraction);

  return {
    mode: intense ? 'Exam Sprint' : 'Deep Work',
    focusScore: intense ? 94 : 88,
    blockedAlerts: socialHeavy ? '36' : '24',
    priorityMatch: intense ? '98%' : '94%',
    breaks: hours >= 6 ? '6' : '4',
    block: intense ? '50 min focus + 10 min break' : '40 min focus + 8 min break',
    allowed: `${exam} deadlines, calendar reminders, mentor messages`,
    reset: socialHeavy ? 'Phone away, 2-minute breathing, restart timer' : 'Stand, water, one-page recap',
    recommendation: socialHeavy
      ? `Keep ${user.biggestDistraction || 'social apps'} batched until your next break. Allow only ${exam} alerts during your highest-energy ${user.studyWindow || 'study window'}.`
      : `Use a calm ${hours}-hour target with scheduled breaks. FocusAI will summarize low-priority alerts after each block.`,
    notifications: [
      { app: exam, text: `${exam} priority alerts are allowed immediately`, level: 'allow', color: 'bg-aqua' },
      { app: user.biggestDistraction || 'Social apps', text: 'Distracting alerts are batched until break time', level: 'batch', color: 'bg-pulse' },
      { app: 'FocusAI Coach', text: `Suggested block: ${intense ? '50/10 sprint' : '40/8 rhythm'}`, level: 'coach', color: 'bg-volt' },
      { app: 'Calendar', text: `${user.studyWindow || 'Best study window'} protected for deep work`, level: 'protect', color: 'bg-royal' },
    ],
  };
}

function normalizePlan(plan = {}) {
  const blockLength = Number(plan.blockLength || 40);
  const breakLength = Number(plan.breakLength || 8);
  const priorityAccuracy = Number(plan.priorityAccuracy || plan.priorityMatch || 94);
  const allowedAlerts = plan.allowedAlerts || (plan.allowed ? [plan.allowed] : [`${plan.examType || 'Academic'} deadlines`, 'calendar reminders']);

  return {
    ...plan,
    focusScore: Number(plan.focusScore || 88),
    blockedAlerts: Number(plan.blockedAlerts || 24),
    priorityAccuracy,
    priorityMatch: `${priorityAccuracy}%`,
    breakCount: Number(plan.breakCount || plan.breaks || 4),
    blockLength,
    breakLength,
    block: plan.block || `${blockLength} min focus + ${breakLength} min break`,
    allowed: plan.allowed || allowedAlerts.join(', '),
    reset: plan.reset || plan.resetRitual || 'Stand, water, one-page recap',
    notifications:
      plan.notifications ||
      [
        { app: plan.examType || 'Academics', text: 'Academic alerts are allowed immediately', level: 'allow', color: 'bg-aqua' },
        { app: plan.biggestDistraction || 'Social apps', text: 'Distracting alerts are batched until break time', level: 'batch', color: 'bg-pulse' },
      ],
  };
}

function NotificationWall({ plan }) {
  return (
    <div className="grid gap-4">
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">AI triage queue</h2>
          <span className="rounded-full bg-volt px-3 py-1 text-xs font-black text-ink">LIVE</span>
        </div>
        <div className="mt-5 grid gap-3">
          {plan.notifications.map((item, index) => (
            <motion.div
              key={`${item.text}-${index}`}
              whileHover={{ x: 6 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/60 p-4"
            >
              <span className={`h-10 w-1.5 rounded-full ${item.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{item.app}</p>
                <p className="truncate text-sm text-white/50">{item.text}</p>
              </div>
              <span className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black uppercase text-white/65">
                {item.level}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard icon={ShieldCheck} title="Silenced safely" value={plan.blockedAlerts} color="text-pulse" />
        <MetricCard icon={CalendarClock} title="Academic priority" value={plan.priorityMatch} color="text-volt" />
      </div>
    </div>
  );
}

function NotificationAnalyzer({ events, form, setForm, onSubmit, loading }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Live notification analyzer</h2>
          <p className="mt-1 text-sm text-white/45">Test any alert against your saved focus profile.</p>
        </div>
        <BellRing className="text-aqua" />
      </div>
      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={form.appName}
            onChange={(event) => setForm((current) => ({ ...current, appName: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4"
            placeholder="App name"
          />
          <select
            value={form.context}
            onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4"
          >
            {['Deep Work', 'Exam Sprint', 'Lecture', 'Break'].map((mode) => (
              <option key={mode} className="bg-ink text-white" value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-24 resize-none rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4"
          placeholder="Notification message"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-aqua px-5 py-4 font-black text-ink shadow-glow disabled:opacity-60"
        >
          {loading ? <Activity className="animate-spin" size={18} /> : <Radar size={18} />}
          Analyze and Save
        </button>
      </form>
      <div className="mt-5 grid gap-3">
        {events.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.id || `${item.message}-${index}`}
            whileHover={{ x: 6 }}
            className="grid gap-3 rounded-2xl border border-white/10 bg-ink/60 p-4 sm:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0">
              <p className="truncate font-black">{item.appName || item.app}</p>
              <p className="mt-1 line-clamp-2 text-sm text-white/52">{item.message || item.text}</p>
              {item.suggestedAction && <p className="mt-2 text-sm font-semibold text-aqua">{item.suggestedAction}</p>}
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <span className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black uppercase text-white/70">
                {item.decision || item.level}
              </span>
              {item.importance && <span className="text-xs font-bold text-white/40">Impact {item.importance}%</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FocusControls({ user, token, logout }) {
  const [controls, setControls] = useState(() => defaultClientControls(user));
  const [draftContact, setDraftContact] = useState({ name: '', relation: '', phone: '' });
  const [draftGroup, setDraftGroup] = useState('');
  const [draftBlockedChat, setDraftBlockedChat] = useState('');
  const [draftBlockedApp, setDraftBlockedApp] = useState('');
  const [draftChannel, setDraftChannel] = useState('');
  const [switchCount, setSwitchCount] = useState(3);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [aiTip, setAiTip] = useState('');
  const decision = buildControlDecision(controls, switchCount, user);

  useEffect(() => {
    requestJson('/api/focus-controls', { token, logout })
      .then((data) => setControls(mergeClientControls(data.controls, user)))
      .catch((error) => setStatus(error.message));
  }, [token]);

  function updateControl(key, value) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function addContact() {
    if (!draftContact.name.trim()) {
      return;
    }
    updateControl('priorityContacts', [
      ...controls.priorityContacts,
      { ...draftContact, allowDuringFocus: true },
    ]);
    setDraftContact({ name: '', relation: '', phone: '' });
  }

  function removeListItem(key, index) {
    updateControl(
      key,
      controls[key].filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function addListItem(key, value, reset) {
    const cleanValue = value.trim();
    if (!cleanValue) {
      return;
    }
    updateControl(key, [...controls[key], cleanValue]);
    reset('');
  }

  async function saveControls() {
    setSaving(true);
    setStatus('');
    try {
      const data = await requestJson('/api/focus-controls', {
        token,
        logout,
        method: 'PATCH',
        body: JSON.stringify(controls),
      });
      setControls(mergeClientControls(data.controls, user));
      setStatus('Focus controls saved. Dashboard decisions will now use these rules.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function generateTip() {
    setSaving(true);
    setAiTip('');
    try {
      const data = await requestJson('/api/coach', {
        token,
        logout,
        method: 'POST',
        body: JSON.stringify({
          message: `Create a short improvement plan from these focus controls:
Priority contacts: ${controls.priorityContacts.map((contact) => contact.name).join(', ')}
Allowed groups: ${controls.allowedGroups.join(', ')}
Blocked chats: ${controls.blockedChats.join(', ')}
Blocked apps: ${controls.blockedApps.join(', ')}
Study channels: ${controls.studyChannels.join(', ')}
App switches in ${controls.alertWindowMinutes} minutes: ${switchCount}
Switch alert limit: ${controls.appSwitchLimit}
Custom rule: ${controls.customRule}`,
        }),
      });
      setAiTip(data.reply || data.fallback || decision.recommendation);
    } catch (error) {
      setAiTip(error.message || decision.recommendation);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <ShellPage
        eyebrow="Focus controls"
        title="Build your personal distraction firewall"
        body="Configure priority contacts, WhatsApp filters, blocked apps, YouTube study mode, and app-switch alerts from your own inputs."
      >
        {status && <div className="mb-5 rounded-3xl border border-aqua/25 bg-aqua/10 p-4 text-sm font-bold">{status}</div>}
        <FeatureSuiteLinks />
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            <ControlPanel title="Priority contacts" icon={User} accent="text-volt">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={draftContact.name} onChange={(event) => setDraftContact((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4" placeholder="Name" />
                <input value={draftContact.relation} onChange={(event) => setDraftContact((current) => ({ ...current, relation: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4" placeholder="Relation" />
                <input value={draftContact.phone} onChange={(event) => setDraftContact((current) => ({ ...current, phone: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4" placeholder="Phone" />
              </div>
              <button type="button" onClick={addContact} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-volt px-4 py-3 font-black text-ink">
                <UserPlus size={17} />
                Add Contact
              </button>
              <div className="mt-4 grid gap-3">
                {controls.priorityContacts.map((contact, index) => (
                  <ControlRow key={`${contact.name}-${index}`} title={contact.name} body={`${contact.relation || 'Priority'} ${contact.phone ? `- ${contact.phone}` : ''}`} badge="Allowed" onRemove={() => removeListItem('priorityContacts', index)} />
                ))}
              </div>
            </ControlPanel>

            <ControlPanel title="WhatsApp and group filter" icon={MessageSquareWarning} accent="text-aqua">
              <EditableTagList title="Allowed groups" items={controls.allowedGroups} value={draftGroup} setValue={setDraftGroup} onAdd={() => addListItem('allowedGroups', draftGroup, setDraftGroup)} onRemove={(index) => removeListItem('allowedGroups', index)} />
              <EditableTagList title="Blocked chats" items={controls.blockedChats} value={draftBlockedChat} setValue={setDraftBlockedChat} onAdd={() => addListItem('blockedChats', draftBlockedChat, setDraftBlockedChat)} onRemove={(index) => removeListItem('blockedChats', index)} placeholder="Personal chats" />
            </ControlPanel>

            <ControlPanel title="Blocked apps" icon={ShieldCheck} accent="text-pulse">
              <EditableTagList title="Apps blocked during study mode" items={controls.blockedApps} value={draftBlockedApp} setValue={setDraftBlockedApp} onAdd={() => addListItem('blockedApps', draftBlockedApp, setDraftBlockedApp)} onRemove={(index) => removeListItem('blockedApps', index)} placeholder="Instagram, Games..." />
            </ControlPanel>
          </div>

          <div className="grid gap-4">
            <ControlPanel title="YouTube study mode" icon={Play} accent="text-volt">
              <EditableTagList title="Allowed study content" items={controls.studyChannels} value={draftChannel} setValue={setDraftChannel} onAdd={() => addListItem('studyChannels', draftChannel, setDraftChannel)} onRemove={(index) => removeListItem('studyChannels', index)} placeholder="Lectures, tutorials..." />
              <label className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-ink/70 p-4">
                <span className="font-black">Allow study music</span>
                <input type="checkbox" checked={controls.studyMusicAllowed} onChange={(event) => updateControl('studyMusicAllowed', event.target.checked)} className="h-5 w-5 accent-orange-400" />
              </label>
            </ControlPanel>

            <ControlPanel title="AI distraction alert" icon={BellRing} accent="text-pulse">
              <RangeControl label="App switch limit" value={controls.appSwitchLimit} min={1} max={20} onChange={(value) => updateControl('appSwitchLimit', value)} />
              <RangeControl label="Alert window minutes" value={controls.alertWindowMinutes} min={5} max={60} onChange={(value) => updateControl('alertWindowMinutes', value)} />
              <RangeControl label="Current app switches" value={switchCount} min={0} max={30} onChange={setSwitchCount} />
              <div className={`mt-5 rounded-3xl border p-5 ${decision.alert ? 'border-pulse/40 bg-pulse/15' : 'border-aqua/30 bg-aqua/10'}`}>
                <p className="text-sm font-black uppercase text-white/50">Live alert decision</p>
                <h3 className="mt-2 text-2xl font-black">{decision.alert ? 'Return to study' : 'Focus stable'}</h3>
                <p className="mt-2 leading-7 text-white/65">{decision.alertText}</p>
              </div>
            </ControlPanel>

            <ControlPanel title="Notification decision cockpit" icon={Radar} accent="text-aqua">
              <div className="grid gap-3 sm:grid-cols-2">
                <DecisionList title="Allowed" items={[...controls.priorityContacts.map((contact) => contact.name), ...controls.allowedGroups, ...controls.studyChannels.slice(0, 2)]} tone="bg-aqua/15 border-aqua/30 text-aqua" />
                <DecisionList title="Blocked" items={[...controls.blockedApps, ...controls.blockedChats]} tone="bg-pulse/15 border-pulse/30 text-pulse" />
              </div>
              <textarea value={controls.customRule} onChange={(event) => updateControl('customRule', event.target.value)} className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-ink/80 p-4 font-semibold outline-none ring-aqua/30 focus:ring-4" />
            </ControlPanel>

            <div className="glass rounded-[2rem] p-5">
              <p className="text-sm font-black uppercase text-volt">AI recommendations</p>
              <p className="mt-3 leading-7 text-white/65">{aiTip || decision.recommendation}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={saveControls} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-volt px-5 py-4 font-black text-ink disabled:opacity-60">
                  {saving ? <Activity className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  Save Controls
                </button>
                <button type="button" onClick={generateTip} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-black text-white disabled:opacity-60">
                  <WandSparkles size={18} />
                  AI Improve
                </button>
              </div>
            </div>
          </div>
        </div>
      </ShellPage>
    </Page>
  );
}

function ControlPanel({ title, icon: Icon, accent, children }) {
  return (
    <motion.section whileHover={{ y: -4 }} className="glass rounded-[2rem] p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black">{title}</h2>
        <Icon className={accent} />
      </div>
      {children}
    </motion.section>
  );
}

function ControlRow({ title, body, badge, onRemove }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink/70 p-4">
      <div className="min-w-0">
        <p className="truncate font-black">{title}</p>
        <p className="mt-1 truncate text-sm text-white/45">{body}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-xl bg-aqua px-3 py-2 text-xs font-black text-ink">{badge}</span>
        <button type="button" onClick={onRemove} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function EditableTagList({ title, items, value, setValue, onAdd, onRemove, placeholder = 'Add item' }) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="text-sm font-black uppercase text-white/45">{title}</p>
      <div className="mt-3 flex gap-2">
        <input value={value} onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 font-semibold outline-none ring-aqua/30 focus:ring-4" placeholder={placeholder} />
        <button type="button" onClick={onAdd} className="rounded-2xl bg-aqua px-4 py-3 font-black text-ink">Add</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button key={`${item}-${index}`} type="button" onClick={() => onRemove(index)} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white/75">
            {item} x
          </button>
        ))}
      </div>
    </div>
  );
}

function DecisionList({ title, items, tone }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="font-black">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.slice(0, 6).map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-xl bg-black/30 px-3 py-2 text-sm font-bold text-white">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function defaultClientControls(user = {}) {
  const distraction = user?.biggestDistraction || 'Instagram';
  const examType = user?.examType || 'Academics';
  return {
    priorityContacts: [
      { name: 'Parent / Guardian', relation: 'Emergency', phone: '', allowDuringFocus: true },
      { name: 'Faculty Mentor', relation: examType, phone: '', allowDuringFocus: true },
    ],
    allowedGroups: [`${examType} updates`, 'College group', 'Assignments'],
    blockedChats: ['Personal chats', 'Random groups'],
    blockedApps: [distraction, 'Snapchat', 'YouTube Shorts', 'Games'],
    studyChannels: ['Educational videos', 'Tutorials', 'Lectures', `${examType} revision`],
    studyMusicAllowed: true,
    appSwitchLimit: 5,
    alertWindowMinutes: 10,
    customRule: `Allow ${examType} deadlines and emergency contacts. Batch ${distraction} until breaks.`,
  };
}

function mergeClientControls(controls = {}, user) {
  return { ...defaultClientControls(user), ...controls };
}

function buildControlDecision(controls, switchCount, user = {}) {
  const blockedApps = controls.blockedApps.join(', ');
  const allowedCount = controls.priorityContacts.length + controls.allowedGroups.length + controls.studyChannels.length;
  const alert = Number(switchCount) >= Number(controls.appSwitchLimit);
  return {
    alert,
    alertText: alert
      ? `You switched apps ${switchCount} times in ${controls.alertWindowMinutes} minutes. Block ${blockedApps} and return to one study task.`
      : `Only ${switchCount} switches tracked. Priority contacts and study groups can still reach you.`,
    recommendation: `FocusAI will allow ${allowedCount} priority sources, block ${blockedApps}, and keep ${user?.studyGoal || 'your study goal'} protected with this custom rule: ${controls.customRule}`,
  };
}

function FeatureSuiteLinks() {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {featurePages.map((feature) => {
        const Icon = feature.icon;
        return (
          <Link key={feature.path} to={feature.path} className="group rounded-3xl border border-white/10 bg-white/10 p-4 transition hover:-translate-y-1 hover:border-aqua/40 hover:bg-aqua/10">
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-aqua shadow-glow">
                <Icon size={20} />
              </div>
              <ChevronRight className="text-white/35 transition group-hover:text-volt" />
            </div>
            <p className="mt-4 font-black">{feature.label}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/50">{feature.body}</p>
          </Link>
        );
      })}
    </div>
  );
}

function FeatureSuitePage({ featureId, user, token, logout }) {
  const feature = featurePages.find((item) => item.id === featureId) || featurePages[0];
  const Icon = feature.icon;
  const [controls, setControls] = useState(() => defaultClientControls(user));
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [switchCount, setSwitchCount] = useState(3);
  const [draft, setDraft] = useState('');
  const [contactDraft, setContactDraft] = useState({ name: '', relation: '', phone: '' });
  const [preview, setPreview] = useState({
    appName: user?.biggestDistraction || 'Instagram',
    message: 'New reel and chat messages are waiting',
    context: 'Deep Work',
  });
  const [aiTip, setAiTip] = useState('');
  const plan = normalizePlan(dashboard?.plan || buildPersonalPlan(user));
  const decision = buildControlDecision(controls, switchCount, user);
  const previewDecision = buildLocalNotificationDecision(preview, controls, user);

  useEffect(() => {
    Promise.all([
      requestJson('/api/focus-controls', { token, logout }),
      requestJson('/api/dashboard', { token, logout }).catch(() => null),
    ])
      .then(([controlsData, dashboardData]) => {
        setControls(mergeClientControls(controlsData.controls, user));
        setDashboard(dashboardData);
      })
      .catch((error) => setStatus(error.message));
  }, [featureId, token]);

  function updateControl(key, value) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function addItem(key) {
    const cleanValue = draft.trim();
    if (!cleanValue) {
      return;
    }
    updateControl(key, [...controls[key], cleanValue]);
    setDraft('');
  }

  function removeItem(key, index) {
    updateControl(
      key,
      controls[key].filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function addPriorityContact() {
    if (!contactDraft.name.trim()) {
      return;
    }
    updateControl('priorityContacts', [...controls.priorityContacts, { ...contactDraft, allowDuringFocus: true }]);
    setContactDraft({ name: '', relation: '', phone: '' });
  }

  async function saveControls() {
    setSaving(true);
    setStatus('');
    try {
      const data = await requestJson('/api/focus-controls', {
        token,
        logout,
        method: 'PATCH',
        body: JSON.stringify(controls),
      });
      setControls(mergeClientControls(data.controls, user));
      setStatus(`${feature.label} saved successfully.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function askAi() {
    setSaving(true);
    setAiTip('');
    try {
      const data = await requestJson('/api/coach', {
        token,
        logout,
        method: 'POST',
        body: JSON.stringify({
          message: `Give recommendations for ${feature.title}.
Study goal: ${user?.studyGoal || plan.studyGoal}
Mode: ${plan.mode}
Priority contacts: ${controls.priorityContacts.map((contact) => contact.name).join(', ')}
Allowed groups: ${controls.allowedGroups.join(', ')}
Blocked apps: ${controls.blockedApps.join(', ')}
Blocked chats: ${controls.blockedChats.join(', ')}
Study channels: ${controls.studyChannels.join(', ')}
Switch rule: ${controls.appSwitchLimit} switches in ${controls.alertWindowMinutes} minutes
Custom rule: ${controls.customRule}`,
        }),
      });
      setAiTip(data.reply || data.fallback || decision.recommendation);
    } catch (error) {
      setAiTip(error.message || decision.recommendation);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <ShellPage eyebrow="FocusAI feature suite" title={feature.title} body={feature.body}>
        {status && <div className="mb-5 rounded-3xl border border-aqua/25 bg-aqua/10 p-4 text-sm font-bold">{status}</div>}
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-aqua">{feature.label}</p>
                <h2 className="mt-2 text-3xl font-black">{plan.mode}</h2>
                <p className="mt-3 leading-7 text-white/60">{decision.recommendation}</p>
              </div>
              <Icon className="text-volt" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                [controls.priorityContacts.length, 'contacts'],
                [controls.allowedGroups.length, 'groups'],
                [controls.blockedApps.length, 'blocked apps'],
                [`${controls.appSwitchLimit}/${controls.alertWindowMinutes}m`, 'switch rule'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-2xl font-black text-volt">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-white/45">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              <Link to="/controls" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-black text-white">
                <Command size={18} />
                Open All Controls
              </Link>
              <button type="button" onClick={saveControls} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-volt px-5 py-4 font-black text-ink disabled:opacity-60">
                {saving ? <Activity className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Save Page Settings
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {renderFeatureEditor({
              featureId,
              controls,
              updateControl,
              draft,
              setDraft,
              addItem,
              removeItem,
              contactDraft,
              setContactDraft,
              addPriorityContact,
              switchCount,
              setSwitchCount,
              decision,
              preview,
              setPreview,
              previewDecision,
              aiTip,
              askAi,
              saving,
              plan,
              user,
            })}
          </div>
        </div>
      </ShellPage>
    </Page>
  );
}

function renderFeatureEditor(props) {
  const {
    featureId,
    controls,
    updateControl,
    draft,
    setDraft,
    addItem,
    removeItem,
    contactDraft,
    setContactDraft,
    addPriorityContact,
    switchCount,
    setSwitchCount,
    decision,
    preview,
    setPreview,
    previewDecision,
    aiTip,
    askAi,
    saving,
    plan,
    user,
  } = props;

  if (featureId === 'priority-contacts') {
    return (
      <ControlPanel title="Allowed people" icon={User} accent="text-volt">
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={contactDraft.name} onChange={(event) => setContactDraft((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 outline-none ring-aqua/30 focus:ring-4" placeholder="Name" />
          <input value={contactDraft.relation} onChange={(event) => setContactDraft((current) => ({ ...current, relation: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 outline-none ring-aqua/30 focus:ring-4" placeholder="Relation" />
          <input value={contactDraft.phone} onChange={(event) => setContactDraft((current) => ({ ...current, phone: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 outline-none ring-aqua/30 focus:ring-4" placeholder="Phone" />
        </div>
        <button type="button" onClick={addPriorityContact} className="mt-3 rounded-2xl bg-aqua px-4 py-3 font-black text-ink">Add Contact</button>
        <div className="mt-4 grid gap-3">
          {controls.priorityContacts.map((contact, index) => (
            <ControlRow key={`${contact.name}-${index}`} title={contact.name} body={`${contact.relation || 'Priority'} ${contact.phone ? `- ${contact.phone}` : ''}`} badge="Allowed" onRemove={() => removeItem('priorityContacts', index)} />
          ))}
        </div>
      </ControlPanel>
    );
  }

  if (featureId === 'whatsapp-filter') {
    return (
      <ControlPanel title="Message filtering" icon={MessageSquareWarning} accent="text-aqua">
        <EditableTagList title="Allowed academic groups" items={controls.allowedGroups} value={draft} setValue={setDraft} onAdd={() => addItem('allowedGroups')} onRemove={(index) => removeItem('allowedGroups', index)} />
        <EditableTagList title="Blocked chats" items={controls.blockedChats} value={draft} setValue={setDraft} onAdd={() => addItem('blockedChats')} onRemove={(index) => removeItem('blockedChats', index)} placeholder="Friends, random group..." />
      </ControlPanel>
    );
  }

  if (featureId === 'blocked-apps') {
    return (
      <ControlPanel title="Blocked during focus" icon={ShieldCheck} accent="text-pulse">
        <EditableTagList title="Blocked apps" items={controls.blockedApps} value={draft} setValue={setDraft} onAdd={() => addItem('blockedApps')} onRemove={(index) => removeItem('blockedApps', index)} placeholder="Instagram, game, shorts..." />
        <textarea value={controls.customRule} onChange={(event) => updateControl('customRule', event.target.value)} className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-ink/80 p-4 outline-none ring-aqua/30 focus:ring-4" />
      </ControlPanel>
    );
  }

  if (featureId === 'youtube-study') {
    return (
      <ControlPanel title="Allowed study content" icon={Play} accent="text-volt">
        <EditableTagList title="Study channels and content" items={controls.studyChannels} value={draft} setValue={setDraft} onAdd={() => addItem('studyChannels')} onRemove={(index) => removeItem('studyChannels', index)} placeholder="Lectures, playlists..." />
        <label className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-ink/70 p-4">
          <span className="font-black">Allow study music during focus</span>
          <input type="checkbox" checked={controls.studyMusicAllowed} onChange={(event) => updateControl('studyMusicAllowed', event.target.checked)} className="h-5 w-5 accent-orange-400" />
        </label>
      </ControlPanel>
    );
  }

  if (featureId === 'notification-decisions') {
    return (
      <ControlPanel title="Try a notification" icon={BellRing} accent="text-aqua">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={preview.appName} onChange={(event) => setPreview((current) => ({ ...current, appName: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 outline-none ring-aqua/30 focus:ring-4" placeholder="App name" />
          <select value={preview.context} onChange={(event) => setPreview((current) => ({ ...current, context: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 outline-none ring-aqua/30 focus:ring-4">
            {['Deep Work', 'Exam Sprint', 'Lecture', 'Break'].map((item) => <option key={item} className="bg-ink" value={item}>{item}</option>)}
          </select>
        </div>
        <textarea value={preview.message} onChange={(event) => setPreview((current) => ({ ...current, message: event.target.value }))} className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-ink/80 p-4 outline-none ring-aqua/30 focus:ring-4" />
        <div className="mt-4 rounded-3xl border border-aqua/25 bg-aqua/10 p-5">
          <p className="text-sm font-black uppercase text-aqua">Decision: {previewDecision.decision}</p>
          <p className="mt-2 leading-7 text-white/70">{previewDecision.reason}</p>
        </div>
      </ControlPanel>
    );
  }

  if (featureId === 'distraction-alert') {
    return (
      <ControlPanel title="Switch detector" icon={Radar} accent="text-pulse">
        <RangeControl label="Current app switches" value={switchCount} min={0} max={30} onChange={setSwitchCount} />
        <RangeControl label="Switch limit" value={controls.appSwitchLimit} min={1} max={20} onChange={(value) => updateControl('appSwitchLimit', value)} />
        <RangeControl label="Alert window minutes" value={controls.alertWindowMinutes} min={5} max={60} onChange={(value) => updateControl('alertWindowMinutes', value)} />
        <div className={`mt-5 rounded-3xl border p-5 ${decision.alert ? 'border-pulse/40 bg-pulse/15' : 'border-aqua/30 bg-aqua/10'}`}>
          <h3 className="text-2xl font-black">{decision.alert ? 'Distraction alert active' : 'Focus stable'}</h3>
          <p className="mt-2 leading-7 text-white/65">{decision.alertText}</p>
        </div>
      </ControlPanel>
    );
  }

  if (featureId === 'ai-recommendations') {
    return (
      <ControlPanel title="AI recommendations" icon={WandSparkles} accent="text-volt">
        <button type="button" onClick={askAi} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-aqua px-5 py-4 font-black text-ink disabled:opacity-60">
          {saving ? <Activity className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
          Generate Recommendations
        </button>
        <div className="mt-5 rounded-3xl border border-white/10 bg-ink/70 p-5">
          <p className="text-sm font-black uppercase text-volt">Output</p>
          <p className="mt-3 whitespace-pre-line leading-8 text-white/70">{aiTip || decision.recommendation}</p>
        </div>
      </ControlPanel>
    );
  }

  if (featureId === 'planner') {
    return (
      <ControlPanel title="Next session plan" icon={CalendarClock} accent="text-aqua">
        {[
          `Start with ${plan.blockLength} minutes of ${plan.mode}.`,
          `Allow ${controls.priorityContacts.length} priority contacts and ${controls.allowedGroups.length} academic groups.`,
          `Block ${controls.blockedApps.join(', ')} until your next break.`,
          controls.studyMusicAllowed ? 'Study music is allowed if it does not trigger app switching.' : 'Study music is disabled for this block.',
        ].map((item, index) => (
          <div key={item} className="mb-3 rounded-2xl border border-white/10 bg-ink/70 p-4">
            <p className="text-sm font-black uppercase text-white/35">Step {index + 1}</p>
            <p className="mt-1 font-bold text-white/75">{item}</p>
          </div>
        ))}
      </ControlPanel>
    );
  }

  return (
    <ControlPanel title="Study mode setup" icon={Focus} accent="text-volt">
      <RangeControl label="Switch limit" value={controls.appSwitchLimit} min={1} max={20} onChange={(value) => updateControl('appSwitchLimit', value)} />
      <RangeControl label="Alert window minutes" value={controls.alertWindowMinutes} min={5} max={60} onChange={(value) => updateControl('alertWindowMinutes', value)} />
      <textarea value={controls.customRule} onChange={(event) => updateControl('customRule', event.target.value)} className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-ink/80 p-4 outline-none ring-aqua/30 focus:ring-4" />
      <p className="mt-4 leading-7 text-white/60">{decision.recommendation}</p>
    </ControlPanel>
  );
}

function buildLocalNotificationDecision(preview, controls, user = {}) {
  const text = `${preview.appName} ${preview.message}`.toLowerCase();
  const allowed = [...controls.allowedGroups, ...controls.studyChannels, ...controls.priorityContacts.map((contact) => contact.name)].some((item) =>
    text.includes(String(item).toLowerCase()),
  );
  const blocked = [...controls.blockedApps, ...controls.blockedChats].some((item) => text.includes(String(item).toLowerCase()));
  const urgent = /urgent|deadline|exam|test|today|tomorrow|emergency|call/i.test(preview.message);

  if (allowed || urgent) {
    return { decision: 'allow', reason: `This alert matches a priority source for ${user?.examType || 'your study track'} or looks urgent.` };
  }

  if (blocked) {
    return { decision: preview.context === 'Break' ? 'summarize' : 'batch', reason: 'This source is in your blocked app or blocked chat controls.' };
  }

  return { decision: 'summarize', reason: 'This does not match a priority rule, so FocusAI would convert it into a focus-safe summary.' };
}

function Profile({ user, token, saveAuth, logout, onboarding = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    studyGoal: user?.studyGoal || '',
    examType: user?.examType || '',
    dailyFocusHours: String(user?.dailyFocusHours || 4),
    biggestDistraction: user?.biggestDistraction || '',
    studyWindow: user?.studyWindow || '',
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      const data = await requestJson('/api/profile', {
        token,
        logout,
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      saveAuth(data);
      setStatus(onboarding ? 'Setup complete. Opening your personalized dashboard...' : 'Profile updated. Your dashboard recommendations will recalibrate instantly.');
      if (onboarding) {
        setTimeout(() => navigate('/dashboard', { replace: true }), 700);
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <ShellPage
        eyebrow={onboarding ? 'Focus setup' : 'Student profile'}
        title={onboarding ? 'Personalize your focus engine' : 'Tune your personal focus engine'}
        body={onboarding ? 'Now add your study goal and distraction pattern so FocusAI can generate useful dashboard results.' : 'Update the inputs that power your plan, notification decisions, AI coach prompts, and analytics.'}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
          <form onSubmit={saveProfile} className="glass rounded-[2rem] p-5 sm:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <AuthInput icon={User} label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
              <AuthInput icon={GraduationCap} label="Exam or track" value={form.examType} onChange={(value) => setForm((current) => ({ ...current, examType: value }))} />
              <div className="md:col-span-2">
                <AuthInput icon={Compass} label="Study goal" value={form.studyGoal} onChange={(value) => setForm((current) => ({ ...current, studyGoal: value }))} />
              </div>
              <AuthSelect
                icon={TimerReset}
                label="Daily focus target"
                value={form.dailyFocusHours}
                onChange={(value) => setForm((current) => ({ ...current, dailyFocusHours: value }))}
                options={['2', '3', '4', '5', '6', '8']}
              />
              <AuthInput
                icon={MessageSquareWarning}
                label="Biggest distraction"
                value={form.biggestDistraction}
                onChange={(value) => setForm((current) => ({ ...current, biggestDistraction: value }))}
              />
              <div className="md:col-span-2">
                <AuthInput icon={CalendarClock} label="Best study window" value={form.studyWindow} onChange={(value) => setForm((current) => ({ ...current, studyWindow: value }))} />
              </div>
            </div>
            {status && <div className="mt-5 rounded-2xl border border-aqua/20 bg-aqua/10 p-4 text-sm font-bold">{status}</div>}
            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-volt px-5 py-4 font-black text-ink disabled:opacity-60"
            >
              {saving ? <Activity className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              {onboarding ? 'Finish Setup' : 'Save Personalization'}
            </button>
          </form>
          <div className="glass overflow-hidden rounded-[2rem]">
            <img src={studentFocusDashboard} alt="Personal FocusAI dashboard console" className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-sm font-black uppercase text-aqua">How this changes results</p>
              <p className="mt-3 leading-7 text-white/65">
                Higher focus targets create longer sprint recommendations. Social distractions increase batching. Exam-heavy tracks make academic alerts pass through faster.
              </p>
            </div>
          </div>
        </div>
      </ShellPage>
    </Page>
  );
}

function Coach({ token, logout }) {
  const [input, setInput] = useState('I have a DSA test tomorrow and social apps keep distracting me.');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  async function askCoach() {
    setLoading(true);
    setReply('');
    try {
      const response = await fetch(`${API_URL}/api/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      if (response.status === 401) {
        logout();
        throw new Error('Please login again to use the AI coach.');
      }
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'AI coach request failed.');
      }
      setReply(data.reply || data.fallback || 'FocusAI recommends a 45-minute block, social app mute, and a 7-minute reset break.');
    } catch (coachError) {
      setReply(coachError.message || 'Demo response: run one 45-minute sprint, batch social apps, allow only academic deadlines, then take a 7-minute reset.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <ShellPage eyebrow="OpenRouter AI" title="Context-aware focus coach" body="Ask the AI to classify distractions, tune your focus mode, or plan a recovery sprint after an interruption.">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="glass rounded-3xl p-5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-44 w-full resize-none rounded-3xl border border-white/10 bg-ink/80 p-4 text-base leading-7 text-white outline-none ring-aqua/30 focus:ring-4"
            />
            <button
              type="button"
              onClick={askCoach}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-5 py-4 font-black text-ink shadow-glow sm:w-auto"
            >
              {loading ? <Activity className="animate-spin" size={19} /> : <WandSparkles size={19} />}
              Generate Focus Plan
            </button>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-black uppercase text-volt">AI response</p>
              <p className="mt-3 min-h-24 leading-8 text-white/70">
                {reply || 'Your personalized focus plan will appear here once the backend is running with an OpenRouter key.'}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ['Urgent academic alerts', 'Allow instantly with a clear deadline banner.', BellRing],
              ['Social loops', 'Batch into a 20-second summary after the sprint.', MessageSquareWarning],
              ['Low energy detected', 'Suggest shorter sprints and movement breaks.', Gauge],
            ].map(([title, body, Icon]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <Icon className="text-pulse" />
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 leading-7 text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </ShellPage>
    </Page>
  );
}

function Insights({ token, logout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    requestJson('/api/dashboard', { token, logout })
      .then(setData)
      .catch((loadError) => setError(loadError.message));
  }, []);

  const insights = data?.insights || {
    weeklyRhythm: [78, 92, 65, 88, 96, 73, 84],
    bestMode: 'Deep Work',
    recoveryTime: '4m',
    averageFocusScore: 88,
    completedSessions: 0,
    notificationsManaged: 0,
  };
  const plan = normalizePlan(data?.plan || buildPersonalPlan(data?.user || {}));
  const sessions = data?.sessions || [];
  const notificationEvents = data?.notificationEvents || [];
  const analytics = buildRealisticAnalytics({ insights, plan, sessions, notificationEvents, user: data?.user });

  async function generateLaggingPlan() {
    setAiLoading(true);
    setAiAdvice('');
    try {
      const response = await fetch(`${API_URL}/api/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: `Analyze where I am currently lagging and give a practical improvement plan.
Focus score: ${analytics.focusScore}%
Consistency: ${analytics.consistency}%
Completion rate: ${analytics.completionRate}%
Notification pressure: ${analytics.notificationPressure}%
Weakest area: ${analytics.weakest.label} at ${analytics.weakest.value}%
Recent sessions: ${sessions.map((session) => `${session.mode} ${session.durationMinutes}min ${session.focusScore}%`).join('; ') || 'no saved sessions yet'}
Recent notification decisions: ${notificationEvents.map((event) => `${event.appName}:${event.decision}`).join('; ') || 'no analyzed notifications yet'}`,
        }),
      });
      const result = await response.json();
      if (response.status === 401) {
        logout();
        throw new Error('Please login again to use the AI improvement coach.');
      }
      if (!response.ok) {
        throw new Error(result.detail || result.error || 'AI analysis failed.');
      }
      setAiAdvice(result.reply || result.fallback || analytics.fallbackAdvice);
    } catch (lagError) {
      setAiAdvice(lagError.message || analytics.fallbackAdvice);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <Page>
      <ShellPage eyebrow="Live analytics" title="Insights from your saved focus activity" body="Charts now react to your sessions, notification decisions, focus score, target hours, and AI improvement feedback.">
        {error && <div className="mb-5 rounded-3xl border border-pulse/30 bg-pulse/10 p-4 text-sm font-bold">{error}</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Rocket} title="Real focus score" value={`${analytics.focusScore}%`} color="text-pulse" />
          <MetricCard icon={AlarmClockCheck} title="Completion rate" value={`${analytics.completionRate}%`} color="text-volt" />
          <MetricCard icon={BellRing} title="Notification pressure" value={`${analytics.notificationPressure}%`} color="text-aqua" />
          <MetricCard icon={Command} title="Lagging area" value={analytics.weakest.label} color="text-volt" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Weekly focus rhythm</h2>
                <p className="mt-1 text-sm text-white/45">Generated from saved sessions plus your target profile.</p>
              </div>
              <LineChart className="text-aqua" />
            </div>
            <FocusBarChart bars={analytics.weeklyBars} />
          </div>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-volt">Performance radar</p>
                <h2 className="mt-1 text-xl font-black">Where you stand</h2>
              </div>
              <Radar className="text-pulse" />
            </div>
            <RadarScoreChart items={analytics.radar} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-aqua">Notification decisions</p>
                <h2 className="mt-1 text-xl font-black">Distraction mix</h2>
              </div>
              <BellRing className="text-volt" />
            </div>
            <DecisionDonutChart decisions={analytics.decisions} />
          </div>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-pulse">AI improvement coach</p>
                <h2 className="mt-1 text-2xl font-black">Find where you are lagging</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">Uses your current scores, saved sessions, and notification history to generate a specific improvement plan.</p>
              </div>
              <BrainCircuit className="text-aqua" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {analytics.radar.slice(0, 3).map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-2xl font-black text-volt">{item.value}%</p>
                  <p className="mt-1 text-xs font-black uppercase text-white/45">{item.label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={generateLaggingPlan}
              disabled={aiLoading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-5 py-4 font-black text-ink shadow-glow disabled:opacity-60 sm:w-auto"
            >
              {aiLoading ? <Activity className="animate-spin" size={18} /> : <WandSparkles size={18} />}
              Generate AI Improvement Plan
            </button>
            <div className="mt-5 min-h-36 rounded-3xl border border-white/10 bg-ink/70 p-5">
              <p className="text-sm font-black uppercase text-volt">Coach output</p>
              <p className="mt-3 whitespace-pre-line leading-8 text-white/70">{aiAdvice || analytics.fallbackAdvice}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-black uppercase text-volt">Recent sessions</p>
            <div className="mt-4 grid gap-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/60 p-4">
                  <div>
                    <p className="font-black">{session.mode}</p>
                    <p className="text-sm text-white/45">{session.durationMinutes} minutes · {session.endedAt ? 'completed' : 'running or saved'}</p>
                  </div>
                  <span className="rounded-xl bg-white px-3 py-2 font-black text-ink">{session.focusScore}%</span>
                </div>
              ))}
              {sessions.length === 0 && <p className="leading-7 text-white/55">No sessions yet. Start one from the dashboard.</p>}
            </div>
          </div>
          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-black uppercase text-pulse">Recent notification decisions</p>
            <div className="mt-4 grid gap-3">
              {notificationEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-ink/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black">{event.appName}</p>
                    <span className="rounded-xl border border-white/10 px-3 py-1 text-xs font-black uppercase text-white/70">{event.decision}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/52">{event.suggestedAction}</p>
                </div>
              ))}
              {notificationEvents.length === 0 && <p className="leading-7 text-white/55">Analyze notifications from the dashboard to fill this feed.</p>}
            </div>
          </div>
        </div>
      </ShellPage>
    </Page>
  );
}

function FocusBarChart({ bars }) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="mt-8 flex h-72 items-end gap-3">
      {bars.map((height, index) => (
        <div key={labels[index]} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-60 w-full items-end rounded-2xl border border-white/10 bg-black/30 p-1">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.7 }}
              className="w-full rounded-xl bg-gradient-to-t from-pulse via-aqua to-volt shadow-[0_0_28px_rgba(249,115,22,0.35)]"
            />
          </div>
          <span className="text-xs font-black text-white/45">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

function RadarScoreChart({ items }) {
  return (
    <div className="mt-6 grid gap-4">
      {items.map((item, index) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-black text-white/70">{item.label}</span>
            <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-ink">{item.value}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/50">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${item.value}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
              className={`h-full rounded-full ${item.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DecisionDonutChart({ decisions }) {
  const total = Math.max(1, decisions.reduce((sum, item) => sum + item.value, 0));
  let offset = 0;
  const gradient = decisions
    .map((item) => {
      const start = offset;
      const end = offset + (item.value / total) * 100;
      offset = end;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <motion.div
        initial={{ rotate: -90, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto grid h-48 w-48 place-items-center rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full bg-ink text-center shadow-[inset_0_0_35px_rgba(0,0,0,0.7)]">
          <div>
            <p className="text-3xl font-black text-volt">{total}</p>
            <p className="text-xs font-black uppercase text-white/45">alerts</p>
          </div>
        </div>
      </motion.div>
      <div className="grid gap-3">
        {decisions.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
              <span className="font-black capitalize">{item.label}</span>
            </div>
            <span className="text-sm font-black text-white/55">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildRealisticAnalytics({ insights, plan, sessions, notificationEvents, user }) {
  const targetHours = Number(user?.dailyFocusHours || plan.dailyFocusHours || 4);
  const sessionMinutes = sessions.reduce((sum, session) => sum + Number(session.durationMinutes || 0), 0);
  const completed = sessions.filter((session) => session.endedAt || session.ended_at).length;
  const sessionCount = sessions.length;
  const completionRate = sessionCount ? Math.round((completed / sessionCount) * 100) : Math.max(52, Math.min(84, targetHours * 12));
  const focusScore = Number(insights.averageFocusScore || plan.focusScore || 88);
  const consistency = Math.max(45, Math.min(98, Math.round((sessionMinutes / Math.max(1, targetHours * 60)) * 72 + completionRate * 0.28)));
  const notificationPressure = Math.max(
    18,
    Math.min(99, Math.round((notificationEvents.length * 9 + Number(plan.blockedAlerts || 24)) / Math.max(1, targetHours / 3))),
  );
  const recoveryScore = Math.max(45, Math.min(98, Math.round(100 - notificationPressure * 0.35 + completed * 3)));
  const priorityScore = Number(plan.priorityAccuracy || 94);
  const weeklyBars = (insights.weeklyRhythm || [76, 81, 74, focusScore, 84, 88, 82]).map((value, index) => {
    const sessionBoost = sessions[index % Math.max(1, sessions.length)]?.focusScore || 0;
    return Math.max(35, Math.min(99, Math.round(Number(value) * 0.75 + sessionBoost * 0.25 || value)));
  });
  const decisions = ['allow', 'summarize', 'batch', 'mute'].map((label) => ({
    label,
    value: Math.max(0, notificationEvents.filter((event) => event.decision === label).length),
    color: {
      allow: '#ffcf33',
      summarize: '#ff8a00',
      batch: '#ff5a1f',
      mute: '#c2410c',
    }[label],
  }));
  if (decisions.every((item) => item.value === 0)) {
    decisions[0].value = Math.max(3, Math.round(priorityScore / 24));
    decisions[1].value = Math.max(4, Math.round(notificationPressure / 18));
    decisions[2].value = Math.max(5, Math.round(Number(plan.blockedAlerts || 24) / 5));
    decisions[3].value = Math.max(2, Math.round(notificationPressure / 28));
  }
  const radar = [
    { label: 'Focus', value: focusScore, color: 'bg-gradient-to-r from-pulse to-volt' },
    { label: 'Consistency', value: consistency, color: 'bg-gradient-to-r from-aqua to-volt' },
    { label: 'Completion', value: completionRate, color: 'bg-gradient-to-r from-volt to-pulse' },
    { label: 'Recovery', value: recoveryScore, color: 'bg-gradient-to-r from-royal to-aqua' },
    { label: 'Priority filter', value: priorityScore, color: 'bg-gradient-to-r from-aqua to-pulse' },
  ];
  const weakest = radar.reduce((lowest, item) => (item.value < lowest.value ? item : lowest), radar[0]);

  return {
    focusScore,
    completionRate,
    consistency,
    notificationPressure,
    recoveryScore,
    weeklyBars,
    decisions,
    radar,
    weakest,
    fallbackAdvice: `You are currently lagging most in ${weakest.label.toLowerCase()} (${weakest.value}%). Start with one ${plan.blockLength}-minute ${plan.mode} block, keep ${plan.biggestDistraction || user?.biggestDistraction || 'social apps'} batched, and complete the session so your analytics can improve from real data.`,
  };
}

function Stories() {
  return (
    <Page>
      <ShellPage eyebrow="Testimonials" title="Students want focus tools that feel powerful" body="Flashy does not mean messy. FocusAI turns self-control into a crisp, animated, confidence-building student experience.">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((person) => (
            <motion.article key={person.name} whileHover={{ y: -8 }} className="glass overflow-hidden rounded-3xl">
              <img src={person.image} alt={`${person.name} FocusAI outcome`} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1 text-volt">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-aqua">
                    {person.track}
                  </span>
                </div>
                <p className="mt-7 text-lg font-semibold leading-8 text-white/80">"{person.quote}"</p>
                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <p className="font-black">{person.name}</p>
                    <p className="text-sm text-white/45">{person.role}</p>
                  </div>
                  <span className="rounded-2xl bg-white px-3 py-2 text-lg font-black text-ink">{person.score}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <TestimonialsPreview />
      </ShellPage>
    </Page>
  );
}

function TestimonialsPreview() {
  const words = ['Fewer distractions', 'Better revision', 'Smarter alerts', 'Calmer study', 'AI coaching', 'Focus score'];
  return (
    <section className="mt-8 overflow-hidden border-y border-white/10 bg-white/[0.035] py-5">
      <div className="flex w-[200%] animate-marquee gap-3">
        {[...words, ...words, ...words, ...words].map((word, index) => (
          <span key={`${word}-${index}`} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black uppercase text-white/70">
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
      <Icon className={color} />
      <p className={`mt-6 text-4xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-sm font-bold text-white/50">{title}</p>
    </div>
  );
}

function ShellPage({ eyebrow, title, body, children }) {
  return (
    <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={eyebrow} title={title} body={body} />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase text-aqua">{eyebrow}</p>
      <h2 className="text-balance mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-8 text-white/60">{body}</p>}
    </div>
  );
}

function GlowCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });
  const background = useTransform(
    [smoothX, smoothY],
    ([latestX, latestY]) => `radial-gradient(circle at ${latestX}px ${latestY}px, rgba(249,115,22,0.22), transparent 18rem)`,
  );

  useEffect(() => {
    const update = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', update);
    return () => window.removeEventListener('pointermove', update);
  }, [x, y]);

  return <motion.div className="pointer-events-none fixed inset-0 z-0 hidden md:block" style={{ background }} />;
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-white/45">
      FocusAI {year} - MERN-style React and Node architecture with Neon + OpenRouter integrations.
    </footer>
  );
}

export default App;
