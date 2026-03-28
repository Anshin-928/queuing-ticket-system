# Queuing Ticket System (リアルタイム順番待ち＆整理券発券システム) の新規構築

あなたは熟練のフロントエンド/フルスタックエンジニアです。Next.js (App Router), Supabase を使用して、イベント用の汎用的な順番待ちシステムをゼロから構築します。

## ⚠️ 絶対ルール（Development Rules）
- **Gitのコミットメッセージは必ず「英語」かつ「Conventional Commits」に準拠して提案すること。**
- **git操作はユーザー自身が行うため、Claude Codeは一切git操作を実行しないこと。**
- コードは TypeScript で記述し、UIには **MUI (Material-UI) を使用すること。Tailwind CSS は使用しない。**

## システムのコア要件
**各ブースごとに受付端末（PC/タブレット）を設置する方式**で運用する。来場者が各ブースの受付端末を直接操作して受付を行い、スタッフがブース管理画面で呼び出しを行うハイブリッド方式です。
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

## 実装済みフェーズ

### Phase 1: 管理者画面（完了）
1. **プロジェクトの初期設定**
   - 必要なパッケージ（Supabaseクライアント、MUI関連等）のインストール済み。
   - `src/types/database.ts` に型定義ファイル作成済み。
2. **管理者画面（ブーススタッフ用ダッシュボード）**
   - URL: `/admin/booths`
   - 各ブースの `status` ('empty' ⇔ 'crowded') を手動で切り替えるトグルUI。
   - 「次の方を呼ぶ」ボタン：
     1. 現在 `status = 'called'` のチケットを `status = 'done'` に更新。
     2. `status = 'waiting'` のうち `updated_at` が最も古いものを `status = 'called'` に更新。

### Phase 2: 各ブース用受付画面（完了）
- URL: `/reception/[booth_id]`（Next.js Dynamic Routes）
- ブース名を大きく表示、人数（1〜10名）選択UI、「受付する」ボタン。
- **パターンA（empty / 直行モード）**: `direct` ステータスのチケットログを新規 INSERT し、完了メッセージ表示後に自動リセット。
- **パターンB（crowded / 整理券モード）**: `unissued` かつ最小 `ticket_number` のチケットを `waiting` に更新し、整理券番号を大きく表示。`unissued` 残数ゼロ時はエラーメッセージ。
- サクセス/エラーメッセージは 6 秒後に自動リセット（連続受付対応）。

## 今後の実装タスク

次のフェーズ指示があるまで待機。

---

## 終盤に実装するセキュリティ対策 TODO

### TODO-SEC-1: 管理画面の認証保護
- **対象URL:** `/admin/*` 全体
- **方針:** Supabase Auth（メール＋パスワード）で認証を実装し、Next.js の `middleware.ts` でセッションチェックを行う。未認証アクセスは `/login` にリダイレクト。
- **運用想定:** 学園祭規模のためスタッフ全員で1アカウントを共有する形でも可。

### TODO-SEC-2: QRコードURLの推測対策
- **背景:** 整理券PDFに印刷するQRコードが来場者のスマホからスキャンされるため、URLに連番（ticket_number）を使うと他人の整理券情報を推測・閲覧できてしまう。
- **方針:** QRコードのURLには `tickets.id`（UUID）を使用し、`ticket_number` は紙面上の人間可読な番号としてのみ使う。
  - 印刷面: 「整理券 **5番**」と大きく表示 → スタッフが「5番の方〜」と呼ぶため
  - QRコードURL: `/ticket/[tickets.id]` → UUIDで推測不可
- **実装タイミング:** 整理券PDF生成フェーズ（`/admin/[booth_id]/tickets`）と同時に実装する。