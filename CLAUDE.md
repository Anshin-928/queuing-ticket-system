# Queuing Ticket System (リアルタイム順番待ち＆整理券発券システム) の新規構築

あなたは熟練のフロントエンド/フルスタックエンジニアです。Next.js (App Router), Supabase を使用して、イベント用の汎用的な順番待ちシステムをゼロから構築します。

## ⚠️ 絶対ルール（Development Rules）
- **Gitのコミットメッセージは必ず「英語」かつ「Conventional Commits」に準拠して提案すること。**
- **git操作はユーザー自身が行うため、Claude Codeは一切git操作を実行しないこと。**
- コードは TypeScript で記述し、UIには **MUI (Material-UI) を使用すること。Tailwind CSS は使用しない。**

## システムのコア要件
「総合受付でのタブレット操作（事前印刷済みQR整理券の配布）」と「来場者のスマホでのリアルタイム呼び出し」を組み合わせたハイブリッド方式です。
QR整理券は `@react-pdf/renderer` を用いて、高品質なPDFとしてA4サイズに面付け出力できる機能を後ほど実装します。

## データベース設計 (Supabase)
以下のスキーマでシステムを構築します。

### 1. booths (ブースマスタ)
- id (UUID, PK)
- name (TEXT, UNIQUE)
- status (TEXT) : 'empty' (待ちなし直行モード) | 'crowded' (整理券モード)
- capacity (INTEGER) : デフォルト設定用（今回はメインロジックでは手動切り替えを優先するが持たせておく）
- created_at (TIMESTAMPTZ)

### 2. tickets (整理券・来場ログ)
- id (UUID, PK)
- booth_id (UUID, FK to booths.id)
- ticket_number (INTEGER) : 事前印刷される番号 (例: 1〜200)
- party_size (INTEGER) : グループの人数 (デフォルト0)
- status (TEXT) : 
  - 'unissued' (印刷済みだが未配布)
  - 'waiting' (配布済み・順番待ち)
  - 'called' (呼び出し中)
  - 'done' (体験完了)
  - 'direct' (整理券なしで直接案内した人のログ用)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
※ UNIQUE制約: (booth_id, ticket_number)

## 今回の実行タスク（Phase 1）

まずはシステムの心臓部となる以下の実装を行ってください。

1. **プロジェクトの初期設定**
   - 必要なパッケージ（Supabaseクライアント、MUI関連等）のインストール。
   - 上記スキーマに基づく `src/types/database.ts` の型定義ファイルの作成。
2. **管理者画面（ブーススタッフ用ダッシュボード）の作成**
   - URL: `/admin/booths`
   - 各ブースの `status` ('empty' ⇔ 'crowded') を手動で切り替えるトグルUI。
   - 「次の方を呼ぶ」といったボタンの実装。
     - 【最重要ロジック】このボタンを押した時、以下の2つを順に（またはトランザクションで）実行する：
       1. 現在そのブースで `status = 'called'` になっているチケットを `status = 'done'` に更新する。
       2. その後、そのブースで `status = 'waiting'` のチケットのうち、**`updated_at`（waitingになった日時）が最も古いものを `called` に更新する。**

以上のPhase 1のコード実装が完了したら、コミットメッセージの提案を行い、次の指示を待ってください。