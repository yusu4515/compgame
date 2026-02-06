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

export interface UserProfile {
  employeeId: string;
  nickname: string;
  avatarId: string;
  level: number;
  xp: number;
  coins: number;
  currentArea: string;
  titlePrimary: string | null;
}

export interface UserStats {
  legalKills: number;
  financeKills: number;
  hrKills: number;
  laborKills: number;
  infosecKills: number;
  mixedKills: number;
  streakDays: number;
  weeklyScore: number;
  lastLoginAt: string | null;
}

export interface StoryProgress {
  currentChapter: string;
  clearedChapters: string[];
  isFinalBossDefeated: boolean;
  isBonusUnlocked: boolean;
}

export interface QuestionData {
  id?: number;
  domain: string;
  tribe: string;
  difficulty: number;
  questionText: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  score: number;
  xpGained: number;
  coinsGained: number;
  levelUp: boolean;
  newTitle?: string | null;
}

/**
 * Cloudflare D1 Bindings
 */
export interface Bindings {
  DB: D1Database;
  SLACK_WEBHOOK_URL?: string;
}
