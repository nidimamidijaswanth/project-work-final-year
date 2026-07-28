import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { askFocusCoach } from './openrouter.js';
import { ensureSchema, query } from './db.js';
import { loginUser, publicUser, requireAuth, signupUser, updateUserProfile } from './auth.js';
import { analyzeNotification, buildFocusPlan, buildInsights } from './planner.js';

const app = express();
const port = process.env.PORT || 8001;
let databaseReady = !process.env.DATABASE_URL;
let databaseInitError = null;
const deployedFrontendUrl = 'https://focusai-nine.vercel.app';
const allowedFrontendOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '').split(','),
  deployedFrontendUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]
  .map((origin) => origin?.trim())
  .map((origin) => origin?.replace(/\/$/, ''))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const cleanOrigin = origin.replace(/\/$/, '');
  return allowedFrontendOrigins.includes(cleanOrigin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(cleanOrigin);
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 80 }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'FocusAI API',
    health: '/api/health',
    frontend: deployedFrontendUrl,
  });
});

const demoSessions = new Map();
const demoNotifications = new Map();
const demoControls = new Map();

function userStore(store, userId) {
  if (!store.has(userId)) {
    store.set(userId, []);
  }
  return store.get(userId);
}

function normalizeSession(session) {
  return {
    id: session.id,
    mode: session.mode,
    focusScore: Number(session.focus_score || session.focusScore),
    notificationsBlocked: Number(session.notifications_blocked || session.notificationsBlocked || 0),
    durationMinutes: Number(session.duration_minutes || session.durationMinutes || 40),
    notes: session.notes || '',
    startedAt: session.started_at || session.startedAt,
    endedAt: session.ended_at || session.endedAt,
  };
}

function normalizeNotification(event) {
  return {
    id: event.id,
    appName: event.app_name || event.appName,
    message: event.message,
    context: event.context,
    priority: event.priority,
    decision: event.decision,
    importance: Number(event.importance || 50),
    interruptionCost: Number(event.interruption_cost || event.interruptionCost || 50),
    suggestedAction: event.suggested_action || event.suggestedAction,
    createdAt: event.created_at || event.createdAt,
  };
}

function listFromValue(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function defaultFocusControls(user = {}) {
  const distraction = user.biggestDistraction || user.biggest_distraction || 'Instagram';
  const examType = user.examType || user.exam_type || 'Academics';

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

function normalizeFocusControls(controls = {}, user = {}) {
  const defaults = defaultFocusControls(user);
  const priorityContacts = Array.isArray(controls.priorityContacts) ? controls.priorityContacts : defaults.priorityContacts;

  return {
    priorityContacts: priorityContacts
      .map((contact) => ({
        name: String(contact.name || '').trim(),
        relation: String(contact.relation || 'Priority').trim(),
        phone: String(contact.phone || '').trim(),
        allowDuringFocus: contact.allowDuringFocus !== false,
      }))
      .filter((contact) => contact.name),
    allowedGroups: listFromValue(controls.allowedGroups, defaults.allowedGroups),
    blockedChats: listFromValue(controls.blockedChats, defaults.blockedChats),
    blockedApps: listFromValue(controls.blockedApps, defaults.blockedApps),
    studyChannels: listFromValue(controls.studyChannels, defaults.studyChannels),
    studyMusicAllowed: controls.studyMusicAllowed !== false,
    appSwitchLimit: Math.max(1, Number(controls.appSwitchLimit || defaults.appSwitchLimit)),
    alertWindowMinutes: Math.max(1, Number(controls.alertWindowMinutes || defaults.alertWindowMinutes)),
    customRule: String(controls.customRule || defaults.customRule).trim(),
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'FocusAI API',
    database: Boolean(process.env.DATABASE_URL),
    databaseReady,
    databaseError: databaseInitError ? databaseInitError.message : null,
    ai: Boolean(process.env.OPENROUTER_API_KEY),
  });
});

app.use('/api', (req, res, next) => {
  if (process.env.DATABASE_URL && databaseInitError) {
    return res.status(503).json({
      error: 'Database is not ready.',
      detail: process.env.NODE_ENV === 'production' ? undefined : databaseInitError.message,
    });
  }

  return next();
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const session = await signupUser(req.body);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const session = await loginUser(req.body);
    res.json(session);
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json({ user: req.user });
    }

    const result = await query(
      'select id, name, email, study_goal, exam_type, daily_focus_hours, biggest_distraction, study_window from users where id = $1',
      [req.user.id],
    );
    return res.json({ user: result.rows[0] ? publicUser(result.rows[0]) : req.user });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/profile', requireAuth, async (req, res, next) => {
  try {
    const session = await updateUserProfile(req.user.id, req.body);
    res.json(session);
  } catch (error) {
    next(error);
  }
});

