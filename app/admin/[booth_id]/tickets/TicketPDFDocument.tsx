// app/admin/[booth_id]/tickets/TicketPDFDocument.tsx
// @react-pdf/renderer のコンポーネント群（SSR不可・クライアントサイドのみ）

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const COLS = 4
const ROWS = 4

// A4 = 595.28 x 841.89 pt（余白なし・紙の端まで使用）
const PAGE_W = 595.28
const PAGE_H = 841.89

const TICKET_W = PAGE_W / COLS   // 148.82pt
const TICKET_H = PAGE_H / ROWS   // 210.47pt

const PADDING_H   = 8   // 左右 padding
const PADDING_TOP = 6
const PADDING_BOT = 8
const TOP_BAR_H   = 5

// テキスト・画像の配置に使える幅
const CONTENT_W = TICKET_W - PADDING_H * 2  // 132.82pt

// ブース名 / イベント名 の表示サイズ
// ※ TicketsClient.tsx の canvas サイズと縦横比を一致させること
//   ブース名 canvas: 1200×144 → 1pt = 1200/BOOTH_NAME_W px
//   イベント名 canvas: 1200×54 → 1pt = 1200/EVENT_NAME_W px
const BOOTH_NAME_W = CONTENT_W          // 132.82pt
const BOOTH_NAME_H = 144 * CONTENT_W / 1200  // ≈ 16pt
const EVENT_NAME_W = CONTENT_W          // 132.82pt
const EVENT_NAME_H = 90  * CONTENT_W / 1200  // ≈ 10pt（canvas: 1200×90）

// QRコードサイズを高さから逆算（正方形を保証）
const TOP_BAR_H_VAL = TOP_BAR_H
const INNER_H = TICKET_H - TOP_BAR_H_VAL - PADDING_TOP - PADDING_BOT  // 191.47pt

// gap:2 が 5 箇所、固定コンテンツ合計
const FIXED_H = (
  EVENT_NAME_H +           // イベント名画像 ≈ 10pt
  BOOTH_NAME_H +           // ブース名画像   ≈ 16pt
  (6 * 1.2 + 2) +          // noLabel (fontSize=6, lineHeight=1.2, marginTop=2)
  48 +                     // ticketNumber (fontSize=48, lineHeight=1)
  (0.5 + 4 + 4) +          // divider (height + marginVertical=4)
  5 * 2                    // gap=2 × 5箇所
)  // ≈ 111.5pt

const QR_BOX_PADDING = 4
const QR_SIZE = Math.min(
  Math.floor(INNER_H - FIXED_H - QR_BOX_PADDING * 2),   // 高さ制約 ≈ 75pt
  Math.floor(CONTENT_W          - QR_BOX_PADDING * 2),  // 幅制約  ≈ 124pt
)

const BLUE = '#274a79'

const styles = StyleSheet.create({
  page: {
    width: PAGE_W,
    height: PAGE_H,
    backgroundColor: '#ffffff',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // ── チケット本体 ──────────────────────────────────
  ticket: {
    width: TICKET_W,
    height: TICKET_H,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    borderRight: '1pt dashed #bbbbbb',
    borderBottom: '1pt dashed #bbbbbb',
  },

  // 上部アクセントバー
  topBar: {
    width: '100%',
    height: TOP_BAR_H,
    backgroundColor: BLUE,
  },

  // 内側パディング領域（flex なし・自然な縦積み）
  inner: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: PADDING_H,
    paddingTop: PADDING_TOP,
    paddingBottom: PADDING_BOT,
    gap: 2,
  },

  // イベント名（canvas 画像・明示サイズで比率を保持）
  eventNameImage: {
    width: EVENT_NAME_W,
    height: EVENT_NAME_H,
  },

  // ブース名（canvas 画像・明示サイズで比率を保持）
  boothNameImage: {
    width: BOOTH_NAME_W,
    height: BOOTH_NAME_H,
  },

  // 整理券ラベル（ASCII のみ → Helvetica で正常表示）
  noLabel: {
    fontSize: 6,
    color: '#bbbbbb',
    letterSpacing: 1.2,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginTop: 2,
  },

  // 整理券番号
  ticketNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 1,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },

  // 仕切り線
  divider: {
    width: '80%',
    height: 0.5,
    backgroundColor: '#e8e8e8',
    marginVertical: 4,
  },

  // QRコードボックス（flex なし・明示サイズで正方形を保証）
  qrBox: {
    border: '0.5pt solid #e0e0e0',
    padding: QR_BOX_PADDING,
    backgroundColor: '#fafafa',
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
  },
})

// 右端・下端チケットの border を消す
const noRightBorder  = { borderRight: 'none' } as const
const noBottomBorder = { borderBottom: 'none' } as const

export interface TicketData {
  id: string
  ticket_number: number
  qrDataUrl: string
}

interface Props {
  eventNameDataUrl: string   // イベント名を canvas で描画した PNG data URL
  boothNameDataUrl: string   // ブース名を canvas で描画した PNG data URL
  tickets: TicketData[]
}

export default function TicketPDFDocument({ eventNameDataUrl, boothNameDataUrl, tickets }: Props) {
  const ticketsPerPage = COLS * ROWS
  const pages: TicketData[][] = []
  for (let i = 0; i < tickets.length; i += ticketsPerPage) {
    pages.push(tickets.slice(i, i + ticketsPerPage))
  }

  return (
    <Document>
      {pages.map((pageTickets, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
          <View style={styles.grid}>
            {pageTickets.map((t, i) => {
              const col       = i % COLS
              const row       = Math.floor(i / COLS)
              const isLastCol = col === COLS - 1
              const isLastRow = row === ROWS - 1

              const ticketStyle = [
                styles.ticket,
                ...(isLastCol ? [noRightBorder]  : []),
                ...(isLastRow ? [noBottomBorder] : []),
              ]

              return (
                <View key={t.id} style={ticketStyle}>
                  {/* 上部アクセントバー */}
                  <View style={styles.topBar} />

                  <View style={styles.inner}>
                    {/* イベント名 */}
                    {eventNameDataUrl && (
                      <Image src={eventNameDataUrl} style={styles.eventNameImage} />
                    )}

                    {/* ブース名 */}
                    {boothNameDataUrl && (
                      <Image src={boothNameDataUrl} style={styles.boothNameImage} />
                    )}

                    {/* No. ラベル（ASCII のみ・Helvetica） */}
                    <Text style={styles.noLabel}>No.</Text>

                    {/* 整理券番号 */}
                    <Text style={styles.ticketNumber}>{t.ticket_number}</Text>

                    {/* 仕切り線 */}
                    <View style={styles.divider} />

                    {/* QRコード（flex なし・明示サイズで正方形を保証） */}
                    <View style={styles.qrBox}>
                      <Image src={t.qrDataUrl} style={styles.qrImage} />
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </Page>
      ))}
    </Document>
  )
}
