// app/admin/[booth_id]/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

function revalidate(boothId: string) {
  revalidatePath(`/admin/${boothId}`)
}

/** 最も古い waiting チケットを called にする（現在の called はそのまま） */
export async function callNextTicket(boothId: string) {
  const { data: nextTicket, error: fetchError } = await supabase
    .from('tickets')
    .select('id')
    .eq('booth_id', boothId)
    .eq('status', 'waiting')
    .order('updated_at', { ascending: true })
    .limit(1)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') { revalidate(boothId); return }
    throw new Error(fetchError.message)
  }

  const { error } = await supabase
    .from('tickets')
    .update({ status: 'called', updated_at: new Date().toISOString() })
    .eq('id', nextTicket.id)

  if (error) throw new Error(error.message)
  revalidate(boothId)
}

/** 特定の waiting チケットを called にする */
export async function callSpecificTicket(ticketId: string, boothId: string) {
  const { error } = await supabase
    .from('tickets')
    .update({ status: 'called', updated_at: new Date().toISOString() })
    .eq('id', ticketId)
    .eq('status', 'waiting')

  if (error) throw new Error(error.message)
  revalidate(boothId)
}

/** called チケットを done にする */
export async function completeTicket(ticketId: string, boothId: string) {
  const { error } = await supabase
    .from('tickets')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
  revalidate(boothId)
}

/** called チケットを waiting に戻す */
export async function returnToWaiting(ticketId: string, boothId: string) {
  const { error } = await supabase
    .from('tickets')
    .update({ status: 'waiting', updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
  revalidate(boothId)
}
