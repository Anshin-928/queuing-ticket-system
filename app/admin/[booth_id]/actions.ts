// app/admin/[booth_id]/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import type { BoothStatus } from '@/types/database'

export async function toggleBoothStatus(boothId: string, currentStatus: BoothStatus) {
  const newStatus: BoothStatus = currentStatus === 'empty' ? 'crowded' : 'empty'

  const { error } = await supabase
    .from('booths')
    .update({ status: newStatus })
    .eq('id', boothId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/${boothId}`)
}

export async function callNextTicket(boothId: string) {
  const { error: doneError } = await supabase
    .from('tickets')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('booth_id', boothId)
    .eq('status', 'called')

  if (doneError) throw new Error(doneError.message)

  const { data: nextTicket, error: fetchError } = await supabase
    .from('tickets')
    .select('id')
    .eq('booth_id', boothId)
    .eq('status', 'waiting')
    .order('updated_at', { ascending: true })
    .limit(1)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      revalidatePath(`/admin/${boothId}`)
      return
    }
    throw new Error(fetchError.message)
  }

  const { error: callError } = await supabase
    .from('tickets')
    .update({ status: 'called', updated_at: new Date().toISOString() })
    .eq('id', nextTicket.id)

  if (callError) throw new Error(callError.message)

  revalidatePath(`/admin/${boothId}`)
}
