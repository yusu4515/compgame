-- ユーザーテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    employeeId TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    weapon_id INTEGER DEFAULT 0,
    armor_id INTEGER DEFAULT 0,
    hp INTEGER DEFAULT 100,
    max_hp INTEGER DEFAULT 100
);

-- エリア復興状況テーブル
CREATE TABLE IF NOT EXISTS town_prosperity (
    domain TEXT PRIMARY KEY,
    score INTEGER DEFAULT 0,
    is_restored BOOLEAN DEFAULT 0
);

-- テストユーザー「TEST001」を登録
INSERT OR REPLACE INTO users (employeeId, nickname, level, coins) 
VALUES ('TEST001', '伝説の勇者', 1, 0);

-- 各エリアの初期設定
INSERT OR REPLACE INTO town_prosperity (domain, score) VALUES 
('hr', 0), ('finance', 0), ('legal', 0), ('it', 0), ('labor', 0);