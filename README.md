# Compliance Quest 〜エシカル王国の守護者〜

## 📖 プロジェクト概要

**Compliance Quest**は、全従業員がRPG体験を通じてコンプライアンス知識を学ぶ長期運用型の教育ゲームです。法務・経理・人事・情シス・労務の5分野を「五つの聖域」として物語化し、500問以上の問題を段階的に学習します。

### 🎮 ゲームの特徴
- **長期運用設計**: レベル・称号・週次ランキングで数か月の育成体験
- **500問以上のクイズ**: 各分野 + 複合問題で計530問を自動生成
- **ストーリー進行管理**: 章クリアフラグとナレーション演出
- **Slack連携**: ログイン/レベルアップ/称号/週次TOP3通知
- **管理画面**: 問題の編集・レビューを可能にする簡易エディタ

---

## 🌐 公開URL

### 開発環境(Sandbox)
- **アプリケーション**: 未起動（起動手順は後述）
- **API エンドポイント例**: `/api/chapters`, `/api/questions/next`

### 本番環境
- まだデプロイされていません

---

## 🎨 生成済みキービジュアル/素材

- **キービジュアル**: https://www.genspark.ai/api/files/s/MA4YyGZz
- **ワールドマップ**: https://www.genspark.ai/api/files/s/BxEpL1CT
- **モンスター図鑑**: https://www.genspark.ai/api/files/s/DFhffuGV
- **UIアセット**: https://www.genspark.ai/api/files/s/tN1WHn3z
- **アバターラインナップ**: https://www.genspark.ai/api/files/s/zHXdCk65

---

## ✅ 実装済み機能

### コアゲーム
- ユーザー作成（従業員ID + ニックネーム）
- アバター選択
- レベル/XP/コイン/称号
- 週次ランキング
- ストーリー進行（クリアフラグ）

### クイズ機能
- 530問自動生成
- 出題API + 回答API
- 正誤判定 + 解説表示
- スコア計算（難易度 × 時間補正）

### 管理機能
- 問題一覧
- 問題編集（問題文/選択肢/正解/解説）

### Slack連携
- デイリーログイン通知
- レベルアップ通知
- 称号獲得通知
- 週次TOP3投稿
- 応援リアクションによるコイン付与

---

## 🚧 未実装機能

- 本格的な管理画面権限管理（SSO連携）
- 問題の承認フロー（法務/経理など部門別レビュー）
- 本番デプロイ（Cloudflare Pages）

---

## 📊 データアーキテクチャ

### テーブル
- `users` : 従業員ID, ニックネーム, Lv, XP, コイン, 称号
- `user_stats` : 討伐数, 週次スコア, 連続ログイン
- `story_progress` : 章クリアフラグ
- `questions` : 530問
- `quiz_attempts` : 回答履歴
- `titles` / `user_titles`
- `weekly_rankings`
- `slack_events`

### ストレージ
- Cloudflare D1

---

## 🧭 API エンドポイント

### 認証/ユーザー
- `POST /api/auth/login`
- `GET /api/profile/:employeeId`
- `GET /api/avatars`

### ストーリー
- `GET /api/chapters`
- `POST /api/story/clear`

### クイズ
- `GET /api/questions/next?employeeId=...&domain=...`
- `POST /api/questions/answer`

### ランキング
- `GET /api/ranking/weekly`

### 管理
- `GET /api/admin/questions?limit=10&offset=0&domain=legal`
- `PUT /api/admin/questions/:id`

### Slack
- `POST /api/slack/weekly-post`
- `POST /api/slack/reaction`

---

## 🧑‍💻 使い方（ユーザー）
1. 従業員IDとニックネームを入力
2. アバターを選択してログイン
3. ダッシュボードからクイズ挑戦
4. 週次ランキングでスコア競争

---

## ⚙️ 開発手順

```bash
# 1. マイグレーション
cd /home/user/webapp && npm run db:migrate:local

# 2. ビルド
cd /home/user/webapp && npm run build

# 3. 起動
cd /home/user/webapp && pm2 start ecosystem.config.cjs
```

### Slack通知を有効化する場合
`.dev.vars` または Cloudflare Secrets に以下を設定:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 🚀 次の推奨開発
- 部門別レビュー/承認ワークフロー
- 画像素材のゲーム内UI最適化
- D1本番運用とCloudflare Pages公開

---

## 📝 最終更新日
2026-02-06
