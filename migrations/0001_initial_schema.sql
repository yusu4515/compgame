-- プレイヤー進行状況テーブル
CREATE TABLE IF NOT EXISTS player_progress (
  player_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  current_chapter TEXT NOT NULL DEFAULT 'prologue',
  cleared_chapters TEXT NOT NULL DEFAULT '[]',
  is_final_boss_defeated INTEGER NOT NULL DEFAULT 0,
  is_bonus_unlocked INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- チャプタークリア履歴テーブル
CREATE TABLE IF NOT EXISTS chapter_clear_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  cleared_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES player_progress(player_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_player_progress_player_id ON player_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_chapter_clear_player_id ON chapter_clear_history(player_id);
CREATE INDEX IF NOT EXISTS idx_chapter_clear_chapter_id ON chapter_clear_history(chapter_id);
