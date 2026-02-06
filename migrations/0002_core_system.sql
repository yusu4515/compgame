-- ユーザー基本情報
CREATE TABLE IF NOT EXISTS users (
  employee_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  current_area TEXT NOT NULL DEFAULT 'prologue',
  title_primary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ユーザー統計・進行管理
CREATE TABLE IF NOT EXISTS user_stats (
  employee_id TEXT PRIMARY KEY,
  legal_kills INTEGER NOT NULL DEFAULT 0,
  finance_kills INTEGER NOT NULL DEFAULT 0,
  hr_kills INTEGER NOT NULL DEFAULT 0,
  labor_kills INTEGER NOT NULL DEFAULT 0,
  infosec_kills INTEGER NOT NULL DEFAULT 0,
  mixed_kills INTEGER NOT NULL DEFAULT 0,
  cleared_quests TEXT NOT NULL DEFAULT '[]',
  last_login_at DATETIME,
  streak_days INTEGER NOT NULL DEFAULT 0,
  weekly_score INTEGER NOT NULL DEFAULT 0,
  weekly_score_updated DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(employee_id)
);

-- ストーリー進行状況
CREATE TABLE IF NOT EXISTS story_progress (
  employee_id TEXT PRIMARY KEY,
  current_chapter TEXT NOT NULL DEFAULT 'prologue',
  cleared_chapters TEXT NOT NULL DEFAULT '[]',
  is_final_boss_defeated INTEGER NOT NULL DEFAULT 0,
  is_bonus_unlocked INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(employee_id)
);

-- 問題バンク
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  tribe TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  choices TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

-- 回答履歴
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  score INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(employee_id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- 称号マスタ
CREATE TABLE IF NOT EXISTS titles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  required_kills INTEGER NOT NULL
);

-- ユーザー称号
CREATE TABLE IF NOT EXISTS user_titles (
  employee_id TEXT NOT NULL,
  title_id TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (employee_id, title_id),
  FOREIGN KEY (employee_id) REFERENCES users(employee_id),
  FOREIGN KEY (title_id) REFERENCES titles(id)
);

-- 週次ランキング履歴
CREATE TABLE IF NOT EXISTS weekly_rankings (
  week_start DATE NOT NULL,
  employee_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (week_start, employee_id)
);

-- Slack通知ログ
CREATE TABLE IF NOT EXISTS slack_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_employee ON quiz_attempts(employee_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_weekly ON user_stats(weekly_score);
