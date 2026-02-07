import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings, QuestionData, StoryProgress, TownStatus, UserProfile, UserStats } from './types';
import { chapters, getChapter, getNextChapter } from './story-data';
import { generateQuestions } from './questions-data';

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());
app.use('/api/*', async (c, next) => {
  await ensureCoreSchema(c.env.DB);
  await next();
});
app.use('/static/*', serveStatic({ root: './public' }));

const TITLE_SEEDS = [
  { id: 'legal_guardian_10', name: '鉄壁の監視者', domain: 'legal', required: 10, description: '法務分野の幻影族を10体浄化' },
  { id: 'legal_guardian_30', name: '誓約の監査官', domain: 'legal', required: 30, description: '法務分野の幻影族を30体浄化' },
  { id: 'legal_guardian_60', name: '真理の守護聖', domain: 'legal', required: 60, description: '法務分野の幻影族を60体浄化' },
  { id: 'finance_guardian_10', name: '金庫の番人', domain: 'finance', required: 10, description: '経理分野の強欲族を10体浄化' },
  { id: 'finance_guardian_30', name: '誠実なる会計士', domain: 'finance', required: 30, description: '経理分野の強欲族を30体浄化' },
  { id: 'finance_guardian_60', name: '黄金律の守護者', domain: 'finance', required: 60, description: '経理分野の強欲族を60体浄化' },
  { id: 'hr_guardian_10', name: '対話の司祭', domain: 'hr', required: 10, description: '人事分野の毒霧族を10体浄化' },
  { id: 'hr_guardian_30', name: '慈愛の紡ぎ手', domain: 'hr', required: 30, description: '人事分野の毒霧族を30体浄化' },
  { id: 'hr_guardian_60', name: '調和の守護者', domain: 'hr', required: 60, description: '人事分野の毒霧族を60体浄化' },
  { id: 'labor_guardian_10', name: '時の調律師', domain: 'labor', required: 10, description: '労務分野の怠惰族を10体浄化' },
  { id: 'labor_guardian_30', name: '休息の番人', domain: 'labor', required: 30, description: '労務分野の怠惰族を30体浄化' },
  { id: 'labor_guardian_60', name: '健全なる大守護', domain: 'labor', required: 60, description: '労務分野の怠惰族を60体浄化' },
  { id: 'infosec_guardian_10', name: '結界の術師', domain: 'infosec', required: 10, description: '情シス分野の密偵族を10体浄化' },
  { id: 'infosec_guardian_30', name: '影狩りの司令', domain: 'infosec', required: 30, description: '情シス分野の密偵族を30体浄化' },
  { id: 'infosec_guardian_60', name: '永遠のセキュリティ守護', domain: 'infosec', required: 60, description: '情シス分野の密偵族を60体浄化' },
  { id: 'mixed_guardian_30', name: '真の守護者', domain: 'mixed', required: 30, description: '複合問題を30回浄化' },
];

const AVATAR_LIST = [
  {
    id: 'avatar-heroine-knight',
    name: 'ヒロインナイト',
    image: '/static/assets/avatars/avatar-heroine-knight.png',
  },
  {
    id: 'avatar-male-knight',
    name: 'ナイト',
    image: '/static/assets/avatars/avatar-male-knight.png',
  },
  {
    id: 'avatar-queen-mage',
    name: 'クイーンメイジ',
    image: '/static/assets/avatars/avatar-queen-mage.png',
  },
  {
    id: 'avatar-fox-mage',
    name: 'フォックスメイジ',
    image: '/static/assets/avatars/avatar-fox-mage.png',
  },
  {
    id: 'avatar-rabbit-paladin',
    name: 'ラビットパラディン',
    image: '/static/assets/avatars/avatar-rabbit-paladin.png',
  },
  {
    id: 'avatar-wolf-guardian',
    name: 'ウルフガーディアン',
    image: '/static/assets/avatars/avatar-wolf-guardian.png',
  },
  {
    id: 'avatar-knight-cat',
    name: 'キャットナイト',
    image: '/static/assets/avatars/avatar-knight-cat.png',
  },
];

const DEFAULT_AVATAR_ID = AVATAR_LIST[0]?.id ?? 'avatar-heroine-knight';
const ADMIN_PASSWORD = 'acrovekanri';
const WEEKLY_RESET_DAY = 1; // Monday

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getWeekStart(date: Date): string {
  const day = date.getUTCDay();
  const diff = (day < WEEKLY_RESET_DAY ? 7 : 0) + day - WEEKLY_RESET_DAY;
  const weekStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  weekStart.setUTCDate(weekStart.getUTCDate() - diff);
  return getDateString(weekStart);
}

function calculateLevel(xp: number): number {
  let level = 1;
  let threshold = 120;
  while (xp >= threshold) {
    level += 1;
    threshold += level * 120;
  }
  return level;
}

async function createUsersTable(DB: D1Database) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS users (
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
    )`
  ).run();
}

async function createTownTable(DB: D1Database) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS town_prosperity (
      employee_id TEXT PRIMARY KEY,
      town_level INTEGER NOT NULL DEFAULT 0,
      fog_cleared INTEGER NOT NULL DEFAULT 0,
      inn_rebuilt INTEGER NOT NULL DEFAULT 0,
      bank_rebuilt INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES users(employee_id)
    )`
  ).run();
}

