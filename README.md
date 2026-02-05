# Compliance Quest 〜エシカル王国の守護者〜

## 📖 プロジェクト概要

**Compliance Quest**は、コンプライアンスを楽しく学べるストーリーベースRPGゲームです。エシカル王国を舞台に、5つの分野(法務・経理・人事・情シス・労務)の不祥事を解決しながら、コンプライアンスの重要性を体験的に学びます。

### 🎮 ゲームの特徴
- **ビジュアルノベル形式**: 美しいグラデーション背景とアニメーション演出
- **ストーリー進行管理**: 各チャプターのクリア状態を自動保存
- **進行状況の永続化**: Cloudflare D1データベースで進捗を管理
- **レスポンシブデザイン**: スマートフォン・タブレット対応

---

## 🌐 公開URL

### 開発環境(Sandbox)
- **アプリケーション**: https://3000-ix84xtfbreeasj8vuvc8y-8f57ffe2.sandbox.novita.ai
- **API エンドポイント**: https://3000-ix84xtfbreeasj8vuvc8y-8f57ffe2.sandbox.novita.ai/api/chapters

### 本番環境
- まだデプロイされていません

---

## 🎯 実装済み機能

### ✅ 完了した機能
1. **ストーリーシステム**
   - プロローグ、第1章〜第5章、終章、ボーナスステージの8チャプター
   - 各チャプターのナレーション表示システム
   - チャプター進行度の視覚的表示

2. **進行管理システム**
   - プレイヤー新規作成(ニックネーム登録)
   - チャプタークリア記録
   - 進行状況の自動保存(LocalStorage + D1)
   - 進行状況リセット機能

3. **データベース統合**
   - Cloudflare D1による永続化
   - `player_progress`テーブル(プレイヤー進行状況)
   - `chapter_clear_history`テーブル(クリア履歴)

4. **UI/UX**
   - ビジュアルノベル風のストーリー表示
   - 各チャプター専用のグラデーション背景
   - フェードイン/アニメーション効果
   - ボーナスステージ解放演出

5. **API エンドポイント**
   - `GET /api/chapters` - 全チャプター情報取得
   - `GET /api/chapters/:id` - 特定チャプター取得
   - `GET /api/progress/:playerId` - 進行状況取得
   - `POST /api/progress` - プレイヤー新規作成
   - `POST /api/progress/:playerId/clear/:chapterId` - チャプタークリア
   - `DELETE /api/progress/:playerId` - 進行状況リセット

---

## 🚧 未実装機能

### 📝 今後の実装予定
1. **クイズ/問題システム**
   - 各チャプターでコンプライアンスに関する選択肢問題を出題
   - 正解/不正解によるストーリー分岐
   - スコアリング機能

2. **ランキングシステム**
   - 全プレイヤーのクリアタイム/スコアランキング
   - ボーナスステージクリア者の殿堂入り

3. **アチーブメントシステム**
   - 特定条件達成でバッジ獲得
   - コレクション要素の追加

4. **サウンド/BGM**
   - 各チャプターのBGM
   - 効果音(ボタンクリック、クリア音など)

---

## 📊 データアーキテクチャ

### データモデル

#### `player_progress` テーブル
| カラム名 | 型 | 説明 |
|---------|-----|------|
| player_id | TEXT | プレイヤーID(主キー) |
| nickname | TEXT | ニックネーム |
| current_chapter | TEXT | 現在のチャプターID |
| cleared_chapters | TEXT | クリア済みチャプター(JSON配列) |
| is_final_boss_defeated | INTEGER | 魔王討伐フラグ(0/1) |
| is_bonus_unlocked | INTEGER | ボーナスステージ解放フラグ(0/1) |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

#### `chapter_clear_history` テーブル
| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER | 履歴ID(主キー) |
| player_id | TEXT | プレイヤーID(外部キー) |
| chapter_id | TEXT | チャプターID |
| cleared_at | DATETIME | クリア日時 |

### ストレージサービス
- **Cloudflare D1**: プレイヤー進行状況とクリア履歴の永続化

---

## 🛠️ 技術スタック

### Backend
- **Hono** (v4.11.7) - 軽量Webフレームワーク
- **Cloudflare Workers** - エッジランタイム
- **Cloudflare D1** - SQLiteベースのグローバル分散データベース

### Frontend
- **TailwindCSS** (CDN) - ユーティリティファーストCSS
- **Font Awesome** (v6.4.0) - アイコンライブラリ
- **Axios** (v1.6.0) - HTTPクライアント
- **Vanilla JavaScript** - フロントエンドロジック

### Development Tools
- **Vite** (v6.3.5) - ビルドツール
- **Wrangler** (v4.4.0) - Cloudflare CLI
- **PM2** - プロセスマネージャー(開発環境)
- **Git** - バージョン管理

---

## 🚀 セットアップ & デプロイ

### ローカル開発環境

```bash
# 1. プロジェクトディレクトリに移動
cd /home/user/webapp

# 2. 依存関係インストール(既にインストール済み)
npm install

# 3. D1ローカルデータベースのマイグレーション
npm run db:migrate:local

# 4. ビルド
npm run build

# 5. 開発サーバー起動(PM2)
pm2 start ecosystem.config.cjs

# 6. サービス確認
curl http://localhost:3000

# 7. PM2ログ確認
pm2 logs --nostream
```

### Cloudflare Pages本番デプロイ

