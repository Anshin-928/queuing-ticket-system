// app/admin/[booth_id]/page.tsx
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function BoothRootPage({ params }: PageProps) {
  const { booth_id } = await params
  redirect(`/admin/${booth_id}/dashboard`)
}
