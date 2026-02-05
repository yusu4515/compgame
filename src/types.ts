/**
 * ストーリーチャプター定義
 */
export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  narration: string[];
  stage: string;
  monster: string;
  scenario: string;
  playerRole: string;
  cleared: boolean;
  order: number;
}

/**
 * プレイヤー進行状況
 */
export interface PlayerProgress {
  playerId: string;
  nickname: string;
  currentChapter: string;
  clearedChapters: string[];
  isFinalBossDefeated: boolean;
  isBonusUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cloudflare D1 Bindings
 */
export interface Bindings {
  DB: D1Database;
}