async function ensureCoreSchema(DB: D1Database) {
  const usersInfo = await DB.prepare("PRAGMA table_info('users')").all();
  const userColumns = (usersInfo.results ?? []).map((row) => row.name as string);

  if (userColumns.length === 0) {
    await createUsersTable(DB);
  } else if (!userColumns.includes('employee_id')) {
    await DB.prepare('ALTER TABLE users RENAME TO users_legacy').run();
    await createUsersTable(DB);

    const selectEmployeeId = userColumns.includes('employeeId') ? 'employeeId' : "''";
    const selectNickname = userColumns.includes('nickname') ? 'nickname' : "''";
    const selectLevel = userColumns.includes('level') ? 'level' : '1';
    const selectXp = userColumns.includes('xp') ? 'xp' : '0';
    const selectCoins = userColumns.includes('coins') ? 'coins' : '0';

    await DB.prepare(
      `INSERT INTO users (employee_id, nickname, avatar_id, level, xp, coins, current_area)
       SELECT ${selectEmployeeId}, ${selectNickname}, '${DEFAULT_AVATAR_ID}', ${selectLevel}, ${selectXp}, ${selectCoins}, 'prologue'
       FROM users_legacy`
    ).run();
    await DB.prepare('DROP TABLE users_legacy').run();
  }

  const townInfo = await DB.prepare("PRAGMA table_info('town_prosperity')").all();
  const townColumns = (townInfo.results ?? []).map((row) => row.name as string);

  if (townColumns.length === 0) {
    await createTownTable(DB);
  } else if (!townColumns.includes('employee_id')) {
    await DB.prepare('ALTER TABLE town_prosperity RENAME TO town_prosperity_legacy').run();
    await createTownTable(DB);
    await DB.prepare('DROP TABLE town_prosperity_legacy').run();
  }

  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS user_stats (
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
    )`
  ).run();

  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS story_progress (
      employee_id TEXT PRIMARY KEY,
      current_chapter TEXT NOT NULL DEFAULT 'prologue',
      cleared_chapters TEXT NOT NULL DEFAULT '[]',
      is_final_boss_defeated INTEGER NOT NULL DEFAULT 0,
      is_bonus_unlocked INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES users(employee_id)
    )`
  ).run();

  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS admin_edit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      payload TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  await DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_employee ON admin_edit_logs(employee_id)'
  ).run();
  await DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_question ON admin_edit_logs(question_id)'
  ).run();
}

