# キキコミ - みんなで作る、やさしいレビュー

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-NETLIFY-ID/deploy-status)](https://app.netlify.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0-blue.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

実際に購入した人だけの本音レビューで、コスメ・ファッション・家電まで安心してお買い物できるプラットフォームです。

## 🌟 主な特徴

- 🏆 **本物のレビューのみ**: 購入確認済みのレビューのみを表示
- 💬 **コミュニティチャット**: 商品別のコミュニティで情報交換
- 🤫 **こっそり質問**: レビューした人に匿名で質問可能
- ⭐ **ポイントシステム**: 貢献度に応じたポイント獲得
- 📱 **レスポンシブデザイン**: スマートフォンからデスクトップまで対応

## 🚀 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **バックエンド**: Supabase (PostgreSQL + Auth + Realtime)
- **デプロイ**: Netlify

## 🔧 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール
```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# .env.localファイルを編集してSupabaseの設定を追加

# 開発サーバーの起動
npm run dev
```

## 📦 Supabaseの設定

### 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

### 2. 環境変数の設定
`.env.local`ファイルを作成し、以下の内容を追加：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. データベーススキーマの設定
1. SupabaseのダッシュボードでSQL Editorを開く
2. `supabase-schema.sql`ファイルの内容を実行
3. テーブルとポリシーが作成される

### 4. 認証設定
1. SupabaseダッシュボードのAuthentication > Settings
2. Site URLに`http://localhost:5173`を追加
3. Redirect URLsに`http://localhost:5173/**`を追加

## 📝 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# リンター実行
npm run lint
```

## 🚀 Netlifyでのデプロイ

### 方法1: Netlify CLIを使用

1. Netlify CLIをインストール
```bash
npm install -g netlify-cli
```

2. Netlifyにログイン
```bash
netlify login
```

3. プロジェクトをビルド
```bash
npm run build
```

4. デプロイ
```bash
netlify deploy --prod --dir=dist
```

### 方法2: GitHub連携を使用

1. このリポジトリをGitHubにプッシュ
2. [Netlify](https://netlify.com)にアクセス
3. "New site from Git"を選択
4. GitHubリポジトリを選択
5. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. "Deploy site"をクリック

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── App.tsx         # メインアプリケーション
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── HomePage.tsx    # ホームページ
│   ├── ProductCard.tsx # 商品カード
│   ├── ProductDetail.tsx # 商品詳細ページ
│   ├── CommunityChat.tsx # コミュニティチャット
│   ├── CommunityPage.tsx # コミュニティページ
│   ├── ReviewCard.tsx  # レビューカード
│   └── CategoryNav.tsx # カテゴリーナビゲーション
├── index.css           # グローバルスタイル
└── main.tsx           # エントリーポイント
```

## ⚙️ 設定ファイル

- `netlify.toml`: Netlify用の設定ファイル
- `vite.config.ts`: Viteの設定
- `tailwind.config.js`: Tailwind CSSの設定
- `tsconfig.json`: TypeScriptの設定

## 📄 ライセンス

MIT License

## 👥 コントリビューション

プロジェクトへの貢献を歓迎します！以下の手順で参加できます：

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、GitHubのIssueを作成してください。