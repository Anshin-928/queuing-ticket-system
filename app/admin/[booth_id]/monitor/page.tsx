// app/admin/[booth_id]/monitor/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MonitorView from './MonitorView'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function MonitorPage({ params }: PageProps) {
  const { booth_id } = await params

  const [{ data: booth, error }, { data: tickets }] = await Promise.all([
    supabase.from('booths').select('*').eq('id', booth_id).single(),
    supabase
      .from('tickets')
      .select('*')
      .eq('booth_id', booth_id)
      .in('status', ['called', 'waiting', 'on_hold'])
      .order('ticket_number', { ascending: true }),
  ])

  if (error || !booth) notFound()

  return <MonitorView booth={booth} initialTickets={tickets ?? []} />
}