async function ensureQuestionsSeeded(DB: D1Database) {
  const countRow = await DB.prepare('SELECT COUNT(*) as count FROM questions').first();
  const count = (countRow?.count as number) || 0;
  if (count >= 500) return;

  const questions = generateQuestions();
  const batches: D1PreparedStatement[] = [];

  for (const question of questions) {
    const statement = DB.prepare(
      `INSERT INTO questions (domain, tribe, difficulty, question_text, choices, correct_index, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      question.domain,
      question.tribe,
      question.difficulty,
      question.questionText,
      JSON.stringify(question.choices),
      question.correctIndex,
      question.explanation
    );
    batches.push(statement);
  }

  const chunkSize = 50;
  for (let i = 0; i < batches.length; i += chunkSize) {
    await DB.batch(batches.slice(i, i + chunkSize));
  }
}

async function ensureTitlesSeeded(DB: D1Database) {
  const countRow = await DB.prepare('SELECT COUNT(*) as count FROM titles').first();
  const count = (countRow?.count as number) || 0;
  if (count > 0) return;

  const statements = TITLE_SEEDS.map((title) =>
    DB.prepare(
      'INSERT INTO titles (id, name, description, domain, required_kills) VALUES (?, ?, ?, ?, ?)'
    ).bind(title.id, title.name, title.description, title.domain, title.required)
  );

  await DB.batch(statements);
}

async function ensureTownStatus(DB: D1Database, employeeId: string) {
  const row = await DB.prepare('SELECT employee_id FROM town_prosperity WHERE employee_id = ?')
    .bind(employeeId)
    .first();
  if (row) return;

  await DB.prepare(
    `INSERT INTO town_prosperity (employee_id, town_level, fog_cleared, inn_rebuilt, bank_rebuilt)
     VALUES (?, 0, 0, 0, 0)`
  )
    .bind(employeeId)
    .run();
}

async function ensureUserStats(DB: D1Database, employeeId: string, weekStart: string) {
  const row = await DB.prepare('SELECT employee_id FROM user_stats WHERE employee_id = ?')
    .bind(employeeId)
    .first();
  if (row) return;

  await DB.prepare(
    `INSERT INTO user_stats (employee_id, last_login_at, streak_days, weekly_score, weekly_score_updated)
     VALUES (?, NULL, 0, 0, ?)`
  )
    .bind(employeeId, weekStart)
    .run();
}

async function ensureStoryProgress(DB: D1Database, employeeId: string) {
  const row = await DB.prepare('SELECT employee_id FROM story_progress WHERE employee_id = ?')
    .bind(employeeId)
    .first();
  if (row) return;

  await DB.prepare(
    `INSERT INTO story_progress (employee_id, current_chapter, cleared_chapters)
     VALUES (?, 'prologue', '[]')`
  )
    .bind(employeeId)
    .run();
}

const BULLETIN_MESSAGES: Record<string, string> = {
  chapter1: 'ほうむの さばくが ひかりに つつまれたぞ!',
  chapter2: 'けいりの めいきゅうが きよめられたぞ!',
  chapter3: 'じんじの もりの どくが はれたぞ!',
  chapter4: 'じょうしすの まちに ひかりが もどったぞ!',
  chapter5: 'ろうむの とけいとうが ときを とりもどしたぞ!',
  final: 'まおうを たおし せいていが かいふくしたぞ!',
  bonus: 'しんの しゅごしゃが うまれたぞ!',
};

async function sendSlack(env: Bindings, eventType: string, message: string, payload: Record<string, unknown>) {
  if (env.SLACK_WEBHOOK_URL) {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  }

  await env.DB.prepare(
    'INSERT INTO slack_events (employee_id, event_type, payload) VALUES (?, ?, ?)'
  ).bind(payload.employeeId ?? null, eventType, JSON.stringify(payload)).run();
}

async function fetchUserProfile(DB: D1Database, employeeId: string) {
  const userRow = await DB.prepare('SELECT * FROM users WHERE employee_id = ?').bind(employeeId).first();
  const statsRow = await DB.prepare('SELECT * FROM user_stats WHERE employee_id = ?').bind(employeeId).first();
  const storyRow = await DB.prepare('SELECT * FROM story_progress WHERE employee_id = ?').bind(employeeId).first();
  const townRow = await DB.prepare('SELECT * FROM town_prosperity WHERE employee_id = ?').bind(employeeId).first();

  if (!userRow || !statsRow || !storyRow || !townRow) {
    return null;
  }

  const profile: UserProfile = {
    employeeId: userRow.employee_id as string,
    nickname: userRow.nickname as string,
    avatarId: (userRow.avatar_id as string) || DEFAULT_AVATAR_ID,
    level: userRow.level as number,
    xp: userRow.xp as number,
    coins: userRow.coins as number,
    currentArea: userRow.current_area as string,
    titlePrimary: (userRow.title_primary as string) || null,
  };

  const stats: UserStats = {
    legalKills: statsRow.legal_kills as number,
    financeKills: statsRow.finance_kills as number,
    hrKills: statsRow.hr_kills as number,
    laborKills: statsRow.labor_kills as number,
    infosecKills: statsRow.infosec_kills as number,
    mixedKills: statsRow.mixed_kills as number,
    streakDays: statsRow.streak_days as number,
    weeklyScore: statsRow.weekly_score as number,
    lastLoginAt: statsRow.last_login_at as string | null,
  };

  const story: StoryProgress = {
    currentChapter: storyRow.current_chapter as string,
    clearedChapters: JSON.parse(storyRow.cleared_chapters as string),
    isFinalBossDefeated: storyRow.is_final_boss_defeated === 1,
    isBonusUnlocked: storyRow.is_bonus_unlocked === 1,
  };

  const town: TownStatus = {
    townLevel: townRow.town_level as number,
    fogCleared: townRow.fog_cleared === 1,
    innRebuilt: townRow.inn_rebuilt === 1,
    bankRebuilt: townRow.bank_rebuilt === 1,
  };

  return { profile, stats, story, town };
}

async function createUser(
  DB: D1Database,
  employeeId: string,
  nickname: string,
  avatarId: string,
  now: Date,
  weekStart: string
) {
  await DB.prepare(
    `INSERT INTO users (employee_id, nickname, avatar_id, level, xp, coins, current_area)
     VALUES (?, ?, ?, 1, 0, 0, 'prologue')`
  ).bind(employeeId, nickname, avatarId).run();

  await DB.prepare(
    `INSERT INTO user_stats (employee_id, last_login_at, streak_days, weekly_score, weekly_score_updated)
     VALUES (?, ?, 1, 0, ?)`
  ).bind(employeeId, now.toISOString(), weekStart).run();

  await DB.prepare(
    `INSERT INTO story_progress (employee_id, current_chapter, cleared_chapters)
     VALUES (?, 'prologue', '[]')`
  ).bind(employeeId).run();

  await ensureTownStatus(DB, employeeId);
}

// =========================================
// API エンドポイント
// =========================================

app.get('/api/avatars', (c) => {
  return c.json({ avatars: AVATAR_LIST });
});

app.get('/api/chapters', (c) => {
  return c.json({ chapters });
});

app.post('/api/auth/register', async (c) => {
  const { DB } = c.env;
  const { employeeId, nickname, avatarId } = await c.req.json();
  const trimmedEmployeeId = typeof employeeId === 'string' ? employeeId.trim() : '';
  const trimmedNickname = typeof nickname === 'string' ? nickname.trim() : '';
  const resolvedAvatarId = avatarId && AVATAR_LIST.some((avatar) => avatar.id === avatarId)
    ? avatarId
    : DEFAULT_AVATAR_ID;

  if (!trimmedEmployeeId || !trimmedNickname) {
    return c.json({ error: 'employeeId and nickname are required' }, 400);
  }

  if (avatarId && !AVATAR_LIST.some((avatar) => avatar.id === avatarId)) {
    return c.json({ error: 'Invalid avatarId' }, 400);
  }

  await ensureQuestionsSeeded(DB);
  await ensureTitlesSeeded(DB);

  const existingUser = await DB.prepare('SELECT 1 FROM users WHERE employee_id = ?')
    .bind(trimmedEmployeeId)
    .first();
  if (existingUser) {
    return c.json({ error: 'Employee ID already exists' }, 409);
  }

  const now = new Date();
  const weekStart = getWeekStart(now);

  await createUser(DB, trimmedEmployeeId, trimmedNickname, resolvedAvatarId, now, weekStart);

  const profileData = await fetchUserProfile(DB, trimmedEmployeeId);
  if (!profileData) {
    return c.json({ error: 'Failed to register' }, 500);
  }

  return c.json({
    profile: profileData.profile,
    stats: profileData.stats,
    story: profileData.story,
    town: profileData.town,
    loginBonus: { coins: 0, xp: 0 },
  });
});

app.post('/api/auth/login', async (c) => {
  const { DB } = c.env;
  const { employeeId } = await c.req.json();
  const trimmedEmployeeId = typeof employeeId === 'string' ? employeeId.trim() : '';

  if (!trimmedEmployeeId) {
    return c.json({ error: 'employeeId is required' }, 400);
  }

  await ensureQuestionsSeeded(DB);
  await ensureTitlesSeeded(DB);

  const now = new Date();
  const today = getDateString(now);
  const weekStart = getWeekStart(now);

  const existingUser = await DB.prepare('SELECT * FROM users WHERE employee_id = ?')
    .bind(trimmedEmployeeId)
    .first();

  if (!existingUser) {
    return c.json({ error: 'ユーザーが見つかりません。新規登録してください。' }, 404);
  }

  if (!existingUser.avatar_id) {
    await DB.prepare(
      `UPDATE users SET avatar_id = ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?`
    ).bind(DEFAULT_AVATAR_ID, trimmedEmployeeId).run();
  }

  await ensureUserStats(DB, trimmedEmployeeId, weekStart);
  await ensureStoryProgress(DB, trimmedEmployeeId);
  await ensureTownStatus(DB, trimmedEmployeeId);

  const statsRow = await DB.prepare('SELECT * FROM user_stats WHERE employee_id = ?').bind(trimmedEmployeeId).first();
  let streakDays = (statsRow?.streak_days as number) || 0;
  const lastLoginAt = statsRow?.last_login_at ? getDateString(new Date(statsRow.last_login_at as string)) : null;

  let loginBonus = { coins: 0, xp: 0 };

  if (lastLoginAt !== today) {
    const yesterday = getDateString(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)));
    streakDays = lastLoginAt === yesterday ? streakDays + 1 : 1;
    loginBonus = { coins: 20 + streakDays * 2, xp: 10 + streakDays };
  }

  await DB.prepare(
    `UPDATE user_stats
     SET last_login_at = ?, streak_days = ?,
         weekly_score = CASE WHEN weekly_score_updated = ? THEN weekly_score ELSE 0 END,
         weekly_score_updated = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE employee_id = ?`
  ).bind(now.toISOString(), streakDays, weekStart, weekStart, trimmedEmployeeId).run();

  if (loginBonus.coins > 0 || loginBonus.xp > 0) {
    await DB.prepare(
      `UPDATE users
       SET coins = coins + ?, xp = xp + ?, updated_at = CURRENT_TIMESTAMP
       WHERE employee_id = ?`
    ).bind(loginBonus.coins, loginBonus.xp, trimmedEmployeeId).run();
  }

  const profileData = await fetchUserProfile(DB, trimmedEmployeeId);
  if (!profileData) {
    return c.json({ error: 'Failed to login' }, 500);
  }

  if (loginBonus.coins > 0) {
    await sendSlack(
      c.env,
      'daily_login',
      `守護者 ${profileData.profile.nickname} がデイリーログインしました。連続${streakDays}日目。`,
      { employeeId: trimmedEmployeeId, nickname: profileData.profile.nickname, streakDays }
    );
  }

  return c.json({
    profile: profileData.profile,
    stats: profileData.stats,
    story: profileData.story,
    town: profileData.town,
    loginBonus,
  });
});

app.get('/api/profile/:employeeId', async (c) => {
  const { DB } = c.env;
  const employeeId = c.req.param('employeeId');
  const profileData = await fetchUserProfile(DB, employeeId);

  if (!profileData) {
    return c.json({ error: 'User not found' }, 404);
  }

  const titles = await DB.prepare(
    `SELECT t.id, t.name, t.description, t.domain, t.required_kills
     FROM user_titles ut
     JOIN titles t ON ut.title_id = t.id
     WHERE ut.employee_id = ?`
  ).bind(employeeId).all();

  return c.json({
    profile: profileData.profile,
    stats: profileData.stats,
    story: profileData.story,
    town: profileData.town,
    titles: titles.results,
  });
});

app.post('/api/story/clear', async (c) => {
  const { DB } = c.env;
  const { employeeId, chapterId } = await c.req.json();

  if (!employeeId || !chapterId) {
    return c.json({ error: 'employeeId and chapterId required' }, 400);
  }

  const chapter = getChapter(chapterId);
  if (!chapter) {
    return c.json({ error: 'Invalid chapter' }, 400);
  }

  const progressRow = await DB.prepare('SELECT * FROM story_progress WHERE employee_id = ?').bind(employeeId).first();
  if (!progressRow) {
    return c.json({ error: 'Story progress not found' }, 404);
  }

  const clearedChapters = JSON.parse(progressRow.cleared_chapters as string) as string[];
  const alreadyCleared = clearedChapters.includes(chapterId);
  if (!alreadyCleared) {
    clearedChapters.push(chapterId);
  }

  const nextChapter = getNextChapter(chapterId);
  const newCurrentChapter = nextChapter ? nextChapter.id : chapterId;
  const isFinalBossDefeated = chapterId === 'final' ? 1 : (progressRow.is_final_boss_defeated as number);
  const isBonusUnlocked = isFinalBossDefeated === 1 ? 1 : (progressRow.is_bonus_unlocked as number);

  await DB.prepare(
    `UPDATE story_progress
     SET current_chapter = ?, cleared_chapters = ?,
         is_final_boss_defeated = ?, is_bonus_unlocked = ?, updated_at = CURRENT_TIMESTAMP
     WHERE employee_id = ?`
  ).bind(newCurrentChapter, JSON.stringify(clearedChapters), isFinalBossDefeated, isBonusUnlocked, employeeId).run();

  await DB.prepare(
    'INSERT INTO chapter_clear_history (player_id, chapter_id) VALUES (?, ?)'
  ).bind(employeeId, chapterId).run();

  if (!alreadyCleared) {
    const townRow = await DB.prepare('SELECT * FROM town_prosperity WHERE employee_id = ?')
      .bind(employeeId)
      .first();
    const currentLevel = (townRow?.town_level as number) || 0;
    const newLevel = Math.min(5, currentLevel + 1);
    const fogCleared = newLevel >= 1 ? 1 : 0;
    const innRebuilt = newLevel >= 3 ? 1 : 0;
    const bankRebuilt = newLevel >= 5 ? 1 : 0;

    await DB.prepare(
      `UPDATE town_prosperity
       SET town_level = ?, fog_cleared = ?, inn_rebuilt = ?, bank_rebuilt = ?, updated_at = CURRENT_TIMESTAMP
       WHERE employee_id = ?`
    ).bind(newLevel, fogCleared, innRebuilt, bankRebuilt, employeeId).run();

    const bulletin = BULLETIN_MESSAGES[chapterId];
    if (bulletin) {
      await sendSlack(c.env, 'town_bulletin', `【ごうがい】${bulletin}`, { employeeId, chapterId });
    }
  }

  const townRow = await DB.prepare('SELECT * FROM town_prosperity WHERE employee_id = ?')
    .bind(employeeId)
    .first();

  return c.json({
    currentChapter: newCurrentChapter,
    clearedChapters,
    isFinalBossDefeated: isFinalBossDefeated === 1,
    isBonusUnlocked: isBonusUnlocked === 1,
    town: {
      townLevel: (townRow?.town_level as number) || 0,
      fogCleared: (townRow?.fog_cleared as number) === 1,
      innRebuilt: (townRow?.inn_rebuilt as number) === 1,
      bankRebuilt: (townRow?.bank_rebuilt as number) === 1,
    },
  });
});

app.get('/api/questions/next', async (c) => {
  const { DB } = c.env;
  const employeeId = c.req.query('employeeId');
  const domain = c.req.query('domain') || 'legal';

  if (!employeeId) {
    return c.json({ error: 'employeeId required' }, 400);
  }

  await ensureQuestionsSeeded(DB);

  const userRow = await DB.prepare('SELECT level FROM users WHERE employee_id = ?').bind(employeeId).first();
  if (!userRow) {
    return c.json({ error: 'User not found' }, 404);
  }

  const level = userRow.level as number;
  const targetDifficulty = Math.min(5, Math.max(1, Math.round(level * 0.7)));
  const minDifficulty = Math.max(1, targetDifficulty - 1);
  const maxDifficulty = Math.min(5, targetDifficulty + 1);

  const query =
    domain === 'mixed'
      ? 'SELECT * FROM questions WHERE domain = ? AND difficulty BETWEEN ? AND ? ORDER BY RANDOM() LIMIT 1'
      : 'SELECT * FROM questions WHERE domain = ? AND difficulty BETWEEN ? AND ? ORDER BY RANDOM() LIMIT 1';

  const questionRow = await DB.prepare(query)
    .bind(domain, minDifficulty, maxDifficulty)
    .first();

  if (!questionRow) {
    return c.json({ error: 'Question not found' }, 404);
  }

  const question: QuestionData = {
    id: questionRow.id as number,
    domain: questionRow.domain as string,
    tribe: questionRow.tribe as string,
    difficulty: questionRow.difficulty as number,
    questionText: questionRow.question_text as string,
    choices: JSON.parse(questionRow.choices as string),
    correctIndex: questionRow.correct_index as number,
    explanation: questionRow.explanation as string,
  };

  return c.json({ question });
});

app.post('/api/questions/answer', async (c) => {
  const { DB } = c.env;
  const { employeeId, questionId, choiceIndex, timeMs } = await c.req.json();

  if (!employeeId || !questionId || choiceIndex === undefined || timeMs === undefined) {
    return c.json({ error: 'employeeId, questionId, choiceIndex, timeMs are required' }, 400);
  }

  const questionRow = await DB.prepare('SELECT * FROM questions WHERE id = ?')
    .bind(questionId)
    .first();

  if (!questionRow) {
    return c.json({ error: 'Question not found' }, 404);
  }

  const isCorrect = questionRow.correct_index === choiceIndex;
  const difficulty = questionRow.difficulty as number;
  const basePoint = 100;

  const progressRow = await DB.prepare('SELECT cleared_chapters FROM story_progress WHERE employee_id = ?')
    .bind(employeeId)
    .first();
  const clearedCount = progressRow?.cleared_chapters
    ? (JSON.parse(progressRow.cleared_chapters as string) as string[]).length
    : 0;
  const storyBonus = Math.min(0.15, clearedCount * 0.02);
  const difficultyBonus = Math.min(0.12, (difficulty - 1) * 0.03);
  const fastBonus = Math.min(0.25, storyBonus + difficultyBonus);

  let timeBonus = 0.6;
  if (timeMs <= 15000) timeBonus = 1.1 + fastBonus;
  else if (timeMs <= 30000) timeBonus = 1.0 + fastBonus;
  else if (timeMs <= 60000) timeBonus = 0.85;

  const score = isCorrect ? Math.round(basePoint * difficulty * timeBonus) : Math.round(basePoint * 0.1);
  const xpGained = isCorrect ? 20 * difficulty : 5;
  const coinsGained = isCorrect ? 10 * difficulty : 2;

  const userRow = await DB.prepare('SELECT * FROM users WHERE employee_id = ?').bind(employeeId).first();
  const statsRow = await DB.prepare('SELECT * FROM user_stats WHERE employee_id = ?').bind(employeeId).first();
  if (!userRow || !statsRow) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newXp = (userRow.xp as number) + xpGained;
  const previousLevel = userRow.level as number;
  const newLevel = calculateLevel(newXp);
  const levelUp = newLevel > previousLevel;

  const now = new Date();
  const weekStart = getWeekStart(now);

  await DB.prepare(
    `UPDATE users
     SET xp = ?, level = ?, coins = coins + ?, updated_at = CURRENT_TIMESTAMP
     WHERE employee_id = ?`
  ).bind(newXp, newLevel, coinsGained, employeeId).run();

  await DB.prepare(
    `UPDATE user_stats
     SET weekly_score = CASE WHEN weekly_score_updated = ? THEN weekly_score + ? ELSE ? END,
         weekly_score_updated = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE employee_id = ?`
  ).bind(weekStart, score, score, weekStart, employeeId).run();

  if (isCorrect) {
    const domain = questionRow.domain as string;
    const columnMap: Record<string, string> = {
      legal: 'legal_kills',
      finance: 'finance_kills',
      hr: 'hr_kills',
      labor: 'labor_kills',
      infosec: 'infosec_kills',
      mixed: 'mixed_kills',
    };
    const column = columnMap[domain] || 'mixed_kills';
    await DB.prepare(`UPDATE user_stats SET ${column} = ${column} + 1 WHERE employee_id = ?`)
      .bind(employeeId)
      .run();
  }

  await DB.prepare(
    `INSERT INTO quiz_attempts (employee_id, question_id, is_correct, time_ms, score)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(employeeId, questionId, isCorrect ? 1 : 0, timeMs, score).run();

  let newTitle: string | null = null;
  if (isCorrect) {
    const statsUpdated = await DB.prepare('SELECT * FROM user_stats WHERE employee_id = ?')
      .bind(employeeId)
      .first();
    const killsMap = {
      legal: statsUpdated?.legal_kills as number,
      finance: statsUpdated?.finance_kills as number,
      hr: statsUpdated?.hr_kills as number,
      labor: statsUpdated?.labor_kills as number,
      infosec: statsUpdated?.infosec_kills as number,
      mixed: statsUpdated?.mixed_kills as number,
    };

    for (const title of TITLE_SEEDS) {
      if (killsMap[title.domain as keyof typeof killsMap] >= title.required) {
        const existing = await DB.prepare(
          'SELECT 1 FROM user_titles WHERE employee_id = ? AND title_id = ?'
        ).bind(employeeId, title.id).first();
        if (!existing) {
          await DB.prepare(
            'INSERT INTO user_titles (employee_id, title_id) VALUES (?, ?)'
          ).bind(employeeId, title.id).run();
          newTitle = title.name;
        }
      }
    }

    if (newTitle) {
      await DB.prepare(
        'UPDATE users SET title_primary = ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?'
      ).bind(newTitle, employeeId).run();
    }
  }

  if (levelUp) {
    await sendSlack(
      c.env,
      'level_up',
      `守護者 ${userRow.nickname as string} がレベル ${newLevel} に到達しました。`,
      { employeeId, level: newLevel, nickname: userRow.nickname }
    );
  }

  if (newTitle) {
    await sendSlack(
      c.env,
      'title_awarded',
      `守護者 ${userRow.nickname as string} が称号「${newTitle}」を獲得しました。`,
      { employeeId, title: newTitle, nickname: userRow.nickname }
    );
  }

  return c.json({
    result: {
      isCorrect,
      correctIndex: questionRow.correct_index,
      explanation: questionRow.explanation,
      score,
      xpGained,
      coinsGained,
      levelUp,
      newTitle,
    },
  });
});

app.post('/api/admin/login', async (c) => {
  const { employeeId, password } = await c.req.json();
  const trimmedEmployeeId = typeof employeeId === 'string' ? employeeId.trim() : '';

  if (!trimmedEmployeeId || !password) {
    return c.json({ error: 'employeeId and password are required' }, 400);
  }

  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: 'Invalid admin password' }, 401);
  }

  return c.json({ success: true });
});