```bash
# 1. Cloudflare認証設定(初回のみ)
# setup_cloudflare_api_key ツールを実行

# 2. D1本番データベース作成(初回のみ)
npx wrangler d1 create webapp-production
# 出力されたdatabase_idをwrangler.jsoncに設定

# 3. マイグレーション適用
npm run db:migrate:prod

# 4. ビルド & デプロイ
npm run deploy:prod
```

---

## 📚 ストーリー構成

### チャプター一覧

| ID | タイトル | 分野 | 説明 |
|----|---------|------|------|
| prologue | プロローグ | 導入 | 守護者としての覚醒 |
| chapter1 | 欺瞞の砂漠 | 法務分野 | 景品表示法・下請法違反 |
| chapter2 | 強欲の地下迷宮 | 経理分野 | 公私混同・公金不正使用 |
| chapter3 | 沈黙の毒霧の森 | 人事分野 | パワーハラスメント |
| chapter4 | 影の包囲網 | 情シス分野 | 情報漏洩・セキュリティ |
| chapter5 | 歪んだ時計塔 | 労務分野 | 過重労働・労働基準法違反 |
| final | 成果至上主義の魔王 | 最終決戦 | 魔王プロフィット討伐 |
| bonus | 古の審判所 | 究極の試練 | 全分野複合問題 |

---

## 🎨 UI設計

### カラーパレット
- **プロローグ**: ピンク〜レッドグラデーション
- **第1章(法務)**: ベージュ〜オレンジグラデーション
- **第2章(経理)**: ピンク〜パープルグラデーション
- **第3章(人事)**: ブルー〜ライトブルーグラデーション
- **第4章(情シス)**: オレンジ〜パープルグラデーション
- **第5章(労務)**: パープル〜ブルーグラデーション
- **終章(魔王)**: ピンク〜イエローグラデーション
- **ボーナス**: シアン〜ダークパープルグラデーション

### アニメーション
- **フェードイン**: 0.8秒のイージングアニメーション
- **ホバーエフェクト**: カード上昇 + シャドウ拡大
- **進行度インジケーター**: ドットの色変化

---

## 🧪 テスト方法

### API テスト

```bash
# チャプター一覧取得
curl http://localhost:3000/api/chapters

# プレイヤー作成
curl -X POST http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -d '{"nickname":"テストユーザー"}'

# 進行状況取得
curl http://localhost:3000/api/progress/{player_id}

# チャプタークリア
curl -X POST http://localhost:3000/api/progress/{player_id}/clear/prologue
```

---

## 📁 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx           # メインアプリケーション(Hono)
│   ├── story-data.ts       # ストーリーデータ定義
│   ├── types.ts            # TypeScript型定義
│   └── renderer.tsx        # JSXレンダラー(デフォルト)
├── public/
│   └── static/
│       └── app.js          # フロントエンドJavaScript
├── migrations/
│   └── 0001_initial_schema.sql  # D1データベーススキーマ
├── dist/                   # ビルド出力(自動生成)
├── .wrangler/              # Wranglerキャッシュ(ローカル開発)
├── ecosystem.config.cjs    # PM2設定
├── wrangler.jsonc          # Cloudflare設定
├── package.json            # 依存関係・スクリプト
├── vite.config.ts          # Viteビルド設定
├── tsconfig.json           # TypeScript設定
├── .gitignore              # Git除外設定
└── README.md               # このファイル
```

---

## 🔧 開発コマンド

```bash
# ビルド
npm run build

# ローカル開発サーバー(PM2)
pm2 start ecosystem.config.cjs
pm2 logs --nostream
pm2 restart compliance-quest
pm2 delete compliance-quest

# D1データベース操作
npm run db:migrate:local      # ローカルマイグレーション
npm run db:migrate:prod       # 本番マイグレーション

# ポートクリーンアップ
npm run clean-port

# テスト
npm run test

# デプロイ
npm run deploy:prod
```

---

## 🎓 学習目標

このゲームを通じて、以下のコンプライアンス知識を習得できます:

1. **法務分野**: 景品表示法、下請法、正しい契約の重要性
2. **経理分野**: 公私混同の防止、適正な会計処理
3. **人事分野**: パワーハラスメント防止、相互尊重の文化
4. **情報システム分野**: 情報セキュリティ、情報漏洩リスク管理
5. **労務分野**: 労働基準法、健全な労働環境の維持

---

## 📝 今後の開発推奨事項

1. **問題システムの実装**
   - 各チャプターに3〜5問のクイズを追加
   - 正解率に応じたスコアリング

2. **ランキング機能**
   - クリアタイム記録
   - スコアランキング表示

3. **ソーシャル機能**
   - 成績のSNSシェア
   - チーム対抗戦モード

4. **管理画面**
   - プレイヤー統計表示
   - チャプター別クリア率分析

5. **多言語対応**
   - 英語版の追加
   - i18n対応

---

## 📄 ライセンス

このプロジェクトは教育目的で作成されています。

---

## 👤 開発者

- **プロジェクト作成日**: 2026-02-05
- **技術スタック**: Hono + Cloudflare Pages + D1
- **最終更新日**: 2026-02-05

---

## 🙏 謝辞

このプロジェクトは、企業のコンプライアンス研修をゲーミフィケーションすることで、より効果的な学習体験を提供することを目指しています。

**さあ、守護者よ、エシカル王国を救う旅に出よう!** 🛡️✨
