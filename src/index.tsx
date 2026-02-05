import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings, PlayerProgress } from './types';
import { chapters, getChapter, getNextChapter } from './story-data';

const app = new Hono<{ Bindings: Bindings }>();

// CORS設定
app.use('/api/*', cors());

// 静的ファイルの配信
app.use('/static/*', serveStatic({ root: './public' }));

// =========================================
// API エンドポイント
// =========================================

/**
 * 全チャプター情報を取得
 */
app.get('/api/chapters', (c) => {
  return c.json({ chapters });
});

/**
 * 特定チャプター情報を取得
 */
app.get('/api/chapters/:id', (c) => {
  const id = c.req.param('id');
  const chapter = getChapter(id);
  
  if (!chapter) {
    return c.json({ error: 'Chapter not found' }, 404);
  }
  
  return c.json({ chapter });
});

/**
 * プレイヤー進行状況を取得
 */
app.get('/api/progress/:playerId', async (c) => {
  const { DB } = c.env;
  const playerId = c.req.param('playerId');

  try {
    const result = await DB.prepare(
      'SELECT * FROM player_progress WHERE player_id = ?'
    ).bind(playerId).first();

    if (!result) {
      return c.json({ error: 'Player not found' }, 404);
    }

    const progress: PlayerProgress = {
      playerId: result.player_id as string,
      nickname: result.nickname as string,
      currentChapter: result.current_chapter as string,
      clearedChapters: JSON.parse(result.cleared_chapters as string),
      isFinalBossDefeated: result.is_final_boss_defeated === 1,
      isBonusUnlocked: result.is_bonus_unlocked === 1,
      createdAt: result.created_at as string,
      updatedAt: result.updated_at as string,
    };

    return c.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return c.json({ error: 'Failed to fetch progress' }, 500);
  }
});

/**
 * プレイヤー新規作成
 */
app.post('/api/progress', async (c) => {
  const { DB } = c.env;
  const { nickname } = await c.req.json();

  if (!nickname || nickname.trim() === '') {
    return c.json({ error: 'Nickname is required' }, 400);
  }

  const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  try {
    await DB.prepare(
      `INSERT INTO player_progress 
       (player_id, nickname, current_chapter, cleared_chapters) 
       VALUES (?, ?, 'prologue', '[]')`
    ).bind(playerId, nickname.trim()).run();

    const progress: PlayerProgress = {
      playerId,
      nickname: nickname.trim(),
      currentChapter: 'prologue',
      clearedChapters: [],
      isFinalBossDefeated: false,
      isBonusUnlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return c.json({ progress }, 201);
  } catch (error) {
    console.error('Error creating player:', error);
    return c.json({ error: 'Failed to create player' }, 500);
  }
});

/**
 * チャプタークリア処理
 */
app.post('/api/progress/:playerId/clear/:chapterId', async (c) => {
  const { DB } = c.env;
  const playerId = c.req.param('playerId');
  const chapterId = c.req.param('chapterId');

  try {
    // プレイヤー情報を取得
    const playerData = await DB.prepare(
      'SELECT * FROM player_progress WHERE player_id = ?'
    ).bind(playerId).first();

    if (!playerData) {
      return c.json({ error: 'Player not found' }, 404);
    }

    // チャプター情報を検証
    const chapter = getChapter(chapterId);
    if (!chapter) {
      return c.json({ error: 'Invalid chapter' }, 400);
    }

    // クリア済みチャプターリストを更新
    const clearedChapters = JSON.parse(playerData.cleared_chapters as string) as string[];
    if (!clearedChapters.includes(chapterId)) {
      clearedChapters.push(chapterId);
    }

    // 次のチャプターを取得
    const nextChapter = getNextChapter(chapterId);
    const newCurrentChapter = nextChapter ? nextChapter.id : chapterId;

    // 魔王討伐フラグ
    const isFinalBossDefeated = chapterId === 'final';
    
    // ボーナスステージ解放フラグ(魔王討伐後)
    const isBonusUnlocked = isFinalBossDefeated || playerData.is_final_boss_defeated === 1;

    // データベース更新
    await DB.prepare(
      `UPDATE player_progress 
       SET current_chapter = ?, 
           cleared_chapters = ?, 
           is_final_boss_defeated = ?,
           is_bonus_unlocked = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE player_id = ?`
    ).bind(
      newCurrentChapter,
      JSON.stringify(clearedChapters),
      isFinalBossDefeated ? 1 : playerData.is_final_boss_defeated,
      isBonusUnlocked ? 1 : 0,
      playerId
    ).run();

    // クリア履歴を記録
    await DB.prepare(
      'INSERT INTO chapter_clear_history (player_id, chapter_id) VALUES (?, ?)'
    ).bind(playerId, chapterId).run();

    const progress: PlayerProgress = {
      playerId,
      nickname: playerData.nickname as string,
      currentChapter: newCurrentChapter,
      clearedChapters,
      isFinalBossDefeated: isFinalBossDefeated || playerData.is_final_boss_defeated === 1,
      isBonusUnlocked,
      createdAt: playerData.created_at as string,
      updatedAt: new Date().toISOString(),
    };

    return c.json({ progress, message: 'Chapter cleared!' });
  } catch (error) {
    console.error('Error clearing chapter:', error);
    return c.json({ error: 'Failed to clear chapter' }, 500);
  }
});

/**
 * 進行状況リセット
 */
app.delete('/api/progress/:playerId', async (c) => {
  const { DB } = c.env;
  const playerId = c.req.param('playerId');

  try {
    await DB.prepare('DELETE FROM player_progress WHERE player_id = ?')
      .bind(playerId)
      .run();
    
    await DB.prepare('DELETE FROM chapter_clear_history WHERE player_id = ?')
      .bind(playerId)
      .run();

    return c.json({ message: 'Progress reset successfully' });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return c.json({ error: 'Failed to reset progress' }, 500);
  }
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
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          .typing-effect {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 2s steps(40);
          }
          .narration-text {
            line-height: 2;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          }
          .chapter-card {
            transition: all 0.3s ease;
          }
          .chapter-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .bg-gradient-fantasy {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .bg-gradient-prologue {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .bg-gradient-chapter1 {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          }
          .bg-gradient-chapter2 {
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          }
          .bg-gradient-chapter3 {
            background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
          }
          .bg-gradient-chapter4 {
            background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%);
          }
          .bg-gradient-chapter5 {
            background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
          }
          .bg-gradient-final {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          }
          .bg-gradient-bonus {
            background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
          }
        </style>
    </head>
    <body class="bg-gray-900 text-white min-h-screen">
        <div id="app"></div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
