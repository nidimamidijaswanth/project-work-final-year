import pg from 'pg';

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  : null;

export async function query(sql, params = []) {
  if (!pool) {
    return { rows: [] };
  }
  return pool.query(sql, params);
}

export async function ensureSchema() {
  if (!pool) {
    return;
  }

  await query(`
    create extension if not exists pgcrypto;
  `);

  await query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      email text not null unique,
      password_hash text not null,
      study_goal text,
      exam_type text,
      daily_focus_hours integer not null default 4,
      biggest_distraction text,
      study_window text,
      created_at timestamptz not null default now()
    );
  `);

  await query(`
    alter table users
      add column if not exists study_goal text,
      add column if not exists exam_type text,
      add column if not exists daily_focus_hours integer not null default 4,
      add column if not exists biggest_distraction text,
      add column if not exists study_window text;
  `);

  await query(`
    create table if not exists focus_sessions (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      student_name text not null,
      mode text not null,
      focus_score integer not null default 80,
      notifications_blocked integer not null default 0,
      duration_minutes integer not null default 40,
      plan_snapshot jsonb,
      notes text,
      started_at timestamptz not null default now(),
      ended_at timestamptz
    );
  `);

  await query(`
    alter table focus_sessions
      add column if not exists user_id uuid references users(id) on delete cascade,
      add column if not exists duration_minutes integer not null default 40,
      add column if not exists plan_snapshot jsonb,
      add column if not exists notes text;
  `);

  await query(`
    create table if not exists notification_events (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      app_name text not null,
      message text not null,
      context text,
      priority text not null,
      decision text not null,
      importance integer not null default 50,
      interruption_cost integer not null default 50,
      suggested_action text,
      created_at timestamptz not null default now()
    );
  `);

  await query(`
    alter table notification_events
      add column if not exists user_id uuid references users(id) on delete cascade,
      add column if not exists context text,
      add column if not exists importance integer not null default 50,
      add column if not exists interruption_cost integer not null default 50,
      add column if not exists suggested_action text;
  `);

  await query(`
    create table if not exists focus_controls (
      user_id uuid primary key references users(id) on delete cascade,
      controls jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
  `);
}
