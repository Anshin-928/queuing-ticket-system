// app/admin/[booth_id]/dashboard/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BoothDashboard from '../BoothDashboard'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function BoothDashboardPage({ params }: PageProps) {
  const { booth_id } = await params

  const [{ data: booth, error }, { data: tickets }] = await Promise.all([
    supabase.from('booths').select('*').eq('id', booth_id).single(),
    supabase
      .from('tickets')
      .select('*')
      .eq('booth_id', booth_id)
      .in('status', ['called', 'waiting'])
      .order('updated_at', { ascending: true }),
  ])

  if (error || !booth) notFound()

  return <BoothDashboard booth={booth} tickets={tickets ?? []} />
}
