// app/booth/[id]/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BoothPanel from './BoothPanel'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BoothPage({ params }: PageProps) {
  const { id } = await params

  const { data: booth, error: boothError } = await supabase
    .from('booths')
    .select('*')
    .eq('id', id)
    .single()

  if (boothError || !booth) notFound()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('booth_id', id)
    .in('status', ['called', 'waiting'])

  const calledTicket = tickets?.find((t) => t.status === 'called') ?? null
  const waitingCount = tickets?.filter((t) => t.status === 'waiting').length ?? 0

  return <BoothPanel booth={booth} calledTicket={calledTicket} waitingCount={waitingCount} />
}
