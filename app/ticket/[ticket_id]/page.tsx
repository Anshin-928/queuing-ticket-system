// app/ticket/[ticket_id]/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TicketView from './TicketView'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ ticket_id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticket_id } = await params
  const { data: ticket } = await supabase
    .from('tickets')
    .select('ticket_number, booth_id')
    .eq('id', ticket_id)
    .single()

  if (!ticket) return { title: '整理券' }

  const { data: booth } = await supabase
    .from('booths')
    .select('name')
    .eq('id', ticket.booth_id)
    .single()

  return {
    title: `${booth?.name ?? ''} 整理券 ${ticket.ticket_number}番`,
  }
}

export default async function TicketPage({ params }: Props) {
  const { ticket_id } = await params

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticket_id)
    .single()

  if (!ticket) notFound()

  const { data: booth } = await supabase
    .from('booths')
    .select('*')
    .eq('id', ticket.booth_id)
    .single()

  if (!booth) notFound()

  return <TicketView ticket={ticket} booth={booth} />
}
