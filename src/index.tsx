import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings, QuestionData, StoryProgress, UserProfile, UserStats } from './types';
import { chapters, getChapter, getNextChapter } from './story-data';
import { generateQuestions } from './questions-data';

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());
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
    id: 'knight_cat',
    name: '猫騎士',
    image: 'https://www.genspark.ai/api/files/s/M9WURAxo',
  },
  {
    id: 'fox_mage',
    name: '狐の魔術師',
    image: 'https://www.genspark.ai/api/files/s/DDprzAcZ',
  },
  {
    id: 'rabbit_paladin',
    name: '白兎の聖騎士',
    image: 'https://www.genspark.ai/api/files/s/VBeNSiuX',
  },
  {
    id: 'wolf_guardian',
    name: '狼の守護者',
    image: 'https://www.genspark.ai/api/files/s/GQDzd3yJ',
  },
  {
    id: 'heroine_knight',
    name: '蒼光の守護騎士',
    image: 'https://www.genspark.ai/api/files/s/VPIZKmZg',
  },
  {
    id: 'queen_mage',
    name: '紫焔の賢妃',
    image: 'https://www.genspark.ai/api/files/s/T34E4bFC',
  },
  {
    id: 'male_knight',
    name: '誓約の騎士',
    image: 'https://www.genspark.ai/api/files/s/1J3zT0iV',
  },
];

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

  if (!userRow || !statsRow || !storyRow) {
    return null;
  }

  const profile: UserProfile = {
    employeeId: userRow.employee_id as string,
    nickname: userRow.nickname as string,
    avatarId: userRow.avatar_id as string,
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

  return { profile, stats, story };
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

app.post('/api/auth/login', async (c) => {
  const { DB } = c.env;
  const { employeeId, nickname, avatarId } = await c.req.json();

  if (!employeeId || !nickname || !avatarId) {
    return c.json({ error: 'employeeId, nickname, avatarId are required' }, 400);
  }

  await ensureQuestionsSeeded(DB);
  await ensureTitlesSeeded(DB);

  const now = new Date();
  const today = getDateString(now);
  const weekStart = getWeekStart(now);

  const existingUser = await DB.prepare('SELECT * FROM users WHERE employee_id = ?')
    .bind(employeeId)
    .first();

  if (!existingUser) {
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
  } else {
    await DB.prepare(
      `UPDATE users SET nickname = ?, avatar_id = ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?`
    ).bind(nickname, avatarId, employeeId).run();
  }

  const statsRow = await DB.prepare('SELECT * FROM user_stats WHERE employee_id = ?').bind(employeeId).first();
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
  ).bind(now.toISOString(), streakDays, weekStart, weekStart, employeeId).run();

  if (loginBonus.coins > 0 || loginBonus.xp > 0) {
    await DB.prepare(
      `UPDATE users
       SET coins = coins + ?, xp = xp + ?, updated_at = CURRENT_TIMESTAMP
       WHERE employee_id = ?`
    ).bind(loginBonus.coins, loginBonus.xp, employeeId).run();
  }

  const profileData = await fetchUserProfile(DB, employeeId);
  if (!profileData) {
    return c.json({ error: 'Failed to login' }, 500);
  }

  if (loginBonus.coins > 0) {
    await sendSlack(
      c.env,
      'daily_login',
      `守護者 ${profileData.profile.nickname} がデイリーログインしました。連続${streakDays}日目。`,
      { employeeId, nickname: profileData.profile.nickname, streakDays }
    );
  }

  return c.json({
    profile: profileData.profile,
    stats: profileData.stats,
    story: profileData.story,
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
  if (!clearedChapters.includes(chapterId)) {
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

  return c.json({
    currentChapter: newCurrentChapter,
    clearedChapters,
    isFinalBossDefeated: isFinalBossDefeated === 1,
    isBonusUnlocked: isBonusUnlocked === 1,
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

  const query = domain === 'mixed'
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
  let timeBonus = 0.6;
  if (timeMs <= 15000) timeBonus = 1.2;
  else if (timeMs <= 30000) timeBonus = 1.0;
  else if (timeMs <= 60000) timeBonus = 0.8;

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
  const { questionText, choices, correctIndex, explanation, difficulty, domain } = await c.req.json();

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

app.post('/api/slack/reaction', async (c) => {
  const { DB } = c.env;
  const { employeeId, coinBonus = 10 } = await c.req.json();

  if (!employeeId) {
    return c.json({ error: 'employeeId required' }, 400);
  }

  await DB.prepare(
    'UPDATE users SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?'
  ).bind(coinBonus, employeeId).run();

  await sendSlack(
    c.env,
    'reaction_bonus',
    `応援リアクションにより守護者 ${employeeId} に ${coinBonus}コインが付与されました。`,
    { employeeId, coinBonus }
  );

  return c.json({ success: true, coinBonus });
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

app.post('/api/slack/reaction', async (c) => {
  const { DB } = c.env;
  const { employeeId, reactionCount } = await c.req.json();

  if (!employeeId || reactionCount === undefined) {
    return c.json({ error: 'employeeId and reactionCount required' }, 400);
  }

  const bonus = Math.min(500, Math.max(0, Number(reactionCount) * 5));
  await DB.prepare('UPDATE users SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?')
    .bind(bonus, employeeId)
    .run();

  await sendSlack(
    c.env,
    'cheer_bonus',
    `守護者への応援が届きました。${bonus}コインを付与しました。`,
    { employeeId, bonus }
  );

  return c.json({ bonus });
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
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.8s ease-out; }
          .bg-hero { background: radial-gradient(circle at top, rgba(76,29,149,0.6), rgba(15,23,42,0.95)); }
          .glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(14px); }
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
