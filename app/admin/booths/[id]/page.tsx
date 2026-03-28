// app/admin/booths/[id]/page.tsx
// /booth/[id] に移行済み
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BoothDetailRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/booth/${id}`)
}