app.get('/api/admin/questions', async (c) => {
  const { DB } = c.env;
  const domain = c.req.query('domain');
  const limit = Number(c.req.query('limit') || 20);
  const offset = Number(c.req.query('offset') || 0);

  const whereClause = domain ? 'WHERE domain = ?' : '';
  const params = domain ? [domain, limit, offset] : [limit, offset];

  const rows = await DB.prepare(
    `SELECT id, domain, tribe, difficulty, question_text, choices, correct_index, explanation
     FROM questions
     ${whereClause}
     ORDER BY id
     LIMIT ? OFFSET ?`
  ).bind(...params).all();

  const totalRow = await DB.prepare(
    `SELECT COUNT(*) as count FROM questions ${domain ? 'WHERE domain = ?' : ''}`
  ).bind(...(domain ? [domain] : [])).first();

  return c.json({
    total: (totalRow?.count as number) || 0,
    questions: rows.results.map((row) => ({
      id: row.id,
      domain: row.domain,
      tribe: row.tribe,
      difficulty: row.difficulty,
      questionText: row.question_text,
      choices: JSON.parse(row.choices as string),
      correctIndex: row.correct_index,
      explanation: row.explanation,
    })),
  });
});

app.put('/api/admin/questions/:id', async (c) => {
  const { DB } = c.env;
  const id = Number(c.req.param('id'));
  const {
    adminEmployeeId,
    questionText,
    choices,
    correctIndex,
    explanation,
    difficulty,
    domain,
  } = await c.req.json();
  const trimmedAdminEmployeeId = typeof adminEmployeeId === 'string' ? adminEmployeeId.trim() : '';

  if (!trimmedAdminEmployeeId) {
    return c.json({ error: 'adminEmployeeId is required' }, 400);
  }

  if (!id || !questionText || !choices || correctIndex === undefined || !explanation) {
    return c.json({ error: 'Invalid payload' }, 400);
  }

  await DB.prepare(
    `UPDATE questions
     SET question_text = ?, choices = ?, correct_index = ?, explanation = ?, difficulty = ?, domain = ?
     WHERE id = ?`
  ).bind(
    questionText,
    JSON.stringify(choices),
    correctIndex,
    explanation,
    difficulty ?? 1,
    domain ?? 'legal',
    id
  ).run();

  await DB.prepare(
    `INSERT INTO admin_edit_logs (employee_id, question_id, payload)
     VALUES (?, ?, ?)`
  ).bind(trimmedAdminEmployeeId, id, JSON.stringify({
    questionText,
    choices,
    correctIndex,
    explanation,
    difficulty: difficulty ?? 1,
    domain: domain ?? 'legal',
  })).run();

  return c.json({ success: true });
});

