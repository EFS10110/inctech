# inctech

インクライン株式会社ウェブサイトクローン

## 概要

このプロジェクトは、[インクライン株式会社](https://www.inkline.co.jp/)のウェブサイトをローカル環境で動作させるためのクローンです。

## 機能

- 6つのページ（トップ、会社概要、事業内容、ニュース、採用情報、お問い合わせ）
- レスポンシブデザイン
- スライダー機能
- モーダルウィンドウ
- 郵便番号自動入力機能
- お問い合わせフォーム

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. サーバー起動

```bash
npm start
```

### 3. ブラウザでアクセス

- サイト: http://localhost:3000
- 管理パネル: http://localhost:3000/admin

## ファイル構成

```
inctech/
├── index.html          # トップページ
├── company.html        # 会社概要
├── contents.html       # 事業内容
├── news.html           # ニュース
├── recruit.html        # 採用情報
├── contact.html        # お問い合わせ
├── css/
│   ├── style.css       # メインスタイル
│   ├── theme.css       # テーマスタイル
│   ├── common.css      # 共通スタイル
│   ├── files_common.css # ファイル共通
│   ├── files_pc.css    # PC用スタイル
│   ├── modal.css       # モーダル
│   └── inquiry-form.css # お問い合わせフォーム
├── js/
│   ├── modal.js        # モーダル機能
│   └── ajaxzip2.js     # 郵便番号自動入力
├── images/             # 画像ファイル
├── data/               # データファイル
├── server.js           # サーバーファイル
└── package.json        # パッケージ設定
```

## 画像の差し替え

画像ファイルは `images/` ディレクトリに配置してください。

使用されている画像ファイル名:
- slider1.jpg, slider2.jpg (スライダー)
- IMG_1117.jpeg, IMG_1124.jpeg (忘年会)
- 157fc09d1181ffeb1c14d1ebef8a251f.jpg (懇親会)
- unnamed.jpg, IMG_2331.jpeg, 20181120_133132.jpg (採用情報)
- 20210330_110958640.jpg, 20210330_111821001.jpg (社員寮)
- 施工実績画像 (会社概要)

## テキストの打ち換え

各HTMLファイルのテキストを直接編集して差し替えてください。

## ライセンス

ISC License
