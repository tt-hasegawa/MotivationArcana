# MotivationArcana
モチベーションの源泉を探る心理ゲーム

## 概要
このプロジェクトは、Next.jsで構築されたPWA（Progressive Web App）です。ユーザーが自分のモチベーションの源泉を探ることができる心理ゲームアプリケーションです。

## 機能
- 📱 PWA対応（オフライン動作、ホーム画面への追加可能）
- 🎯 モチベーションカードのドロー機能
- 🎨 レスポンシブデザイン
- ⚡ GitHub Pagesでの自動デプロイ

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm

### インストール
```bash
# リポジトリをクローン
git clone https://github.com/tt-hasegawa/MotivationArcana.git
cd MotivationArcana

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## スクリプト
- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクション用ビルド
- `npm run start` - ビルド後のアプリケーションを起動
- `npm run lint` - ESLintによるコード品質チェック

## デプロイ
このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

### デプロイ設定
1. リポジトリのSettings → Pages → Source を「GitHub Actions」に設定
2. `main`ブランチにプッシュすると自動的にビルド・デプロイが実行されます

### 手動デプロイ
```bash
# ビルド実行
npm run build

# outディレクトリが生成され、GitHub Pagesにデプロイされます
```

## 技術スタック
- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **PWA**: next-pwa
- **スタイリング**: CSS-in-JS (インライン)
- **デプロイ**: GitHub Pages + GitHub Actions

## ライセンス
MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。