app.get('/api/ranking/weekly', async (c) => {
  const { DB } = c.env;
  const weekStart = getWeekStart(new Date());

  const rankingRows = await DB.prepare(
    `SELECT u.employee_id, u.nickname, u.avatar_id, u.level, u.title_primary, s.weekly_score
     FROM user_stats s
     JOIN users u ON u.employee_id = s.employee_id
     WHERE s.weekly_score_updated = ?
     ORDER BY s.weekly_score DESC
     LIMIT 20`
  ).bind(weekStart).all();

  const ranking = rankingRows.results.map((row, index) => ({
    rank: index + 1,
    employeeId: row.employee_id,
    nickname: row.nickname,
    avatarId: row.avatar_id,
    level: row.level,
    titlePrimary: row.title_primary,
    weeklyScore: row.weekly_score,
  }));

  return c.json({ weekStart, ranking });
});

app.post('/api/slack/weekly-post', async (c) => {
  const { DB } = c.env;
  const weekStart = getWeekStart(new Date());

  const rankingRows = await DB.prepare(
    `SELECT u.employee_id, u.nickname, u.avatar_id, u.level, u.title_primary, s.weekly_score
     FROM user_stats s
     JOIN users u ON u.employee_id = s.employee_id
     WHERE s.weekly_score_updated = ?
     ORDER BY s.weekly_score DESC
     LIMIT 3`
  ).bind(weekStart).all();

  const top3 = rankingRows.results.map((row, index) => ({
    rank: index + 1,
    employeeId: row.employee_id as string,
    nickname: row.nickname as string,
    avatarId: row.avatar_id as string,
    level: row.level as number,
    titlePrimary: row.title_primary as string | null,
    weeklyScore: row.weekly_score as number,
  }));

  const statements = top3.map((entry) =>
    DB.prepare(
      `INSERT OR REPLACE INTO weekly_rankings (week_start, employee_id, score, rank)
       VALUES (?, ?, ?, ?)`
    ).bind(weekStart, entry.employeeId, entry.weeklyScore, entry.rank)
  );

  if (statements.length > 0) {
    await DB.batch(statements);
  }

  const messageLines = top3.map(
    (entry) => `#${entry.rank} ${entry.nickname} (Lv.${entry.level}) - ${entry.weeklyScore}pt ${entry.titlePrimary ?? ''}`
  );
  const message = `🏆 Compliance Quest 週次ランキング TOP3 (${weekStart})\n${messageLines.join('\n')}`;

  await sendSlack(c.env, 'weekly_ranking', message, { weekStart, top3 });

  return c.json({ weekStart, top3 });
});

