// app/admin/[booth_id]/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BoothPanel from './BoothPanel'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function BoothDashboardPage({ params }: PageProps) {
  const { booth_id } = await params

  const { data: booth, error } = await supabase
    .from('booths')
    .select('*')
    .eq('id', booth_id)
    .single()

  if (error || !booth) notFound()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('booth_id', booth_id)
    .in('status', ['called', 'waiting'])

  const calledTicket = tickets?.find((t) => t.status === 'called') ?? null
  const waitingCount = tickets?.filter((t) => t.status === 'waiting').length ?? 0

  return <BoothPanel booth={booth} calledTicket={calledTicket} waitingCount={waitingCount} />
}
