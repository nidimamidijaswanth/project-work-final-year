import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const demoUsers = new Map();
const jwtSecret = process.env.JWT_SECRET || 'focusai-local-dev-secret-change-before-production';

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    studyGoal: user.study_goal || user.studyGoal || '',
    examType: user.exam_type || user.examType || '',
    dailyFocusHours: Number(user.daily_focus_hours || user.dailyFocusHours || 4),
    biggestDistraction: user.biggest_distraction || user.biggestDistraction || '',
    studyWindow: user.study_window || user.studyWindow || '',
  };
}

function signToken(user) {
  return jwt.sign(publicUser(user), jwtSecret, { expiresIn: '7d' });
}

export async function signupUser({ name, email, password, studyGoal, examType, dailyFocusHours, biggestDistraction, studyWindow }) {
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    const error = new Error('Name, email, and password are required.');
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters.');
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (!process.env.DATABASE_URL) {
    if (demoUsers.has(cleanEmail)) {
      const error = new Error('An account with this email already exists.');
      error.status = 409;
      throw error;
    }

    const user = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password_hash: passwordHash,
      studyGoal,
      examType,
      dailyFocusHours,
      biggestDistraction,
      studyWindow,
    };
    demoUsers.set(cleanEmail, user);
    return { user: publicUser(user), token: signToken(user) };
  }

  try {
    const result = await query(
      `
      insert into users (name, email, password_hash, study_goal, exam_type, daily_focus_hours, biggest_distraction, study_window)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id, name, email, study_goal, exam_type, daily_focus_hours, biggest_distraction, study_window
      `,
      [
        cleanName,
        cleanEmail,
        passwordHash,
        studyGoal || null,
        examType || null,
        Number(dailyFocusHours) || 4,
        biggestDistraction || null,
        studyWindow || null,
      ],
    );
    const user = result.rows[0];
    return { user: publicUser(user), token: signToken(user) };
  } catch (error) {
    if (error.code === '23505') {
      const duplicate = new Error('An account with this email already exists.');
      duplicate.status = 409;
      throw duplicate;
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanEmail || !password) {
    const error = new Error('Email and password are required.');
    error.status = 400;
    throw error;
  }

  const user = process.env.DATABASE_URL
    ? (
        await query(
          'select id, name, email, password_hash, study_goal, exam_type, daily_focus_hours, biggest_distraction, study_window from users where email = $1',
          [cleanEmail],
        )
      ).rows[0]
    : demoUsers.get(cleanEmail);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  return { user: publicUser(user), token: signToken(user) };
}

export async function updateUserProfile(userId, profile) {
  const allowed = {
    name: profile.name?.trim(),
    studyGoal: profile.studyGoal?.trim(),
    examType: profile.examType?.trim(),
    dailyFocusHours: Number(profile.dailyFocusHours) || 4,
    biggestDistraction: profile.biggestDistraction?.trim(),
    studyWindow: profile.studyWindow?.trim(),
  };

  if (!allowed.name) {
    const error = new Error('Name is required.');
    error.status = 400;
    throw error;
  }

  if (!process.env.DATABASE_URL) {
    const error = new Error('Profile editing needs the database-backed server process.');
    error.status = 501;
    throw error;
  }

  const result = await query(
    `
    update users
    set name = $2,
        study_goal = $3,
        exam_type = $4,
        daily_focus_hours = $5,
        biggest_distraction = $6,
        study_window = $7
    where id = $1
    returning id, name, email, study_goal, exam_type, daily_focus_hours, biggest_distraction, study_window
    `,
    [
      userId,
      allowed.name,
      allowed.studyGoal || null,
      allowed.examType || null,
      allowed.dailyFocusHours,
      allowed.biggestDistraction || null,
      allowed.studyWindow || null,
    ],
  );

  if (!result.rows[0]) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const user = publicUser(result.rows[0]);
  return { user, token: signToken(user) };
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Please login to access FocusAI.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session expired. Please login again.' });
  }
}