app.post('/api/slack/bulletin', async (c) => {
  const { employeeId, chapterId } = await c.req.json();

  if (!employeeId || !chapterId) {
    return c.json({ error: 'employeeId and chapterId required' }, 400);
  }

  const bulletin = BULLETIN_MESSAGES[chapterId] || `${chapterId} が きよめられたぞ!`;
  const message = `【ごうがい】${bulletin}`;
  await sendSlack(c.env, 'town_bulletin', message, { employeeId, chapterId });

  return c.json({ success: true, chapterId });
});

app.post('/api/slack/reaction', async (c) => {
  const { DB } = c.env;
  const { employeeId, coinBonus, reactionCount } = await c.req.json();

  if (!employeeId) {
    return c.json({ error: 'employeeId required' }, 400);
  }

  const bonus = typeof coinBonus === 'number'
    ? coinBonus
    : Math.min(500, Math.max(0, Number(reactionCount ?? 0) * 5));

  await DB.prepare(
    'UPDATE users SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?'
  ).bind(bonus, employeeId).run();

  await sendSlack(
    c.env,
    'reaction_bonus',
    `守護者への応援が届きました。${bonus}コインを付与しました。`,
    { employeeId, bonus }
  );

  return c.json({ success: true, bonus });
});

app.post('/api/slack/weekly-top3', async (c) => {
  const { DB } = c.env;
  const weekStart = getWeekStart(new Date());

  const rankingRows = await DB.prepare(
    `SELECT u.employee_id, u.nickname, s.weekly_score
     FROM user_stats s
     JOIN users u ON u.employee_id = s.employee_id
     WHERE s.weekly_score_updated = ?
     ORDER BY s.weekly_score DESC
     LIMIT 3`
  ).bind(weekStart).all();

  const lines = rankingRows.results.map((row, index) => {
    return `${index + 1}位: ${row.nickname}（${row.weekly_score}pt）`;
  });

  const message = lines.length
    ? `【Compliance Quest 週次ランキング】\n${lines.join('\n')}`
    : '【Compliance Quest 週次ランキング】今週の記録はまだありません。';

  await sendSlack(c.env, 'weekly_top3', message, { weekStart });

  return c.json({ message: 'posted', weekStart });
});