app.get('/api/focus-controls', requireAuth, async (req, res, next) => {
  try {
    if (!process.env.DATABASE_URL) {
      const controls = userStore(demoControls, req.user.id)[0] || defaultFocusControls(req.user);
      return res.json({ controls: normalizeFocusControls(controls, req.user) });
    }

    const result = await query('select controls from focus_controls where user_id = $1', [req.user.id]);
    const controls = result.rows[0]?.controls || defaultFocusControls(req.user);
    return res.json({ controls: normalizeFocusControls(controls, req.user) });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/focus-controls', requireAuth, async (req, res, next) => {
  try {
    const controls = normalizeFocusControls(req.body, req.user);

    if (!process.env.DATABASE_URL) {
      demoControls.set(req.user.id, [controls]);
      return res.json({ controls });
    }

    const result = await query(
      `
      insert into focus_controls (user_id, controls)
      values ($1, $2)
      on conflict (user_id)
      do update set controls = excluded.controls, updated_at = now()
      returning controls
      `,
      [req.user.id, controls],
    );

    return res.json({ controls: normalizeFocusControls(result.rows[0].controls, req.user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard', requireAuth, async (req, res, next) => {
  try {
    const plan = buildFocusPlan(req.user);
    let sessions = [];
    let notificationEvents = [];

    if (process.env.DATABASE_URL) {
      sessions = (
        await query(
          `
          select id, mode, focus_score, notifications_blocked, duration_minutes, notes, started_at, ended_at
          from focus_sessions
          where user_id = $1
          order by started_at desc
          limit 8
          `,
          [req.user.id],
        )
      ).rows.map(normalizeSession);

      notificationEvents = (
        await query(
          `
          select id, app_name, message, context, priority, decision, importance, interruption_cost, suggested_action, created_at
          from notification_events
          where user_id = $1
          order by created_at desc
          limit 10
          `,
          [req.user.id],
        )
      ).rows.map(normalizeNotification);
    } else {
      sessions = userStore(demoSessions, req.user.id).slice(-8).reverse().map(normalizeSession);
      notificationEvents = userStore(demoNotifications, req.user.id).slice(-10).reverse().map(normalizeNotification);
    }

    const insights = buildInsights({ plan, sessions, notifications: notificationEvents });

    res.json({
      user: req.user,
      plan,
      insights,
      sessions,
      notificationEvents,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sessions', requireAuth, async (req, res, next) => {
  try {
    const plan = buildFocusPlan(req.user);
    const {
      mode = plan.mode,
      focusScore = plan.focusScore,
      notificationsBlocked = plan.blockedAlerts,
      durationMinutes = plan.blockLength,
      notes = plan.recommendation,
    } = req.body;

    if (!process.env.DATABASE_URL) {
      const session = {
        id: crypto.randomUUID(),
        mode,
        focusScore,
        notificationsBlocked,
        durationMinutes,
        notes,
        startedAt: new Date().toISOString(),
        endedAt: null,
      };
      userStore(demoSessions, req.user.id).push(session);
      return res.status(201).json({ session });
    }

    const result = await query(
      `
      insert into focus_sessions (user_id, student_name, mode, focus_score, notifications_blocked, duration_minutes, plan_snapshot, notes)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id, mode, focus_score, notifications_blocked, duration_minutes, notes, started_at, ended_at
      `,
      [req.user.id, req.user.name, mode, focusScore, notificationsBlocked, durationMinutes, plan, notes],
    );

    res.status(201).json({
      session: normalizeSession(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/sessions/:id/complete', requireAuth, async (req, res, next) => {
  try {
    const { focusScore, notes } = req.body;

    if (!process.env.DATABASE_URL) {
      const sessions = userStore(demoSessions, req.user.id);
      const session = sessions.find((item) => item.id === req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found.' });
      }
      session.endedAt = new Date().toISOString();
      session.focusScore = Number(focusScore || session.focusScore);
      session.notes = notes || session.notes;
      return res.json({ session });
    }

    const result = await query(
      `
      update focus_sessions
      set ended_at = now(),
          focus_score = coalesce($3, focus_score),
          notes = coalesce($4, notes)
      where id = $1 and user_id = $2
      returning id, mode, focus_score, notifications_blocked, duration_minutes, notes, started_at, ended_at
      `,
      [req.params.id, req.user.id, focusScore || null, notes || null],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    return res.json({ session: normalizeSession(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/notifications/analyze', requireAuth, async (req, res, next) => {
  try {
    const analysis = analyzeNotification(req.body, req.user);

    if (!process.env.DATABASE_URL) {
      const event = {
        id: crypto.randomUUID(),
        ...analysis,
        createdAt: new Date().toISOString(),
      };
      userStore(demoNotifications, req.user.id).push(event);
      return res.json({ analysis: event });
    }

    const result = await query(
      `
      insert into notification_events
        (user_id, app_name, message, context, priority, decision, importance, interruption_cost, suggested_action)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id, app_name, message, context, priority, decision, importance, interruption_cost, suggested_action, created_at
      `,
      [
        req.user.id,
        analysis.appName,
        analysis.message,
        analysis.context,
        analysis.priority,
        analysis.decision,
        analysis.importance,
        analysis.interruptionCost,
        analysis.suggestedAction,
      ],
    );

    res.json({ analysis: normalizeNotification(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/coach', requireAuth, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ error: 'Please send a study context message.' });
    }

    const plan = buildFocusPlan(req.user);
    const answer = await askFocusCoach(
      `Student profile:
Name: ${req.user.name}
Goal: ${plan.studyGoal}
Exam/track: ${plan.examType}
Daily focus target: ${req.user.dailyFocusHours || 4} hours
Biggest distraction: ${plan.biggestDistraction}
Best study window: ${plan.studyWindow}

Student request: ${message}`,
    );
    return res.json(answer);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: 'FocusAI could not complete that request.',
    detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
  });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`FocusAI API running on port ${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set PORT to another value, for example PORT=8002.`);
    process.exit(1);
  }
  throw error;
});

ensureSchema()
  .then(() => {
    databaseReady = true;
    databaseInitError = null;
    console.log('FocusAI database schema is ready.');
  })
  .catch((error) => {
    databaseReady = false;
    databaseInitError = error;
    console.error('FocusAI database schema initialization failed.', error);
  });
