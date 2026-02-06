-- クエスト用スクリプト
CREATE TABLE IF NOT EXISTS quest_scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quest_scripts_chapter ON quest_scripts(chapter_id);

-- 属性装備アイテム
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  effect_value INTEGER NOT NULL,
  price INTEGER NOT NULL
);

-- 町の復興度
CREATE TABLE IF NOT EXISTS town_prosperity (
  employee_id TEXT PRIMARY KEY,
  town_level INTEGER NOT NULL DEFAULT 0,
  fog_cleared INTEGER NOT NULL DEFAULT 0,
  inn_rebuilt INTEGER NOT NULL DEFAULT 0,
  bank_rebuilt INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(employee_id)
);

CREATE INDEX IF NOT EXISTS idx_town_prosperity_level ON town_prosperity(town_level);

-- 初期装備データ
INSERT OR IGNORE INTO items (id, name, description, domain, effect_type, effect_value, price) VALUES
  ('law_shield', 'ほうむの たて', 'ほうむ への まちがい ダメージを へらす', 'legal', 'damage_reduce', 10, 120),
  ('hr_armor', 'じんじの よろい', 'じんじ への けいけんちを ふやす', 'hr', 'xp_boost', 8, 140),
  ('finance_ring', 'けいりの ゆびわ', 'けいり への けいけんちを ふやす', 'finance', 'xp_boost', 8, 140),
  ('labor_boots', 'ろうむの ブーツ', 'ろうむ への まちがい ダメージを へらす', 'labor', 'damage_reduce', 10, 120),
  ('infosec_cloak', 'じょうしすの マント', 'じょうしす への けいけんちを ふやす', 'infosec', 'xp_boost', 8, 140),
  ('hint_scroll', 'ヒントの まきもの', 'こたえの ヒントを ひらく', 'mixed', 'hint', 1, 80);