// =========================================
// フロントエンドページ
// =========================================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compliance Quest 〜エシカル王国の守護者〜</title>
        <link href="/static/style.css" rel="stylesheet">
        <style>
          body { background: #000; color: #fff; font-family: monospace; text-align: center; padding: 40px 20px; }
          .landing { border: 4px solid #fff; max-width: 840px; margin: 0 auto; padding: 24px; }
          .landing-image { width: 100%; border: 4px solid #fff; display: block; }
          .landing-actions { margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          .landing-actions a {
            background: #fff;
            color: #000;
            padding: 10px 20px;
            text-decoration: none;
            font-weight: bold;
            border: 2px solid #fff;
            min-width: 140px;
          }
          .landing-actions a.secondary {
            background: #000;
            color: #fff;
          }
        </style>
    </head>
    <body>
      <div class="landing">
        <img class="landing-image" src="/static/assets/visuals/key-visual.png" alt="Compliance Quest" />
        <div class="landing-actions">
          <a href="/game">ゲームスタート</a>
          <a href="/game">ログイン</a>
          <a href="/game" class="secondary">しんきとうろく</a>
          <a href="/game" class="secondary">かんりがめん</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/game', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compliance Quest 〜エシカル王国の守護者〜</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.8s ease-out; }
          .bg-hero { background: radial-gradient(circle at top, rgba(124,58,237,0.6), rgba(12,18,34,0.92)); }
          .glass {
            background: rgba(18, 26, 48, 0.75);
            border: 1px solid rgba(247, 215, 116, 0.18);
            backdrop-filter: blur(16px);
            box-shadow: 0 20px 40px rgba(10, 15, 30, 0.45);
          }
        </style>
    </head>
    <body class="bg-slate-950 text-white min-h-screen">
        <div id="app"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
