import type { Metadata } from 'next'
import ThemeRegistry from './components/ThemeRegistry'

export const metadata: Metadata = {
  title: 'Queuing Ticket System',
  description: 'リアルタイム順番待ち＆整理券発券システム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
